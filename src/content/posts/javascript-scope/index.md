---
title: "[JavaScript] Scope(스코프)"
description: "JavaScript의 Scope(스코프) 개념과 전역·지역 스코프, 함수 레벨 스코프, 렉시컬 스코프, 스코프 체인을 정리했다."
pubDate: 2022-04-07T11:05:22+09:00
updatedDate: 2022-04-12T14:46:42+09:00
category: "Language/JavaScript"
tags: ["Function Level Scope","javascript","lexical scope","scope","scope chain"]
originalUrl: "https://hohorangrang.tistory.com/27"
---

![JavaScript](./image-1.png)

*JavaScript*

## 스코프(Scope)란?

> 💡 모든 식별자(변수, 함수, 클래스 이름 등)가 자신이 선언된 위치에 의해 다른 코드가 자신을 참조할 수 있는 **유효범위**를 말한다.

```javascript
var x = "global";

function foo() {
	var x = "local";
	console.log(x); // local
}

foo();

console.log(x); // global
```

위 예제에서 맨 위에 선언된 x 변수는 어디서든 참조할 수 있지만, foo 함수 내부에 선언된 x 변수는 foo 함수 내부에서만 참조할 수 있다. 식별자 이름은 동일하지만, 전역 스코프를 가진 ‘global’ x 변수와, foo 함수 스코프를 가진 ‘local’ x 변수는 스코프가 서로 다른 경우이다.

이처럼 스코프를 통해 식별자인 변수 이름의 충돌을 방지해서 같은 이름의 변수를 사용할 수 있게 해준다. 스코프 내에서는 식별자가 유일해야 하지만, 다른 스코프에서는 같은 이름의 식별자를 사용할 수 있다.

## 스코프의 종류

```javascript
var x = "global x";
var y = "global y";

function outer() {
	var z = "outer local z";

	console.log(x); // global x
	console.log(y); // global y
	console.log(z); // outer local z

	function inner() {
		var x = "inner local x";

		console.log(x); // inner local x
		console.log(y); // global y
		console.log(z); // outer local z
	}

	inner();
}

outer();

console.log(x); // global x
console.log(z); // ReferenceError
```

1\. 전역 스코프(Global Scope)

전역이란 **코드의 가장 바깥 영역**을 말한다. 전역에 변수를 선언하면 전역 스코프를 갖는 전역 변수가 된다. 전역 스코프에 선언된 전역 변수는 어디서든지 참조가 가능하다.

2\. 지역 스코프(Local Scope)

지역이란 **함수 몸체 내부**를 말한다. 지역 스코프에 변수를 선언하면 지역 변수가 된다. 지역 변수는 자신이 선언된 지역과 하위 지역(중첩 함수)에서만 참조가 가능하다. 함수를 호출한 외부(혹은 전역)에서 지역 변수에 접근하려고 한다면 참조 에러가 발생한다.

## 스코프 체인(Scope Chain)

함수는 중첩이 될 수 있고, 함수의 지역 스코프도 중첩될 수 있으므로 스코프가 계층적인 구조를 가지게 된다.

inner 지역 스코프는 outer 지역 스코프를 상위 스코프로 가지고, outer 지역 스코프는 전역 스코프를 상위 스코프로 가진다. 결국 모든 지역 스코프의 최상위 스코프는 전역 스코프가 된다. 이렇게 **계층적으로 스코프가 연결되는 것을 스코프 체인(Scope Chain)**이라고 한다.

변수를 참조할 때 자바스크립트 엔진은 스코프 체인을 통해 변수를 참조하는 스코프에서 시작하여 상위 스코프로 이동하며 선언된 변수를 검색한다.

## 함수 레벨 스코프(Function Level Scope)

대부분의 프로그래밍 언어는 **모든 코드 블록**(if, for, while, try/catch 등)이 지역 스코프를 만든다.

이러한 특성을 **블록 레벨 스코프**라고 한다.

하지만 var 키워드로 선언된 변수는 오로지 **함수의 코드 블록**(함수 몸체) 만을 지역 스코프로 인정한다.

이러한 특성을 **함수 레벨 스코프**라고 한다.

```javascript
var x = 1;

if(true) {
	var x = 10;
}

console.log(x); // 10
```

전역 변수 x가 선언되었고, if 코드 블록 내에서도 x 변수가 선언되었다. 하지만, var 키워드로 선언된 변수이기에 함수 내부에서 선언되지 않아 전역 변수로 인식된다. 그래서 전역 변수 x는 중복 선언되고 의도치 않게 값이 재할당되어 출력시 10이 출력된다.

블록 레벨 스코프를 지원하는 프로그래밍 언어에서는 if 문에서 선언된 변수는 그 코드 블록에서만 유효한 지역 변수가 된다. 하지만, var 키워드로 선언된 변수는 블록 레벨 스코프를 인정하지 않기 때문에 x 변수는 전역 변수가 된다.

ES6에서 도입된 let, const 키워드는 블록 레벨 스코프를 지원하는데, 이 키워드들을 사용하면 의도치 않은 전역 변수 재할당을 방지할 수 있다.

## 렉시컬 스코프(Lexical Scope)

```javascript
var x = 1;

function foo() {
	var x = 10;
	bar();
}

function bar() {
	console.log(x);
}

foo();
bar();
```

위 예제의 실행결과는 어떻게 될까? 2가지를 예측할 수 있다.

1\. 함수를 어디서 호출 했는지에 따라 함수의 상위 스코프가 결정된다.

2\. 함수를 어디서 정의 했는지에 따라 함수의 상위 스코프가 결정된다.

1번 방식은 동적 스코프(Dynamic Scope)라 하며, **함수가 호출되는 시점**에 동적으로 상위 스코프를 결정한다.

2번 방식은 렉시컬 스코프(Lexical Scope) 혹은 정적(Static Scope)라 하며, **함수 정의가 평가되는 시점**에 상위 스코프가 정적으로 결정된다.

자바스크립트를 비롯한 대부분의 프로그래밍 언어는 렉시컬 스코프를 따른다.

따라서 위 예제에서 bar 함수는 선언된 곳이 전역 스코프이기 때문에, x 변수로 전역 변수 x를 참조한다. 결과는 1이 두 번 출력된다.
