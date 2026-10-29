---
title: "[이슈] NestJS Cron 작업의 외부 API 에러로 서버가 계속 재시작된 문제"
description: "Cron 작업의 외부 API 502/503 에러가 uncaughtException 핸들러까지 올라가 서버가 반복 재시작된 원인을 분석하고, 재현 실험으로 확인한 Node.js의 동작과 해결 방법을 정리했다."
pubDate: 2026-10-29T15:50:00+09:00
category: "Dev/Trouble-Shooting"
tags: ["NestJS", "Node.js", "Cron", "uncaughtException", "트러블슈팅"]
---

운영 중인 NestJS 서버가 하루에도 몇 번씩 재시작되는 문제가 있었다. 원인을 따라가 보니 Cron 작업에서 호출하는 외부 API의 일시적인 장애가 시작점이었고, 에러가 처리되지 않은 채 프로세스 레벨까지 올라가고 있었다.

처음 분석했던 내용 중 틀린 부분도 있어서, 재현 실험으로 다시 확인한 내용까지 함께 정리한다.

## 문제 발생

서버 로그를 보면 에러가 찍히고 6~8초 뒤에 애플리케이션이 다시 시작되는 패턴이 반복됐다.

```text
[Nest] INFO  2025-06-25 06:19:39 [NestFactory] Starting Nest application...
[Nest] ERROR 2025-06-25 08:51:25 sendInspectionResults error: AxiosError: Request failed with status code 502
[Nest] INFO  2025-06-25 08:51:31 [NestFactory] Starting Nest application...
[Nest] ERROR 2025-06-25 09:12:25 sendInspectionResults error: AxiosError: Request failed with status code 502
[Nest] INFO  2025-06-25 09:12:33 [NestFactory] Starting Nest application...
...
[Nest] ERROR 2025-06-26 04:43:49 sendInspectionResults error: AxiosError: Request failed with status code 503
[Nest] INFO  2025-06-26 04:43:55 [NestFactory] Starting Nest application...
```

- Cron 작업이 주기적으로 검사 결과를 외부 데이터 서버로 전송함
- 외부 서버가 502, 503을 응답할 때마다 재시작이 일어남
- 하루 사이에 같은 패턴이 9번 반복됨

## 원인 분석

### 1. ExceptionFilter는 Cron 에러를 잡지 못한다

`@Catch()` 예외 필터가 등록되어 있는데도 이 에러는 필터에서 잡히지 않았다.

- ExceptionFilter는 `@Controller`, `@Resolver`로 들어온 **요청을 처리하는 흐름** 안에서만 동작함
  - 요청 → 미들웨어 → 가드 → 인터셉터 → 파이프 → 핸들러 → 응답
- `@Cron()`이 붙은 메서드는 요청과 상관없이 스케줄러가 직접 실행함
- 요청 컨텍스트가 없으니 예외 필터 파이프라인에도 들어가지 않음

### 2. Cron 에러가 uncaughtException까지 올라간 이유

메모에는 "Cron 에러는 uncaughtException으로 발생한다"라고 적어 두었는데, 다시 확인해 보니 정확한 설명이 아니었다.

`@nestjs/schedule`은 `@Cron` 메서드를 try/catch로 감싸서 실행한다. 2.0.0, 4.0.0, 6.0.0 패키지 소스(`schedule.explorer.js`)에서 모두 같은 코드를 확인했다.

```js
wrapFunctionInTryCatchBlocks(methodRef, instance) {
  return async (...args) => {
    try {
      await methodRef.call(instance, ...args);
    } catch (error) {
      this.logger.error(error);
    }
  };
}
```

- Cron 메서드 안에서 **await한** 에러는 스케줄러가 잡아서 로그만 남기고 끝남
- 프로세스 레벨까지 올라가는 건 **await되지 않은 Promise**에서 난 에러임
- 예를 들어 아래처럼 `forEach`에 async 콜백을 넘기면, 메서드는 Promise를 기다리지 않고 먼저 끝나버림

```ts
@Cron(CronExpression.EVERY_MINUTE)
async sendInspectionResults() {
  const results = await this.inspectionRepository.findUnsent();

  // forEach는 async 콜백의 Promise를 기다리지 않는다
  results.forEach(async (result) => {
    await this.externalApi.send(result); // 여기서 난 에러는 아무도 잡지 않음
  });
}
```

- 이렇게 버려진 Promise가 reject되면 `unhandledRejection`이 발생함
- Node.js 15부터는 기본 설정(`--unhandled-rejections=throw`)에서 이를 uncaughtException으로 다시 던짐

즉, 에러가 uncaughtException까지 올라왔다는 건 Cron 안 어딘가에 await되지 않은 비동기 호출이 있었다는 뜻이다.

### 3. uncaughtException 핸들러 안에서 다시 에러가 난다

서버에는 처리되지 않은 예외를 이벤트 로깅 서버로 보내는 핸들러가 등록되어 있었다.

```ts
@Injectable()
export class EventService implements OnModuleInit {
  #logger = new Logger(EventService.name);

  constructor(private readonly eventRepository: EventRepository) {}

  async onModuleInit() {
    process.on('uncaughtException', this.#handleUncaughtException);
  }

  #handleUncaughtException = async (error: Error) => {
    this.#logger.error(`An unhandled exception occurred, ${error}`);
    await this.eventRepository.sendEvent({
      level: EventLevel.ERROR,
      message: 'An unhandled exception occurred',
      metadata: { error },
    });
  };
}
```

문제는 핸들러 안의 `sendEvent()`도 외부 호출이라 실패할 수 있는데, 여기에 대한 처리가 없다는 점이다.

- 핸들러가 async 함수라서 `sendEvent()`가 실패하면 또 하나의 처리되지 않은 rejection이 생김
- 이게 다시 uncaughtException으로 올라와 같은 핸들러가 또 호출됨
- 핸들러 → 전송 실패 → 핸들러 → 전송 실패... 가 끝없이 반복됨

처음에는 이 반복 호출 때문에 **콜스택이 넘쳐서(stack overflow) 프로세스가 죽는다**고 판단했다. 그런데 재현해 보니 그렇지 않았다.

### 4. 재현으로 확인한 Node.js의 동작

Node.js 24에서 상황별로 직접 실행해 봤다.

```js
// 핸들러(async) 안의 로깅 호출이 계속 실패하는 경우
let calls = 0;
const sendEvent = async () => {
  await new Promise((r) => setTimeout(r, 10));
  throw new Error('event server 503');
};

process.on('uncaughtException', async (err, origin) => {
  calls++;
  console.log(`handler #${calls} origin=${origin} stackDepth=${new Error().stack.split('\n').length}`);
  await sendEvent();
});

setTimeout(() => {
  throw new Error('cron job failed (502)');
}, 0);

setTimeout(() => {
  console.log(`after 3s: process alive, handler calls=${calls}`);
  process.exit(0);
}, 3000);
```

```text
handler #1 origin=uncaughtException stackDepth=4
handler #2 origin=unhandledRejection stackDepth=7
handler #3 origin=unhandledRejection stackDepth=7
...
handler #200 origin=unhandledRejection stackDepth=7
after 3s: process alive, handler calls=273
```

- 핸들러는 3초 동안 273번 호출됐지만 **콜스택 깊이는 7에서 더 늘지 않음**
- 비동기로 다시 호출되는 구조라 매번 새 콜스택에서 시작하기 때문
- 그리고 이 루프만으로는 프로세스가 **종료되지 않음**. 대신 실패하는 외부 호출과 에러 로그가 끝없이 쌓임

상황별로 정리하면 다음과 같다.

| 상황 | 결과 |
| --- | --- |
| 핸들러 없음 + 처리되지 않은 rejection 발생 | 프로세스 종료 (exit code 1) |
| 핸들러가 **동기적으로** 다시 throw | 프로세스 종료 (exit code 7) |
| async 핸들러 안의 호출이 계속 실패 | 종료되지 않고 핸들러가 무한 반복됨 |
| 핸들러가 정상 처리, `process.exit()` 호출 안 함 | 종료되지 않고 계속 실행됨 |

결국 당시 재시작이 정확히 어떤 경로로 일어났는지는 남아 있는 로그만으로 확정하지 못했다. 다만 **Cron의 외부 호출**과 **핸들러 안의 이벤트 전송**, 이 두 지점 모두 에러를 처리하지 않고 있었던 건 분명했다. 그래서 두 곳을 모두 고쳤다.

## 해결

### 1. Cron 안의 외부 호출은 await하고 직접 처리

```ts
@Cron(CronExpression.EVERY_MINUTE)
async sendInspectionResults() {
  const results = await this.inspectionRepository.findUnsent();

  for (const result of results) {
    try {
      await this.externalApi.send(result);
    } catch (error) {
      // 한 건이 실패해도 나머지는 계속 보내고, 다음 주기에 재시도한다
      this.logger.error(`검사 결과 전송 실패 id=${result.id}`, error);
    }
  }
}
```

- `forEach(async ...)` 대신 `for...of`로 하나씩 await함
- 동시에 보내야 한다면 `Promise.allSettled()`로 모든 결과를 받아서 처리함
- 외부 서버의 일시적인 502/503은 언제든 생길 수 있으니, 실패를 "정상적인 경우"로 보고 처리함

### 2. uncaughtException 핸들러 안의 외부 호출도 try/catch

```ts
#handleUncaughtException = async (error: Error) => {
  this.#logger.error(`An unhandled exception occurred, ${error}`);
  try {
    await this.eventRepository.sendEvent({
      level: EventLevel.ERROR,
      message: 'An unhandled exception occurred',
      metadata: { message: error.message, stack: error.stack },
    });
  } catch (sendError) {
    // 여기서 다시 throw하면 핸들러가 재귀적으로 호출된다
    this.#logger.error(`Failed to send error event, ${sendError}`);
  }
};
```

- 핸들러 안에서 실패할 수 있는 코드는 반드시 try/catch로 감쌈
- `metadata`에 에러 객체를 통째로 넣지 않고 `message`, `stack`만 보냄
  - AxiosError는 request, response 객체를 품고 있어서 크기가 크고 순환 참조가 있어 직렬화에 실패할 수 있음

### 3. (추가) uncaughtException 이후에는 종료하는 게 정석

Node.js 공식 문서에서는 `uncaughtException`을 "최후의 수단"으로 설명한다.

- 처리되지 않은 예외가 발생한 뒤에는 애플리케이션 상태를 신뢰할 수 없음
- 핸들러에서는 로그 기록, 리소스 정리 같은 **동기적인 마무리**만 하고 프로세스를 종료하는 것을 권장함
- 재시작은 Kubernetes, PM2 같은 프로세스 매니저에 맡김

```ts
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception, shutting down', error);
  process.exit(1);
});
```

이번 경우처럼 핸들러에서 에러를 삼키고 계속 실행하면, 문제가 드러나지 않은 채 반쯤 망가진 상태로 서버가 돌아갈 수 있다. 핸들러는 "알림 보내고 계속 돌리기"보다 "기록하고 깔끔하게 죽기" 쪽이 안전하다.

## 결론

- ExceptionFilter는 요청 컨텍스트 안에서만 동작하므로 Cron, 이벤트 리스너, 큐 컨슈머의 에러는 직접 처리해야 함
- `@nestjs/schedule`은 await한 에러는 잡아주지만, await되지 않은 Promise의 에러는 잡지 못함
  - `forEach(async ...)`처럼 Promise를 버리는 코드를 조심해야 함
- uncaughtException 핸들러 안에서 다시 실패하면 핸들러가 끝없이 재호출될 수 있음
  - 콜스택이 넘치는 게 아니라, 비동기로 무한 반복되면서 외부 호출과 로그가 쌓이는 구조임
- uncaughtException 이후에는 상태를 신뢰할 수 없으니, 기록하고 종료한 뒤 재시작은 프로세스 매니저에 맡기는 게 안전함

외부 API는 언제든 실패할 수 있다는 걸 알면서도, 정작 에러를 처리하는 코드가 또 외부 API를 부르고 있었다는 게 이번 일의 핵심이었다. 에러 처리 코드가 실패하는 경우까지 생각해야 한다는 걸 제대로 배웠다.

## 참고

- [Node.js 공식 문서 - Event: 'uncaughtException'](https://nodejs.org/api/process.html#event-uncaughtexception)
- [Node.js 공식 문서 - --unhandled-rejections](https://nodejs.org/api/cli.html#--unhandled-rejectionsmode)
- [NestJS 공식 문서 - Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling)
- [NestJS 공식 문서 - Exception filters](https://docs.nestjs.com/exception-filters)
