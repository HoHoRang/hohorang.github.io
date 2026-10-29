---
title: "[JavaScript] Hoisting(호이스팅)"
description: "JavaScript의 Hoisting(호이스팅) 개념과 var, let, const 및 함수 선언에서 호이스팅이 어떻게 동작하는지 정리했다."
pubDate: 2022-03-29T15:02:52+09:00
updatedDate: 2022-04-12T14:46:03+09:00
category: "Language/JavaScript"
tags: ["const","hoisting","javascript","let","var"]
originalUrl: "https://hohorangrang.tistory.com/22"
---

![JavaScript](./image-1.png)

*JavaScript*

## Hoisting(호이스팅)이란?

> 💡 함수 안에 있는 선언들을 모두 끌어올려서 해당 함수 유효 범위 최상단에 선언하는 것

자바스크립트 및 액션스크립트 코드를 인터프리터가 로드할 때, 변수의 정의가 그 범위에 따라 선언과 할당으로 분리되어 변수의 선언을 항상 컨텍스트 내의 최상위로 끌어올리는 것을 의미한다. 변수 그리고 함수도 가능하며, 자바스크립트에서의 함수의 호출을 첫 줄에서 하고 마지막 줄에 함수를 정의해도 문제없이 작동되도록 하는 유용한 특성이다.

하지만 호이스팅이라는 특징은 생각지 못한 버그, 예외를 발생시키기도 한다.

즉, 변수나 함수는 선언 및 초기화의 단계가 있는데, 이 중에 선언만 호이스팅이 된다. 변수를 먼저 사용하고 그 후에 선언 및 초기화가 나타나면, 사용하는 시점의 변수는 기본 초기화 상태(var 선언 시 undefined, 그 외에는 초기화하지 않음)

```javascript
console.log(num); // 호이스팅된 var 선언으로 인해 undefined 출력
var num; // 선언
num = 6; // 초기화
```

아래 예제는 선언 없이 초기화만 존재한다. 따라서 호이스팅이 되지 않고, 변수를 읽으려고 하면 ReferenceError가 발생한다. console.log를 실행하는 순간에 num은 없는 변수이기 때문이다.

```javascript
console.log(num); // ReferenceError: num is not defined
num = 6; // 초기화
```

### \<let과 const 호이스팅>

let과 const로 선언한 변수도 호이스팅 대상이지만, var와 달리 호이스팅 시 undefined로 변수를 초기화하지 않는다. 따라서 변수의 초기화를 수행하기 전에 읽는 코드가 먼저 나타나면 예외가 발생한다.

```javascript
console.log(name); // ReferenceError: Cannot access 'name' before initialization
let name = 'kim';
```

호이스팅에 의해 name이 선언은 되었기에, 초기화하기 전에는 사용할 수 없다는 에러가 출력된다.

```javascript
var name = 'kim' // 전역변수
{
    console.log(name) // ReferenceError: Cannot access 'name' before initialization
    let name = 'kim' // 지역변수
}
```

위의 코드에서 최상단에 var name이 선언 및 초기화되었음에도 에러가 출력되는 이유는, {} 블록 내부에 let으로 선언된 name 변수가 호이스팅되어 {} 블록에서 선언은 되었지만 초기화되지 않았기 때문이다. let name 변수가 호이스팅되지 않았다면 console.log의 결과는 전역변수인 var name = 'kim'이 출력되어야 한다.

### \<변수 생성의 3단계>

#### 1. 선언

변수를 실행 컨텍스트의 변수 객체에 등록한다.

#### 2. 초기화

실행 컨텍스트에 등록된 변수 객체에 대한 메모리를 할당한다. 이 단계에서 undefined로 초기화된다.

#### 3. 할당

undefined로 초기화된 변수에 값을 할당한다.

var 키워드로 변수를 만들면, 호이스팅되어 선언과 초기화가 동시에 이뤄진다.

let 키워드로 변수를 만들면, 호이스팅되어 선언이 이뤄지고, 실제 let이 사용된 코드에 도착했을 때 초기화가 이뤄진다.

const도 let과 마찬가지이나, 선언과 동시에 초기화를 해야하고, 값 변경이 불가하다.
