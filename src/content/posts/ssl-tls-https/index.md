---
title: "SSL, TLS, HTTPS"
description: "데이터 전송을 암호화하는 SSL과 TLS의 개념, 그리고 이를 적용한 HTTPS와 인증서를 정리했다."
pubDate: 2022-05-08T22:40:24+09:00
updatedDate: 2025-12-19T00:07:28+09:00
category: "CS/Network"
tags: ["HTTP","https","ssl","TLS","인증서"]
originalUrl: "https://hohorangrang.tistory.com/60"
---

![](./image-1.png)

## SSL

Secure Socket Layer의 약자이다.

브라우저-웹사이트 혹은 서버 사이에 전송되는 데이터를 암호화해 인터넷 연결을 보호하기 위한 표준 기술이다. 해커에 의해 데이터가 탈취되어도 정보를 확인할 수 없도록 방지한다.

## TLS

Transport Layer Security의 약자이다.

SSL의 향상된 버전으로, SSL과 마찬가지로 인터넷에서의 정보를 암호화해서 송수신하는 프로토콜이다. 넷스케이프 사가 개발한 SSL에 기반한 기술로, 국제 인터넷 표준화 기구에서 표준으로 인정받은 프로토콜이다. SSL과 구분되지 않고 사용되는 경우가 많다.

## HTTPS

HyperText Transfer Protocol over Secure socket layer의 약자이다.

간단히 말해서 SSL 위에 HTTP 통신을 하는 프로토콜이다. 웹사이트가 SSL/TLS 인증서로 보호되는 경우 URL에 HTTPS로 표시된다. 자물쇠 모양을 클릭하면 인증서 발급기관 및 세부정보를 확인할 수 있다.

기본 포트는 HTTP의 80번이 아닌 443번 포트를 사용한다.

SSL을 적용하지 않은 HTTP 프토토콜로 접속 시 암호화되지 않은 정보를 해킹당할 가능성이 있어, 브라우저에서 강제로 HTTPS로 전환시키는 기술도 있다.

## SSL 인증서가 작동하는 단계

SSL 인증서는 SSL 핸드셰이크 과정을 통해 웹사이트/서버와 브라우저 간에 암호화된 연결을 수립한다.

-   인증 - 신규 세션에 대해 브라우저와 서버는 각각 다른 SSL 인증서를 교환하고 검증
-   암호화 - 서버는 브라우저와 공개 키를 공유하고, 브라우저는 이 키를 사용해 프리 마스터 키를 생성, 암호화한다.(키 교환)
-   복호화 - 서버는 개인 키를 사용해 프리마스터 키를 복호화하고 세션 기간 동안 사용되는 암호화된 보안 연결을 수립한다.

\[출처\]

[https://opentutorials.org/course/228/4894](https://opentutorials.org/course/228/4894)

[https://www.digicert.com/kr/what-is-ssl-tls-and-https](https://www.digicert.com/kr/what-is-ssl-tls-and-https)
