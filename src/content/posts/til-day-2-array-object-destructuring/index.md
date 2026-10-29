---
title: "[TIL] 2일차 배열/객체/Template Literals/Destructuring"
description: "TIL 2일차. 배열과 객체의 데이터 추가·삭제·조회 방법, Template Literals와 구조분해할당을 정리했다."
pubDate: 2022-03-16T09:45:19+09:00
updatedDate: 2022-03-16T09:49:59+09:00
category: "Dev/TIL"
tags: ["javascript","TIL","Today-I-Learned"]
originalUrl: "https://hohorangrang.tistory.com/11"
---

## 2일차 Today-I-Learned

![JavaScript](./image-1.png)

*JavaScript*

## 배열

#### 데이터 추가

push - 배열 맨 뒤에 데이터 추가

unshift - 배열 맨 앞에 데이터 추가

#### 데이터 삭제

pop - 배열 맨 뒤의 데이터 삭제

shift - 배열 맨 앞의 데이터 삭제

#### 데이터 조회

indexOf - 데이터의 index 값 반환(없으면 -1 반환)

includes - 데이터의 존재 여부 반환(true, false)

## 객체

#### 데이터 추가 / 변경

Obj.dog = “별이”

Obj\["dog"\] = "별이"

(존재하지 않는 키 값이라면, 키를 추가함)

Obj.school.teacher = “훈이”

#### 데이터 삭제

delete Obj.cat

delete Obj.school.teacher

delete Obj.school

## Template Literals(템플릿 리터럴)

```javascript
const name = '철수';
const age = 8;
const school = '다람쥐초등학교';

console.log(name+'는 ' + age + '살 이고, ' + school + '에 다닙니다.');

console.log(`${name}는 ${age}살 이고, ${school}에 다닙니다.`);
```

백틱(\`)을 사용하여 개행처리, 표현식들을 삽입하여 간편하게 표현할 수 있는 문자열 표현방식이다.

## Destructuing(구조분해할당)

구조분해할당은 배열이나 객체의 속성을 해체하여 그 값을 개별 변수에 담을 수 있게 하는 JavaScript 표현식이다.

```javascript
var a, b, rest;
[a, b] = [10, 20];
console.log(a); // 10
console.log(b); // 20

[a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(a); // 10
console.log(b); // 20
console.log(rest); // [30, 40, 50]

({ a, b } = { a: 10, b: 20 });
console.log(a); // 10
console.log(b); // 20

// Stage 4(finished) proposal
({a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40});
console.log(a); // 10
console.log(b); // 20
console.log(rest); // {c: 30, d: 40}
```
