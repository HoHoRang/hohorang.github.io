---
title: "[JavaScript] var, let, const"
description: "JavaScript에서 변수를 선언하는 var, let, const 키워드의 특징과 차이, 사용 시 주의할 점을 정리했다."
pubDate: 2022-04-12T11:31:51+09:00
updatedDate: 2022-04-12T14:43:22+09:00
category: "Language/JavaScript"
tags: ["const","javascript","let","var"]
originalUrl: "https://hohorangrang.tistory.com/30"
---

![JavaScript](./image-1.png)

*JavaScript*

var, let, const는 JavaScript에서 변수를 선언할 수 있는 키워드이다.

하지만 각각의 특징 때문에 사용할 때 주의를 기울여서 사용해야 하므로, 하나씩 살펴보도록 한다.

## var 키워드

ES5까지는 변수를 선언할 수 있는 유일한 키워드는 var 키워드였다.

### 1. 변수 중복 선언 가능

```javascript
var x = 1;
var y = 1;

var x = 100;
var y;

console.log(x); // 100
console.log(y); // 1
```

위의 코드에서 x와 y 변수는 중복 선언되었다. 하지만 중복 선언 후 초기화문(선언과 동시에 초기값 할당) 유무에 따라 다르게 동작한다. 중복 선언하면서 값을 초기화해주면 var 키워드가 없는 것처럼 동작하고, 초기화하지 않고 중복 선언하면, 그 선언은 무시된다.

에러가 발생하지 않으므로, 이미 선언했던 변수를 다시 선언하면서 초기화 한다면 의도치 않은 값 변경이 일어나는 부작용이 있다.

### 2. 함수 레벨 스코프

var 키워드로 선언된 변수는 함수의 코드 블록만을 지역 스코프로 인식한다.

```javascript
var x = 1;

if(true) {
	var x = 10;
}

console.log(x); // 10
```

if 문은 함수가 아니므로, if 문 안에서 var 변수를 다시 선언하면 지역변수가 아니라 전역변수가 된다. 그래서 if 문이 종료되더라도 x 변수의 값은 10이 출력된다.

이렇게 var 키워드를 사용해 함수 레벨 스코프가 되면 의도치 않은 전역변수가 중복 선언되는 경우가 발생한다.

### 3. 변수 호이스팅

var 키워드로 변수를 선언하면 호이스팅에 의해 변수 선언문이 스코프의 선두로 끌어 올려진 것처럼 동작한다.

즉, var 키워드로 선언한 변수는 변수 선언문을 만나기 전에 참조할 수 있다.

```javascript
console.log(foo); // undefined

foo = 123;

console.log(foo); // 123

var foo;
```

변수 선언문 이전에 참조하는 것은 호이스팅에 의해 에러를 발생시키지는 않지만, undefined 출력 등 오류를 발생시킬 여지를 남기므로 사용을 추천하지 않는다.

## let 키워드

앞선 var 키워드의 단점을 보완하기 위해 ES6에서 새로운 키워드인 let, const가 등장했다.

### 1. 변수 중복 선언 금지

let 키워드로 이름이 같은 변수를 중복 선언하면 문법 에러(SyntaxError)가 발생한다.

```javascript
var x = 123;

var x = 456;

let y = 123;

let y = 456; // SyntaxError: Identifier 'x' has already been declared
```

### 2. 블록 레벨 스코프

var 키워드는 함수의 코드 블록만을 지역 스코프로 인식하는데, let 키워드는 모든 코드 블록(함수, if, for, while, try/catch 문 등)을 지역 스코프로 인정하는 블록 레벨 스코프를 따른다.

```javascript
let x = 1;
{
	let x = 2;
	let y = 3;
}

console.log(x); // 1
console.log(y); // ReferenceError: y is not defined
```

위에서 코드 블록 내에서 선언된 x,y 변수는 지역 변수로 전역 변수 x와는 별개의 변수다. 따라서 전역에서 지역 변수인 y를 참조할 수 없다.

### 3. 변수 호이스팅

let 키워드로 선언된 변수를 변수 선언문 이전에 참조하면 참조에러가 발생한다.

var 키워드로 선언된 변수는 선언과 초기화가 한번에 진행되기 때문에, 변수 선언문 이전에 접근해도 undefined로 접근이 가능하다.

하지만, let 키워드로 선언된 변수는 선언과 초기화 단계가 분리되어 진행된다. 호이스팅에 의해 선언 단계는 실행되지만, 초기화 단계는 변수 선언문에 도달했을 때 실행된다.

따라서 초기화 단계가 실행되기 전에 변수에 접근하려고 하면 참조 에러가 발생한다.

```javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization

let x;

console.log(x); // undefined

x = 1;

console.log(x); // 1
```

## const 키워드

const 키워드는 상수를 선언하기 위해 사용하고, 대부분의 특징이 let과 동일하다.

### 1. 선언과 초기화

const 키워드로 선언한 변수는 반드시 선언과 동시에 초기화가 되어야 한다.

```javascript
const x; // SyntaxError: Missing initializer in const declaration
x = 1;
```

const 키워드로 선언된 변수는 let과 마찬가지로 블록 레벨 스코프를 가진다.

### 2. 재할당 금지

const 키워드로 선언된 변수는 재할당이 금지된다.

```javascript
const x = 1;
x = 2; // TypeError: Assignment to constant variable.
```

### 3. 상수

const 키워드로 선언된 변수는 변수 값을 변경할 수 없다. 이런 특징을 이용해 const 키워드를 상수를 표현하는 데 사용하기도 한다.

```javascript
let price = 1000;

let afterPrice = price + ( price * 0.1 );
```

위 코드에서 0.1이란 값은 어떤 의미로 사용했는지 명확히 알기 어렵다. 또한 바뀌지 않는 값이라면 고정된 값이므로 이를 상수로 정의하면 의미 파악이나 유지보수 측면에서 유리하다.

### 4. const 키워드와 객체

const 키워드로 선어된 변수에 원시 값을 할당한 경우 값을 변경할 수 없다. 하지만 객체를 할당한 경우 값을 변경할 수 있다.

```javascript
const person = {
	name: "Kim"
}

person.name = "Lee";

console.log(person); // {name: "Lee"}
```

const 키워드는 재할당을 금지할 뿐, 할당된 객체가 변경되더라도 참조된 값은 변경되지 않으므로 가능한 것이다.
