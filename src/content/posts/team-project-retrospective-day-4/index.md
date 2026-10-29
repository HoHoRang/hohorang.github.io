---
title: "[Team-Project] 4일차 회고"
description: "팀 프로젝트 4일차 회고. 결제와 트랜잭션, 인증번호 전송 등 백엔드 API 진행 상황을 정리했다."
pubDate: 2022-05-15T03:40:45+09:00
category: "Dev/Team-Project"
tags: []
originalUrl: "https://hohorangrang.tistory.com/66"
---

![](./image-1.png)

## 백엔드 진행사항

### 전날 체크사항

- [x] PR 안해도 됨

### 오늘 할 일

- [x] donation API 작성(iamport결제), Transaction 적용 필요.(팀원A)
- [ ] GCP 파일업로드를 위한 json 파일 쿠버네티스에 설정(팀원A) → 내일 배포 완료 후 진행 예정.
- [x] 인증번호 전송 및 인증 API 구현(HoHoRang)
- [x] 로컬 프론트엔드 로그인 화면에서 소셜 로그인 되는지 확인(HoHoRang) (refreshToken 정보는 로그아웃하면 못쓰게 해야 함!)
- [x] ERD 수정
- [x] env 파일 환경변수 입력해서 배포 새로 생성하기
- [x] Redis 쿠버네티스에 생성하기

### 오늘 할 일 진행사항

1\. donation API 작성(iamport결제), Transaction 적용 필요.(팀원A)purchase API 도 작성완료. Transaction 적용은 purchase API 부분만 완료.

donation API 도 transaction적용이 필요함.

donation API 작성완료

2\. GCP 파일업로드를 위한 json 파일 쿠버네티스에 설정(팀원A)

내일 배포 완료 후 진행 예정

3\. 인증번호 전송 및 인증 API 구현(HoHoRang)

checkAuthToken API 최초 작성

sendAuthToken API 최초 작성

phoneToken Entity 추가

createUser API 호출 시 인증된 번호인지 체크하는 로직 추가

4\. 로컬 프론트엔드 로그인 화면에서 소셜 로그인 되는지 확인(HoHoRang)

계속 RefreshToken이 안들어가서 고생했지만... CORS 설정 및 Token 들어가는 것 확인!

5\. ERD 수정

결제 impUid 관련 컬럼 및 핸드폰 토큰 관련 테이블 생성

6\. env 파일 환경변수 입력해서 배포 새로 생성하기

개발과 운영에서 쓰이는 값이 다른 변수들(DB, Domain, 등등)을 env에 별도로 정리해서 새로운 배포 생성

배포 시 환경변수에 env 변수들 입력

배포 후 서비스 노출

인그레스 생성

인그레스에 Cloud DNS 연결

도메인명으로 접속되는 것 확인

7\. Redis 쿠버네티스에 생성하기

### 내일 할 일

- [ ] Redis 이용해서 로그아웃 구현(HoHoRang)
- [ ] 채팅 기능 구현에 대해 공부
- [ ] GCP 파일업로드를 위한 json 파일 쿠버네티스에 설정(팀원A) → 내일 배포 완료 후 진행 예정.
