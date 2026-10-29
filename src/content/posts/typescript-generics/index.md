---
title: "[TypeScript] Generic(제네릭)"
description: "TypeScript Generic(제네릭)으로 타입을 미리 지정하지 않고 다양한 타입에 대응하는 방법과 타입 제약을 정리했다."
pubDate: 2022-04-27T14:37:11+09:00
updatedDate: 2022-04-27T14:37:22+09:00
category: "Language/TypeScript"
tags: ["generic","typescript","제네릭","타입 제약"]
originalUrl: "https://hohorangrang.tistory.com/34"
---

![TypeScript](./image-1.png)

*TypeScript*

## Generic(제네릭) 타입

인터페이스나 클래스, 함수, 타입 별칭 등에 사용할 수 있는 기능으로, 해당 심벌의 타입을 미리 지정하지 않고 다양한 타입에 대응하려고 할 때 사용한다.

```javascript
interface IValueable<T> {
	value: T;
}
```

위의 인터페이스는 value라는 이름의 속성을 가지는데, 속성의 타입을 string, number 등으로 특정하지 않고 T로 지정해 제네릭 타입으로 만들 수 있다. 인터페이스 이름 뒤에 \<T>과 같이 표기한다.

```javascript
// 제네릭 함수
function identity<T>(arg: T): T { return arg };

// 제네릭 타입 별칭
type IValuable<T> = {
	value: T;
}

// 제네릭 클래스
class Valuable<T> {
	constructor(public value: T) {}
}
```

위 코드는 함수, 클래스 등에 제네릭 타입을 사용하는 예이다.

```javascript
interface IValuable<T> {
  value: T;
}

class Valuable<T> implements IValuable<T>
  constructor(public value: T) {}
}

function printValue<T>(o: IValuable<T>): void {
  console.log(o.value);
}

printValue(new Valuable<number>(1)); // 1
printValue(new Valuable<number[]>([1,2,3])); // [1, 2, 3]
```

제네릭 인터페이스인 IValuable\<T>를 구현하는 제네릭 클래스 Valuable\<T>는 자신이 가진 타입 변수 T를 인터페이스 쪽 제네릭 타입 변수로 넘길 수 있다.

그리고 printValue라는 제네릭 함수를 만들어, 자신의 타입 변수 T를 제네릭 인터페이스의 타입 변수로 넘길 수 있다. 함수를 실행하면 다양한 타입이 들어오더라도 동작하는 것을 확인할 수 있다.

```javascript
printValue(new Valuable(1)); // 1
printValue(new Valuable([1,2,3])); // [1, 2, 3]
```

타입 변수 부분을 생략해도 타입스크립트가 스스로 추론해 구체적인 제네릭 타입을 찾아낸다.

## Generic(제네릭) 타입 제약

타입 변수에 적용할 수 있는 타입의 범위를 한정하는 기능을 한다.

```javascript
<최종타입1 extends 타입1, 최종타입2 extends 타입2>(a: 최종타입1, b: 최종타입2, ...) {}
```

```javascript
interface IValuable<T> {
	value: T;
}

const printValueT = <Q, T extends IValuable<Q>>(o: T) => console.log(o.value);

printValueT(new Valuable(1)); // 1
printValueT({value: true}); // true
```

printValueT의 매개변수 타입을 어떤 방식으로 제약하느냐만 다를 뿐, 사용법은 이전에 제네릭 함수 사용법과 같다.

### new 타입 제약

팩토리 함수(factory function)는 new 연산자를 이용해 객체를 생성하는 함수이다. 보통 객체 생성 방법이 복잡할 때 단순하게 사용하기 위해 구현한다.

```javascript
const create = <T>(type: T): T => new type()
```

위의 코드에서 type은 ‘타입'으로, T는 ‘타입의 타입'에 해당한다.

하지만 타입스크립트는 ‘타입의 타입'을 허용하지 않으므로 오류를 발생시킨다.

```javascript
const create = <T extends {new(): T}>(type: T): T => new type()

or

const create = <T>(type: new() => T): T => new type()
```

create 함수의 타입 제약 구문은 중괄호 {}로 new() 부분을 감싸서 new() 부분은 메서드 형태로 표현했다.

new 연산자를 type에 적용하면서 type의 생성자 쪽으로 매개변수를 전달해야 할 때는 아래와 같이 new(...args) 구문을 사용한다.

```javascript
const create = <T>(type: {new(...args): T}, ...args): T => new type(...args)
```

```javascript
const create = <T>(type: { new (...args): T }, ...args): T => new type(...args);

class Point {
  constructor(public x: number, public y: number) {}
}

[
  create(Date), // 2022-04-26T05:48:32.371Z
  create(Point, 0, 0), // Point { x: 0,y: 0 }
].forEach((s) => console.log(s));
```

테스트 코드를 실행하면 create 함수가 클래스 인스턴스를 정상적으로 생성하는 것을 확인할 수 있다.

### 인덱스 타입 제약

```javascript
const obj = {
  name: "Jane",
  age: 22,
  city: "Seoul",
  country: "Korea"
};

const pick = (obj, keys) => keys.map(key => ({[key]: obj[key]}))
          .reduce((result, value) => ({...result, ...value}),{});

pick(obj, ["name", "age"]); // { name: 'Jane', age: 22 }
pick(obj, ["nam", "agge"]); // { nam: undefined, agge: undefined }
```

위 코드에서는 obj로 선언된 객체에서, “name”, “age” 속성만을 추출해 새로운 객체를 만들려고 한다.

pick 함수는 객체와 추출하려는 속성의 배열을 매개변수로 받아, 해당 속성만으로 새로운 객체를 생성해준다.

하지만, “nam”, “agge”와 같이 오타가 발생하면 다른 결과가 나오기 때문에, 방지할 목적으로 keyof T 형태로 타입 제약을 설정할 수 있게 지원한다. 이것을 ‘인덱스 타입 제약'이라고 한다.

```javascript
const pick = <T, K>(obj:T, keys:K[]) => keys.map(key => ({[key]: obj[key]}))
                      .reduce((result, value) => ({...result, ...value}),{});
// Error: Type 'K' cannot be used to index type 'T'.
```

위와 같이 T, K라는 타입 변수를 적용했지만, K 타입에 타입 제약을 설정하지 않았으므로 위와 같은 오류가 발생한다. 즉, K가 T의 key라는 걸 명시해주는 인덱스 타입 제약을 설정해야 한다.

```javascript
const obj = {
  name: "Jane",
  age: 22,
  city: "Seoul",
  country: "Korea",
};

const pick = <T, K extends keyof T>(obj: T, keys: K[]) =>
  keys
    .map((key) => ({ [key]: obj[key] }))
    .reduce((result, value) => ({ ...result, ...value }), {});

pick(obj, ["name", "age"]);
pick(obj, ["nam", "agge"]);
// Error: Type "nam" is not assignable to type "name" | "age" | "city" | "country".
```

인덱스 타입 제약을 걸게 되면, 객체의 키가 아닌 “nam”, “agge”와 같은 오타는 매개변수 keys에 들어갈 수 없다는 오류를 출력하여 사전에 오류를 탐지할 수 있게 된다.
