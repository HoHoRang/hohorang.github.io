---
title: "[JavaScript] == 와 === (동등 / 일치 비교 연산자)"
description: "JavaScript의 동등 비교(==)와 일치 비교(===) 연산자가 어떻게 다르게 동작하는지 예시와 함께 정리했다."
pubDate: 2022-04-12T14:40:47+09:00
category: "Language/JavaScript"
tags: ["==","===","javascript","동등비교","일치비교"]
originalUrl: "https://hohorangrang.tistory.com/31"
---

![JavaScript](./image-1.png)

*JavaScript*

## 동등 / 일치 비교 연산자

비교 연산자는 좌항과 우항의 피연산자를 비교한 다음, 그 결과를 true 혹은 false (boolean 값) 으로 반환한다.

그 중 **동등 / 일치 비교 연산자**는 좌항과 우항의 피연산자가 같은 값으로 평가되는지 비교해 boolean 값을 반환한다.

동등 비교 연산자는 **느슨한 비교**,

일치 비교 연산자는 **엄격한 비교**를 한다.

### \<동등 비교(==) 연산자>

동등 비교(==) 연산자는 비교할 때 암묵적인 타입 변환을 통해 **타입을 일치시킨 다음 같은 값인지 비교**한다.

이는 **타입이 다르더라도 타입 변환 후에 값이 같으면 true를 반환**한다는 말이다.

```javascript
5 == 5; // true

5 == '5'; // true
```

```javascript
'0' == ''; // false
0 == ''; // true
0 == '0'; // ture
false == 'false'; // false
false == '0'; // true
false == null; // false
false == undefined; // false
```

동등 비교 연산자는 위와 같이 결과를 예측하기 어렵게 만들어 사용을 지양하는 편이다.

### \<일치 비교(===) 연산자>

일치 비교(===) 연산자는 비교할 때 **타입과 값이 모두 같은지 비교해 true를 반환**한다.

암묵적인 타입 변환을 하지 않으므로 예측하기 쉽다.

```javascript
5 === 5; // true

5 === '5'; // false
```

```javascript
NaN === NaN; // false
```

다만, NaN 값에 대해서는 일치 연산자가 동일한지 판별할 수 없으므로 isNaN 함수를 사용해야 한다.

```javascript
isNaN(NaN); // true
isNaN(10); // false
isNaN(1 + undefined) // true
```

| 연산자 | 이름 | 예시 | 의미 |
| --- | --- | --- | --- |
| \== | 동등 비교 | x == y | x 와 y의 값이 같음 |
| != | 부동등 비교 | x != y | x 와 y의 값이 다름 |
| \=== | 일치 비교 | x === y | x 와 y의 타입과 값이 같음 |
| !== | 불일치 비교 | x !== y | x 와 y의 타입과 값이 다름 |
