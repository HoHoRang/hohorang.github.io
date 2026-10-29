---
title: "DDD(Domain-Driven Design)"
description: "비즈니스 규칙을 도메인 객체에 담는 DDD(Domain-Driven Design)의 개념을 기능별 모듈화 구조와 비교해 정리했다."
pubDate: 2026-04-14T22:13:21+09:00
category: "CS/ETC"
tags: ["ddd","Design"]
originalUrl: "https://hohorangrang.tistory.com/91"
---

## DDD란

> DDD는 코드 구조가 비즈니스 언어와 규칙을 그대로 반영하도록 설계하는 방법론  
> (핵심은 비즈니스 규칙을 Service가 아닌 Domain 객체 안에 두는 것이다)

---

## 기능별 모듈화 vs DDD

일반적인 기능별 모듈화는 아래와 같은 구조다.

```typescript
src/
├── user/
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.entity.ts
├── order/
│   ├── order.controller.ts
│   ├── order.service.ts
│   └── order.entity.ts
```

이런 구조에선 Entity는 데이터만 들고 있고, 비즈니스 규칙은 Service에 몰린다.

```typescript
// user.service.ts
async updateEmail(userId: string, newEmail: string) {
  const user = await this.userRepo.findById(userId);
  if (!newEmail.includes('@')) throw new Error('형식 오류');
  if (user.status === 'BANNED') throw new Error('정지된 유저');
  if (user.email === newEmail) throw new Error('동일한 이메일');
  user.email = newEmail;
  await this.userRepo.save(user);
}
```

요구사항이 늘어날수록 Service는 비대해지고, 같은 규칙이 여러 Service에 복붙되기 시작한다.

DDD는 비즈니스 규칙을 Entity 안으로 옮기는 것이다.

```typescript
// user.entity.ts (DDD)
export class User {
  changeEmail(newEmail: Email): void {
    if (this.status === UserStatus.BANNED) throw new BannedUserException();
    if (this._email.equals(newEmail)) throw new SameEmailException();
    this._email = newEmail;
  }
}

// user.service.ts (DDD) - 흐름만 조율
async updateEmail(userId: string, newEmail: string) {
  const user = await this.userRepo.findById(userId);
  user.changeEmail(new Email(newEmail));
  await this.userRepo.save(user);
}
```

DDD에서는 Service가 얇아지고 Entity가 비즈니스 행위를 직접 표현한다. 이를 Rich Domain Model이라 한다.

---

## DDD 핵심 구성요소

### Value Object

유효성 검사와 동등성 비교를 값 자체가 담당한다(Service에 넣지 않음).

```typescript
export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new InvalidEmailException(value);
    }
    this.value = value.toLowerCase();
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string { return this.value; }
}
```

이메일 유효성 규칙이 바뀌면 이 파일 하나만 수정하면 된다.

### Aggregate Root

함께 변경되어야 하는 객체들의 묶음. 외부에서는 Root를 통해서만 접근한다.

```typescript
export class Order extends AggregateRoot {
  private items: OrderItem[] = [];

  addItem(productId: string, quantity: number, price: number): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new OrderAlreadyConfirmedException();
    }
    this.items.push(new OrderItem(productId, quantity, price));
  }

  confirm(): void {
    if (this.items.length === 0) throw new EmptyOrderException();
    this.status = OrderStatus.CONFIRMED;
    this.apply(new OrderConfirmedEvent(this.id));
  }
}
```

### Domain Event

도메인에서 발생한 사건을 이벤트로 표현. 다른 도메인에 직접 의존하지 않고 이벤트로 전달한다.

```typescript
// User 생성 시 이메일 발송, 포인트 지급 등을 이벤트로 처리
// User 도메인이 Email, Point 도메인을 직접 알 필요 없음
this.apply(new UserCreatedEvent(this.id, this.email.toString()));
```

---

## NestJS 코드 예시

```typescript
src/
├── user/
│   ├── domain/
│   │   ├── entities/user.entity.ts
│   │   ├── value-objects/email.vo.ts
│   │   └── repositories/user.repository.ts  ← 인터페이스
│   ├── application/
│   │   └── use-cases/create-user.use-case.ts
│   ├── infrastructure/
│   │   └── database/mongo-user.repository.ts ← 구현체
│   └── presentation/
│       ├── controllers/user.controller.ts
│       └── dto/create-user.dto.ts
```

```typescript
// domain/entities/user.entity.ts
export class User {
  private constructor(
    private readonly _id: string,
    private _email: Email,
    private readonly _name: string,
  ) {}

  static create(email: string, name: string): User {
    return new User(crypto.randomUUID(), new Email(email), name);
  }

  changeEmail(newEmail: Email): void {
    if (this._email.equals(newEmail)) throw new SameEmailException();
    this._email = newEmail;
  }

  get email(): Email { return this._email; }
}
```

TypeORM 같은 ORM 사용 시, 도메인 Entity에 데코레이터를 붙여 사용하기도 한다.

엄격하게 사용한다면 도메인 객체와 ORM을 분리한다.

```typescript
// application/use-cases/create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository, // 인터페이스에만 의존
  ) {}

  async execute(email: string, name: string): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new ConflictException('이미 존재하는 이메일');

    const user = User.create(email, name);
    return this.userRepo.save(user);
  }
}
```

---

## Spring 코드 예시

```java
src/main/java/com/example/
├── user/
│   ├── domain/
│   │   ├── model/User.java              ← 순수 도메인 객체
│   │   ├── vo/Email.java
│   │   └── repository/UserRepository.java ← 인터페이스
│   ├── application/
│   │   └── usecase/CreateUserUseCase.java
│   ├── infrastructure/
│   │   └── persistence/
│   │       ├── UserJpaEntity.java        ← ORM Entity (도메인과 분리)
│   │       └── UserRepositoryAdapter.java
│   └── presentation/
│       └── controller/UserController.java
```

```java
// domain/model/User.java - @Entity 없음, 순수 도메인 객체
public class User {
  private final String id;
  private Email email;
  private final String name;

  public static User create(String email, String name) {
    return new User(UUID.randomUUID().toString(), new Email(email), name);
  }

  public void changeEmail(Email newEmail) {
    if (this.email.equals(newEmail)) throw new SameEmailException();
    this.email = newEmail;
  }
}
```

```java
// infrastructure/persistence/UserJpaEntity.java - ORM 전용
@Entity
@Table(name = "users")
public class UserJpaEntity {
  @Id
  private String id;
  private String email;
  private String name;

  public static UserJpaEntity fromDomain(User user) { ... }
  public User toDomain() { ... }  // 도메인 객체로 변환
}
```

Spring에서 중요한 포인트는 도메인 객체(User.java)와 JPA Entity(UserJpaEntity.java)를 분리하는 것이다.

도메인 객체에 @Entity가 붙는 순간 DB 구조에 종속된다.

---

## DDD로 전환을 고려할 타이밍

아래 증상이 보이기 시작하면 전환을 고려하는게 어떤가싶다.

\- Service 메서드에 isAdmin, isSystem 같은 플래그 파라미터가 늘어남

\- 같은 유효성 검사 로직이 여러 Service에 복붙됨

\- 비즈니스 규칙 변경 시 수정해야 할 파일이 너무 많음

\- Service 코드가 길어져서 어디서 규칙이 적용되는지 추적이 어려움

반대로, CRUD 위주의 단순한 서비스라면 기능별 모듈화로 충분하다고 생각한다.
