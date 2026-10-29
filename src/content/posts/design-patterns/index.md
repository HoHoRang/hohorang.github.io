---
title: "디자인 패턴"
description: "디자인 패턴의 개념과 GoF가 정리한 생성·구조·행위 패턴의 분류와 대표 패턴을 정리했다."
pubDate: 2026-04-09T00:31:31+09:00
category: "CS/ETC"
tags: ["디자인 패턴"]
originalUrl: "https://hohorangrang.tistory.com/90"
---

## 디자인 패턴

소프트웨어 설계에서 반복적으로 나타나는 문제에 대한 검증된 해결책 템플릿.

코드를 직접 복붙하는 게 아니라, 특정 상황에서 어떻게 설계할지에 대한 청사진을 의미함

GoF(Gang of Four)가 정리한 분류 기준으로 크게 3가지로 나뉜다.

\- 생성(Creational): 객체를 어떻게 만들 것인가

\- 구조(Structural): 객체를 어떻게 조합할 것인가

\- 행위(Behavioral): 객체 간 통신을 어떻게 할 것인가

---

## 1. 싱글톤(Singleton) 패턴 - 생성

클래스의 인스턴스를 **딱 하나**만 생성하고, 전역 접근점을 제공한다.

```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}

const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true
```

장점: 전역 상태 공유, 자원 절약

단점: 전역 상태로 인한 테스트 어려움, 멀티스레드 환경에서 동기화 필요

사용처: DB 커넥션 풀, 설정 객체, 로거 등

## 2. 팩토리(Factory) 패턴 - 생성

객체 생성 로직을 별도 메서드/클래스로 분리해, **어떤 클래스를 인스턴스화할지 서브클래스가 결정**하게 한다.

```typescript
interface Animal {
  speak(): string;
}

class Dog implements Animal {
  speak() { return '멍멍'; }
}

class Cat implements Animal {
  speak() { return '야옹'; }
}

class AnimalFactory {
  static create(type: 'dog' | 'cat'): Animal {
    if (type === 'dog') return new Dog();
    if (type === 'cat') return new Cat();
    throw new Error('Unknown animal');
  }
}

const animal = AnimalFactory.create('dog');
console.log(animal.speak()); // 멍멍
```

장점: 생성 로직 은닉, OCP(개방-폐쇄 원칙) 준수

단점: 타입이 늘어날수록 팩토리 클래스가 커짐

사용처: 다양한 결제 수단, 알림 채널(SMS/Email/Push) 생성

## 3. 전략(Strategy) 패턴 - 행위

알고리즘을 인터페이스로 캡슐화해서, **런타임에 교체 가능**하게 한다.

```typescript
interface SortStrategy {
  sort(data: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(data: number[]) { /* 버블 정렬 */ return data; }
}

class QuickSort implements SortStrategy {
  sort(data: number[]) { /* 퀵 정렬 */ return data; }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy) {
    this.strategy = strategy;
  }

  sort(data: number[]) {
    return this.strategy.sort(data);
  }
}

const sorter = new Sorter(new BubbleSort());
sorter.sort([3, 1, 2]);

sorter.setStrategy(new QuickSort()); // 런타임 교체
sorter.sort([3, 1, 2]);
```

장점: 조건문 제거, 알고리즘 독립적 교체

단점: 전략 클래스가 많아질 수 있음

사용처: 정렬, 결제 방식, 인증 전략

## 4. 옵저버(Observer) 패턴 - 행위

객체의 상태 변화 시 **구독한 모든 객체에 자동으로 알림**을 보낸다. 1:N 의존 관계

```typescript
interface Observer {
  update(data: any): void;
}

class EventEmitter {
  private observers: Map<string, Observer[]> = new Map();

  subscribe(event: string, observer: Observer) {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event)!.push(observer);
  }

  notify(event: string, data: any) {
    this.observers.get(event)?.forEach(o => o.update(data));
  }
}

class Logger implements Observer {
  update(data: any) { console.log('Log:', data); }
}

const emitter = new EventEmitter();
emitter.subscribe('order', new Logger());
emitter.notify('order', { id: 1, amount: 5000 }); // Logger 자동 실행
```

장점: 느슨한 결합, 이벤트 기반 확장 용이

단점: 구독 관계가 복잡해지면 디버깅 어려움, 메모리 누수 주의

사용처: 이벤트 시스템, RxJS, Vue reactivity, DOM 이벤트

## 5. 프록시(Proxy) 패턴 - 구조

실제 객체 앞에 **대리 객체**를 두어 접근 제어, 캐싱, 로깅 등의 부가 기능을 추가한다.

```typescript
interface Image {
  display(): void;
}

class RealImage implements Image {
  constructor(private filename: string) {
    console.log(`디스크에서 로딩: ${filename}`); // 비용이 큰 작업
  }
  display() { console.log(`출력: ${this.filename}`); }
}

class ProxyImage implements Image {
  private realImage: RealImage | null = null;

  constructor(private filename: string) {}

  display() {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename); // 지연 초기화
    }
    this.realImage.display();
  }
}

const img = new ProxyImage('photo.jpg');
img.display(); // 이때 비로소 로딩
img.display(); // 캐시된 인스턴스 재사용
```

장점: 지연 로딩, 접근 제어, AOP 구현

단점: 복잡도 증가, 응답 지연 가능

사용처: JavaScript Proxy 객체, ORM lazy loading, API 게이트웨이, 캐시 레이어

## 6. 이터레이터(Iterator) 패턴 - 행위

컬렉션의 내부 구조를 노출하지 않고 **순차 접근**할 수 있는 인터페이스를 제공한다.

```typescript
class Range {
  constructor(private start: number, private end: number) {}

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

const range = new Range(1, 5);
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

console.log([...range]); // [1, 2, 3, 4, 5]
```

장점: 컬렉션 구현과 순회 로직 분리, for...of/spread 연산자와 자연스럽게 통합

단점: 단순 배열엔 오버엔지니어링

사용처: 커서 기반 DB 페이지네이션, 파일 스트림, Generator

## 7. 노출 모듈(Revealing Module) - 구조

즉시 실행 함수(IIFE)나 클로저를 활용해 **공개할 것과 비공개로 숨길 것을 명시적으로 구분**한다.

```typescript
const counter = (() => {
  // private
  let count = 0;
  const validate = (n) => Number.isInteger(n);

  // public (노출할 것만 반환)
  return {
    increment(n = 1) {
      if (validate(n)) count += n;
    },
    decrement(n = 1) {
      if (validate(n)) count -= n;
    },
    getCount() { return count; }
  };
})();

counter.increment(3);
console.log(counter.getCount()); // 3
console.log(counter.count);      // undefined (비공개)
```

장점: 명시적 API 경계, 내부 구현 은닉

단점: private 멤버 테스트 어려움, 모듈 간 순환 참조 시 문제

사용처: ES Module 이전 브라우저 환경, 라이브러리 API 설계

## 8. MVC(Model-View-Controller) 패턴

관심사를 세 계층으로 분리한다.

```typescript
User Input → Controller → Model (상태 변경) → View (렌더링)
```

\- Model: 데이터, 비즈니스 로직

\- View: UI 렌더링

\- Controller: 사용자 입력 받아 분기, Model 조작

단점: Controller가 비대해지기 쉬움, View와 Model의 직접 의존 발생 가능

사용처: Spring MVC, Rails, Django, NestJS

## 9. MVP(Model-View-Presenter) 패턴

MVC에서 Controller 대신 Presenter가 View와 1:1로 대응하며, View는 인터페이스만 노출한다.

```typescript
User Input → View → Presenter → Model
             ↑                   |
             └───────────────────┘
           (View 인터페이스 통해 업데이트)
```

\- View: 화면 표시 + 이벤트 위임. Presenter를 직접 호출

\- Presenter: View 인터페이스에 의존 → View 교체/테스트 용이

\- Model: 데이터, 비즈니스 로직

MVC와의 차이: View가 Model을 모른다. Presenter가 중재자로서 완전히 분리되어 단위 테스트 용이

사용처: Android(초기), WinForms, 테스트 주도 UI 개발

## 10. MVVM(Model-View-ViewModel) 패턴

ViewModel이 View의 상태를 데이터바인딩으로 자동 동기화한다.

```typescript
View  ←──(데이터 바인딩)──→  ViewModel  ←──→  Model
(템플릿/UI)               (상태, 커맨드)      (데이터)
```

\- View: 템플릿. ViewModel의 상태를 바인딩만 함. 로직 없음

\- ViewModel: View의 상태(state)와 커맨드(command)를 보유. Model과 통신

\- Model: 데이터, 비즈니스 로직

MVP와의 차이: Presenter가 View를 직접 조작하는 대신, ViewModel은 바인딩을 통해 자동 반영하여 코드 감소

사용처: Vue, Angular, React, WPF, SwiftUI
