---
title: "[JavaScript] Template Literals(템플릿 리터럴) & Destructuring(구조분해할당)"
description: "ES6의 Template Literals(템플릿 리터럴)로 문자열과 표현식을 다루는 법과 배열·객체의 Destructuring(구조분해할당) 문법을 정리했다."
pubDate: 2022-03-15T14:52:20+09:00
updatedDate: 2022-03-16T14:33:00+09:00
category: "Language/JavaScript"
tags: ["javascript","Template literals","구조분해할당"]
originalUrl: "https://hohorangrang.tistory.com/10"
---

![JavaScript](./image-1.png)

*JavaScript*

## Template Literals

> 💡Template Literals는 ES6(ECMAScript 2015)에서 추가된 문법 중 하나로, 보통 문자열을 표시할 때 사용하는 따옴표(')나 쌍따옴표(") 대신 백틱(\`)을 사용하여 표현할 수 있는 문법이다.

Template Literals에는 표현식을 넣을 수 있는데, $와 중괄호({})를 이용해 표기할 수 있다.

개행처리 등의 Escapse Sequence를 사용하고, 표현식도 별도로 붙혀줘야 하던 일반 문자열에서는 작성이 복잡하기 때문에, Template Literals를 이용하여 유용하고 효과적으로 텍스트 처리가 가능하다.

```javascript
const name = '안녕하세요.
HoHoRang입니다.';

console.log(name); // 안녕하세요. HoHoRang입니다.
```

일반 문자열은 별도의 개행처리를 하지 않는 이상 위와 같이 한 줄로 표시된다.

```javascript
const name = '안녕하세요.\n' + 'HoHoRang입니다.'; //일반 문자열

console.log(name);
//안녕하세요.
//HoHoRang입니다.

const hi = `안녕하세요.
HoHoRang입니다.`; //Template Literals

console.log(hi);
//안녕하세요.
//HoHoRang입니다.
```

Template Literals는 위와 같이 별도의 개행처리가 필요없어, 코드가 훨씬 간결해진다.

```javascript
console.log('1 + 2 = ${1+2}'); //1 + 2 = ${1+2}

console.log(`1 + 2 = ${1+2}`); //1 + 2 = 3
```

일반 문자열에서는 ${}이 문자열로 인식되지만, Template Literals에서는 표현식으로 인식되어 삽입이 가능하다.

## 구조분해할당

> 💡구조분해할당은 배열이나 객체의 속성을 해체하여 그 값을 개별 변수에 담을 수 있게 하는 JavaScript 표현식이다.  
> ❗️구조분해할당 시, 배열을 담을 변수는 \[\]로, 객체를 담을 변수는 {}로 감싸줘야 한다.

### \<객체>

```javascript
const profile = {
    name: '철수',
    age: 13,
    school: '다람쥐초등학교',
}
//undefined
const {name, age, school} = profile;
//undefined
const {name, age} = {
    name: '철수',
    age: 13,
    school: '다람쥐초등학교',
}
//undefined
```

위와 같은 profile이라는 객체의 속성들을 name, age, school이라는 개별 변수에 담을 수 있다.

(단, 객체일 경우 객체의 속성과 개별 변수의 이름이 같아야 한다)

```javascript
const {name2, age3} = {
    name: '철수',
    age: 13,
    school: '다람쥐초등학교',
}
//undefined
name2
//undefined
age3
//undefined
```

위와 같이 객체의 속성과 다른 변수명을 사용하면, 실제로 값이 할당되지 않는 것을 확인할 수 있다.

```javascript
const child = {
    name: '영희',
    age: 7,
    school: '토끼초등학교',
}
//undefined

function getChild() {
    return {
        name: '철수',
        age: 13,
        school: '다람쥐초등학교',
    }
}
//undefined

const {age} = child;
//undefined
const {school} = getChild();
//undefined
console.log(age);
//VM1679:1 7
//undefined
console.log(school);
//VM1756:1 다람쥐초등학교
//undefined
```

함수로 객체를 리턴하는 경우도, 함수를 호출하는 것 자체가 객체를 선언하는 것과 같기에, 위와 같이 사용할 수도 있다.

또한, 객체의 모든 속성을 변수에 할당받을 필요 없이, 필요한 속성만을 할당받을 수 있다.

### \<배열>

```javascript
const [aaa, bbb, ccc] = ['철수','영희','훈이']
//undefined
aaa
//'철수'
bbb
//'영희'
ccc
//'훈이'
```

배열인 경우는 변수명을 임의로 설정하더라도, 배열의 순서대로 각 변수에 담기게 된다.

```javascript
function getClassmates() {
    return ['영희', '철수'];
}
//undefined
const [child1, child2] = getClassmates();
//undefined
child1
//'영희'
child2
//'철수'
```

마찬가지로, 함수에서 배열을 리턴하는 경우에도, 구조분해할당을 통해 각각의 변수에 값을 담을 수 있다.

```javascript
function getWelcomeTeplate({ myname, myage, myschool, mycreatedAt }) {
  return `
    <html>
      <body>
        <h1>${myname}님 가입을 환영합니다.</h1>
        <hr>
        <div>이름: ${myname}</div>
        <div>나이: ${myage}살</div>
        <div>학교: ${myschool}</div>
        <div>가입일: ${mycreatedAt}</div>
      </body>
    </html>
  `;
}

const myuser = {
  myname: "철수",
  myage: 13,
  myschool: "다람쥐초등학교",
  mycreatedAt: "2020-01-02",
};

console.log(getWelcomeTeplate(myuser));
```

위와 같이 함수에 매개변수를 전달할 때, 구조분해할당을 해주면 변수의 순서가 바뀌거나, 잘못 입력할 경우에도 안전하게 처리할 수 있다.
