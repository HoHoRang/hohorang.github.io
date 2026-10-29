---
title: "[Team-Project] 10일차 회고"
description: "팀 프로젝트 10일차 회고. 게시판 API를 수정하고 채팅, 휴대폰 본인인증 등 추가 기능을 조사했다."
pubDate: 2022-05-19T10:34:14+09:00
category: "Dev/Team-Project"
tags: []
originalUrl: "https://hohorangrang.tistory.com/71"
---

![](./image-1.png)

## 백엔드 진행사항

### 오늘 할 일

- [x] Board API 수정(HoHoRang)
- [ ] (추가 기능)채팅 기능 구현
- [ ] (추가 기능)회원 가입 시 패스 인증 구현
- [ ] (추가 기능)텐서플로우 이용해서 간단한 이미지 확인 API(부적절 항목 체크)

### 오늘 할 일 진행사항

1\. Board API 수정(HoHoRang)

봉사 모집인원과 이미지 url은 필수입력하지 않도록 수정

봉사 모집인원은 DB에서 Default 값 0으로 가지도록 수정

이미지 url이 없는 경우 저장 로직 실행하지 않도록 수정

2\. (추가 기능)채팅 기능 구현

3\. (추가 기능)회원 가입 시 패스 인증 구현

아임포트 휴대폰 본인인증 연동하기: [https://docs.iamport.kr/tech/mobile-authentication](https://docs.iamport.kr/tech/mobile-authentication)

아임포트로 다날 SMS 본인인증 연동1: [https://blog.naver.com/iamport/221004352427](https://blog.naver.com/iamport/221004352427)

아임포트로 다날 SMS 본인인증 연동2: [https://swieeft.github.io/2020/02/23/ImportSMSiOS.html](https://swieeft.github.io/2020/02/23/ImportSMSiOS.html)

패스 휴대폰번호 로그인 가이드: [https://developers.passlogin.com/docs/develop/web](https://developers.passlogin.com/docs/develop/web)

→ 패스 인증이나 다날 본인인증을 사용하려면, 가게 등록이 되어있어야 한다. 아마 사용하기 어려울 듯 하다.

4\. (추가 기능)카카오 메시지를 이용한 사이트 정보 정기 공유

[https://developers.kakao.com/docs/latest/ko/message/common](https://developers.kakao.com/docs/latest/ko/message/common)

5\. (추가 기능)푸시 알림

[https://developers.kakao.com/docs/latest/ko/push/common](https://developers.kakao.com/docs/latest/ko/push/common)

### 이슈

1\. 프론트엔드에서 https로 띄우는 방법?

-   [https://velog.io/@yaytomato/React-웹사이트-https로-로컬-테스팅하기](https://velog.io/@yaytomato/React-웹사이트-https로-로컬-테스팅하기) 참고하여 로컬용 인증서 만들기
-   [https://intrepidgeeks.com/tutorial/use-https-in-next-js-local-development-server](https://intrepidgeeks.com/tutorial/use-https-in-next-js-local-development-server) 참고하여 https 인증서 사용하는 서버 띄우기

2\. GCP 서버에서 Elastic Search 조회할 때, 0.0.0.0으로 허용되어 있지 않으면 접속이 안됨

서버 -> Elastic Search 접근할 수 있게 방화벽 설정 필요

3\. Nest, DB에 시간이 UTC 기준으로 저장되어, 조회할 때 한국시간으로 표시되지 않는 문제

app.module.ts에서 -09:00 해주어, 저장될 때는 UTC 기준, 조회할 때는 한국시간 기준으로 조회하도록 수정(board.resolver.ts, board.service.ts)

→ 추후 서버, DB, OS의 Timezone을 맞춰주는 작업 필요
