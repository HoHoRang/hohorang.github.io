---
title: "[TIL] 3일차 조건문/구조분해할당 심화"
description: "TIL 3일차. if·switch 조건문과 구조분해할당, 스프레드 연산자를 이용한 객체 복사 등 심화 내용을 정리했다."
pubDate: 2022-03-17T11:33:35+09:00
updatedDate: 2022-03-21T14:04:35+09:00
category: "Dev/TIL"
tags: ["javascript","TIL","Today-I-Learned"]
originalUrl: "https://hohorangrang.tistory.com/13"
---

## 3일차 Today-I-Learned

![JavaScript](./image-1.png)

*JavaScript*

## 조건문

> if

> if(condition1) { ~~~ } else if(condition2) { ~~~ } else { ~~~ } 와 같이 위에서부터 아래로 소괄호의 조건식을 실행하면서 만족하면 중괄호의 내용을 실행하는 조건문

if 조건을 만족하면 해당 코드가 실행되고, 만족하지 않는다면 else if 조건을 검사, 모든 조건을 만족하지 않는다면 else 구문이 실행된다.

```javascript
const name = "철수";

if(name === "철수") {
	console.log("안녕하세요 철수입니다.");
} else if(name === "훈이") {
	console.log("안녕하세요 훈이입니다.");
} else {
	console.log("안녕하세요 반갑습니다.");
}
```

위의 코드에서는 name이 "철수"이므로 "안녕하세요 철수입니다." 문구만 출력될 것이다.

> switch

> switch(condition) { case "1": ~~~; break; case "2": ~~~; break; ...... default: ~~~; } 와 같이 switch의 소괄호에 들어오는 상수값(변수값)에 따라 각각의 case가 실행되는 조건문

소괄호의 값에 따라 만족하는 case문을 실행하고, 모두 만족하지 못하면 default로 설정된 구문을 실행한다.

**주의할 점은, 각 case문에 break를 사용하지 않으면 종료되지 않고 다음 case문을 만족하는지 검사하기 때문에, 적절히 break를 사용해주어야 한다. 또한 default는 무조건 모든 case 최하단에 위치해야 정상적으로 작동된다.**

```javascript
const day = "월요일";
let result = "";
switch(day) {
	case "월요일":
		result = "오늘은 월요일입니다.";
		break;
	case "화요일":
		result = "오늘은 화요일입니다.";
		break;
	case "수요일":
		result = "오늘은 수요일입니다.";
		break;
	default:
		result = "오늘은 " + day + "입니다.";
}

console.log(result); //오늘은 월요일입니다.
```

day가 "월요일"이기 때문에 case "월요일" 구문을 실행하고 break로 switch문을 빠져나온다.

day가 어느 case에도 속하지 않으면(ex. "목요일"), default 구문이 실행되어 "오늘은 목요일입니다."가 출력될 것이다.

> Truthy

> 조건문에서 true로 동작하는 변수, 데이터를 말한다.

-   true
-   0이 아닌 숫자
-   빈 문자열이 아닌 문자열
-   객체(비어있어도 됨)
-   배열(비어있어도 됨)

> Falsy

> 조건문에서 false로 동작하는 변수, 데이터를 말한다.

-   false
-   숫자 0(-0도 동일)
-   빈 문자열
-   null
-   NaN(Not a Number)
-   undefined

## 구조분해할당 심화

변수 간의 복사를 통해 구조분해할당에 대해 더 알아보자.

```javascript
let aaa = "철수";
let bbb = aaa;

console.log(aaa); //철수
console.log(bbb); //철수

bbb = "영희";

console.log(aaa); //철수
console.log(bbb); //영희
```

변수 aaa를 bbb에 복사하고, bbb를 변경하면 위와 같이 aaa와 bbb는 각각 다른 값을 가진다. **이와 같이 일반 문자열은 값만 복사된다.**

하지만, 아래 예제를 보자.

```javascript
let profile1 = {
    name: "철수",
    age: 8,
    school: "다람쥐초등학교",
}
//undefined
profile1
//{name: '철수', age: 8, school: '다람쥐초등학교'}
let profile2 = profile1
//undefined
profile2
//{name: '철수', age: 8, school: '다람쥐초등학교'}
profile2.name = "영희"
//'영희'
profile2
//{name: '영희', age: 8, school: '다람쥐초등학교'}
profile1
//{name: '영희', age: 8, school: '다람쥐초등학교'}
profile1.age = 10
//10
profile1
//{name: '영희', age: 10, school: '다람쥐초등학교'}
profile2
//{name: '영희', age: 10, school: '다람쥐초등학교'}
```

profile1이라는 객체를 생성하고, 이를 profile2에 복사를 했다.

그리고 profile2의 name 속성을 "영희"로 변경했는데, 복사 원본인 profile1의 name 또한 "영희"로 변경된 것을 볼 수 있다.

**이와 같이, 배열이나 객체의 경우 실제 값이 아니라 주소 자체가 복사되어, 두 변수가 같은 곳을 바라보고 있는 것을 알 수 있다.**

**(사실상 복사의 의미가 아니다)**

그렇다면, 객체를 완전하게 복사하는 방법은 없는걸까?

```javascript
let profile1 = {
    name: "철수",
    age: 8,
    school: "다람쥐초등학교",
}
//undefined
let profile2 = {
    name: profile1.name,
    age: profile1.age,
    school: profile1.school,
}
//undefined
profile2
//{name: '철수', age: 8, school: '다람쥐초등학교'}
profile1
//{name: '철수', age: 8, school: '다람쥐초등학교'}
profile2.name = "영희"
//'영희'
profile2
//{name: '영희', age: 8, school: '다람쥐초등학교'}
profile1
//{name: '철수', age: 8, school: '다람쥐초등학교'}
```

위와 같이 아예 profile2 객체를 생성하면서 속성을 일일이 넣는 방법이 있다.

그런데 위와 같은 방법은 별도로 생성하는 것과 별반 다를 것 없어 효율적이지 못하다.

```javascript
let profile1 = {
    name: "철수",
    age: 8,
    school: "다람쥐초등학교",
}
//undefined
let profile2 = { ...profile1 }
//undefined
profile2
//{name: '철수', age: 8, school: '다람쥐초등학교'}
profile1
//{name: '철수', age: 8, school: '다람쥐초등학교'}
profile2.name = "영희"
//'영희'
profile2
//{name: '영희', age: 8, school: '다람쥐초등학교'}
profile1
//{name: '철수', age: 8, school: '다람쥐초등학교'}
```

...profile1과 같은 **Spread Operator(스프레드 연산자)를 이용**하여 profile2에 각 속성들을 복사해주는 방법이 있다.

Spread Operator는 배열, 문자열 등 반복 가능한 객체(Iterable Object)나 객체를 개별 요소로 분리할 수 있다.

하지만, 아래 예제를 보자.

```javascript
let profile1 = {
    name: "철수",
    age: 8,
    school: "다람쥐초등학교",
    hobby: {
        first: "게임하기",
        second: "운동하기",
    }
}
//undefined
let profile2 = {...profile1}
//undefined
profile2
//{name: '철수', age: 8, school: '다람쥐초등학교', hobby: {…}}
profile1
//{name: '철수', age: 8, school: '다람쥐초등학교', hobby: {…}}
profile2.name = "영희"
//'영희'
profile2
//{name: '영희', age: 8, school: '다람쥐초등학교', hobby: {…}}
profile1
//{name: '철수', age: 8, school: '다람쥐초등학교', hobby: {…}}
profile2.hobby.first = "코딩하기"
//'코딩하기'
profile2
//{name: '영희', age: 8, school: '다람쥐초등학교', hobby: {…}}
//age: 8
//hobby: {first: '코딩하기', second: '운동하기'}
//name: "영희"
//school: "다람쥐초등학교"
profile1
//{name: '철수', age: 8, school: '다람쥐초등학교', hobby: {…}}
//age: 8
//hobby: {first: '코딩하기', second: '운동하기'}
//name: "철수"
//school: "다람쥐초등학교"
```

객체 안에 hobby라는 또 다른 객체가 있는데, 이 객체는 복사되지 않고 같은 주소를 바라보고 있어 수정하게 되면 원본도 수정된다.

이렇게 Spread Operator를 이용해 복사한 경우, 일반 문자열이나 숫자는 값이 복사가 되지만, 또 다른 객체가 있는 경우 복사가 되지 않고 원본이 참조되는 **Shallow Copy(얕은 복사)**가 이루어진다.

> Shallow Copy(얕은 복사)

> 완벽하게 값이 복사되지 않고 객체, 배열의 주소가 복사되어 같은 주소를 참조하는 경우

```javascript
let profile1 = {
    name: "철수",
    age: 8,
    school: "다람쥐초등학교",
    hobby: {
        first: "게임하기",
        second: "운동하기"
    }
}

let profile2 = {
    name: profile1.name,
    age: profile1.age,
    school: profile1.school,
    hobby: profile1.hobby, //profile1의 hobby와 동일한 주소를 가짐
}
```

위 코드는 hobby 객체가 제대로 값이 복사되지 않는다.

```javascript
const child1 = {
    name: "철수",
    age: 13,
    school: "다람쥐초등학교",
}
//undefined
const child2 = {...child1}
//undefined
child2.name = "영희"
//'영희'
child1.name
//'철수'
```

Spread Operator를 이용한 복사는 객체 안에 객체가 있는 경우, 객체는 정상적으로 값 복사가 되지 않으므로 얕은 복사가 된다.

> Deep Copy(깊은 복사)

> 완벽하게 값의 복사가 이뤄지는 경우

```javascript
const child1 = {
    name: {first: "김", last:"철수"},
    age: 13,
    school: "다람쥐초등학교",
}
//undefined
const child2 = JSON.parse(JSON.stringify(child1))
//undefined
child2.name.first = "최"
//'최'
child2.name.last = "영희"
//'영희'
child1
//{name: {…}, age: 13, school: '다람쥐초등학교'}
//age: 13
//name: {first: '김', last: '철수'}
//school: "다람쥐초등학교"
//[[Prototype]]: Object
child2
//{name: {…}, age: 13, school: '다람쥐초등학교'}
//age: 13
//name: {first: '최', last: '영희'}
//school: "다람쥐초등학교"
//[[Prototype]]: Object
```

객체를 완벽하게 복사하는 방법으로, JSON을 이용하는 방법이 있다.

JSON.stringify는 객체를 문자열화하고, JSON.parse는 문자열을 객체화한다.

**JSON.parse(JSON.stringify(child1))를 실행하면, 객체 -> 문자열 -> 객체가 되므로, 원본 객체를 바라보는 것이 아니라 새로운 하나의 객체가 생성되어 완벽하게 값이 복사된다.**

단점으로는, 변환하는 과정에서 효율적이지 못하다는 점이다.

> 배열의 Spread Operator

> Spread Operator는 배열, 문자열 등 반복 가능한 객체(Iterable Object)나 객체를 개별 요소로 분리할 수 있다.

배열도 객체와 마찬가지로, Spread Operator를 이용하여 개별 요소 분리가 가능해, 배열 복사나 연결이 쉽다.

```javascript
const aaa = ["사과", "딸기"]
const bbb = ["수박", "멜론", "포도"]

const ccc = [aaa, bbb] // [["사과", "딸기"], ["수박", "멜론", "포도"]]

const ddd = [...aaa, ...bbb] // ["사과", "딸기", "수박", "멜론", "포도"]
```

배열 ccc는 aaa 배열과 bbb 배열을 값으로 가진 배열이 생성된 것이고,

배열 ddd는 aaa 배열의 항목과 bbb 배열의 항목을 합친 배열이 생성된 것이다.

> REST 파라미터

> Spread Operator를 이용한 REST 파라미터를 통해 속성, 값들을 모아서 할당이 가능하다.

```javascript
const child = {
	name: "철수",
	age: 8,
	school: "다람쥐초등학교",
	money: 2000,
	hobby: "수영"
}

const {money, hobby, ...rest} = child

console.log(rest) //{ name: '철수', age: 8, school: '다람쥐초등학교' }
```

rest에 money, hobby 속성을 제외한 나머지 속성이 할당된 것을 확인할 수 있다.

**주의할 점은, REST 파라미터는 맨 마지막에 위치해야 정상적으로 작동한다.**
