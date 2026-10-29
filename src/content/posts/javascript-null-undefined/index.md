---
title: "[JavaScript] null & undefined"
description: "JavaScript의 null과 undefined가 각각 어떤 의미이고 어떻게 다르게 쓰이는지 정리했다."
pubDate: 2022-04-07T12:10:10+09:00
updatedDate: 2022-04-12T14:47:23+09:00
category: "Language/JavaScript"
tags: ["javascript","null","undefined"]
originalUrl: "https://hohorangrang.tistory.com/28"
---

![JavaScript](./image-1.png)

*JavaScript*

자바스크립트에는 데이터 타입 중, null 타입과 undefined 타입이 있다.

자바를 배울 때는 아무것도 참조하지 않고 값이 없다는 걸 null로만 나타냈던 것 같은데, 자바스크립트에는 undefined도 있다.

둘 다 값이 없다는(?) 것 같은데, 정확히 어떻게 쓰이는지 확인하려 한다.

## null 타입

null 타입이다. 자바스크립트는 대소문자를 구별하므로, Null, NULL 등이 아닌 null로 쓰인다.

null은 **변수에 값이 없다는 것**을 의도적으로 명시(의도적 부재)할 때 사용한다.

변수에 null을 할당하는 것은 변수가 이전에 참조하던 값을 더 이상 참조하지 않겠다는 의미다.

또 함수가 유효한 값을 반환할 수 없는 경우 명시적으로 null을 반환하기도 한다.

```html
<!DOCTYPE html>
<html>
<body>
	<script>
		var element = document.querySelector('.myClass');
		console.log(element); // null
	</script>
</body>
</html>
```

위의 예제에서와 같이 document.querySelector 메소드를 실행했을 때 조건에 맞는 요소가 없는 경우 에러 대신 null을 반환한다.

## undefined 타입

undefined 타입은 undefined라는 값만 가진다.

var 키워드로 선언한 변수는 undefined로 초기화된다.(선언 → 초기화 → 할당)

변수 선언에 의해 확보된 메모리 공간을 처음 할당할 때까지 비워두지 않고 자바스크립트 엔진이 undefined로 초기화한다.

```javascript
var x;
console.log(x); // undefined
```

undefined는 개발자가 의도적으로 할당하기 위한 값이 아니라, 자바스크립트 **엔진이 변수를 초기화할 때 사용하는 값**이다. 변수를 참조했을 때 undefined가 반환되면 그 변수가 선언된 이후 값이 할당된 적이 없는(초기화되지 않은) 변수라는 것을 알 수 있다.

그렇기에 개발자가 의도적으로 변수에 undefined를 할당한다면 본래 취지와 어긋나고 혼란을 줄 수 있어 그렇게 사용하지는 않는다.

변수에 값이 없다는 것을 명시하고 싶다면 위에 있는 null 타입을 이용해 할당해주면 된다.

-   null : 변수에 **값이 없다는 것을 의도적으로 명시**할 때 사용
-   undefined : 선언된 변수에 값이 **초기화되고, 할당되기 전**이라는 것을 나타낼 때 사용
