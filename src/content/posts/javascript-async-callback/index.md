---
title: "[JavaScript] 비동기 처리 & Callback 함수"
description: "JavaScript의 비동기 처리 방식과 이를 다루기 위한 Callback 함수의 개념과 사용 예시를 정리했다."
pubDate: 2022-03-16T14:32:38+09:00
updatedDate: 2022-03-16T14:44:06+09:00
category: "Language/JavaScript"
tags: ["async","Callback","javascript","Sync","동기","비동기"]
originalUrl: "https://hohorangrang.tistory.com/12"
---

![JavaScript](./image-1.png)

*JavaScript*

## 비동기 처리

> 💡비동기 처리란 특정 코드의 연산이 끝날 때까지 코드 실행을 멈추지 않고,  
> 다음 코드를 먼저 실행하는 자바스크립트의 특성

비동기 처리 방식으로 실행되는 것으로 setTimeout()을 예로 들 수 있다.

```javascript
// #1
console.log('Hello');
// #2
setTimeout(function() {
	console.log('Bye');
}, 3000);
// #3
console.log('Hello Again');
```

위의 예상 결과는 #1 -> #2 -> #3 이지만, 실제로는 #1 -> #3 -> #2 순서로 출력된다.

위와 같은 비동기 처리방식의 문제를 해결하기 위해 나온 것이 Callback Function(콜백함수)이다.

## Callback Function

> 💡콜백함수란 다른 함수에 매개변수로 넘겨준 함수를 말한다.  
> 이렇게 넘겨받은 함수는 때가 되면 나중에 호출되는 개념이다.

```javascript
function greeting(name) {
  alert('Hello ' + name);
}

function processUserInput(callback) {
  var name = prompt('Please enter your name.');
  callback(name);
}

processUserInput(greeting);
```

위의 코드에서는 greeting이라는 함수가 콜백함수로 쓰였다. 함수명()가 아닌 함수명만을 매개변수로 넘겨주어, 상위 함수가 실행되면서 콜백함수가 실행된다. 먼저 processUserInput 함수가 실행되어, 사용자의 이름을 입력받으면 greeting 함수가 실행되는 것이다.

정리하자면, 콜백함수는 비동기 방식으로 작성된 함수를 동기 방식으로 처리하기 위해 사용된다.

순차적인 처리나 응답을 받은 이후에 처리가 필요한 작업이 필요한 경우 위와 같이 콜백함수를 이용하여 구현하기도 한다.
