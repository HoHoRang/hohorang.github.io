---
title: "[Team-Project] 5일차 회고"
description: "팀 프로젝트 5일차 회고. 팀 피드백을 반영하고 GitHub 칸반보드 자동화와 배포 설정을 진행했다."
pubDate: 2022-05-15T03:51:48+09:00
updatedDate: 2022-05-16T10:48:57+09:00
category: "Dev/Team-Project"
tags: []
originalUrl: "https://hohorangrang.tistory.com/67"
---

![](./image-1.png)

## 백엔드 진행사항

### 팀플 피드백

- [x] Master에 push하면 배포 자동화 할 수 있었는데, Github 공용 레포지토리 권한이 없음. 우리가 Admin 권한 받아도 되는지?
- [x] 핸드폰 토큰을 MySQL에 저장해도 괜찮은지?
- [x] 기본적인 기능으로 구현하는 만큼, 완성도 높게, 그리고 코드 작성도 리팩토링해서 깔끔하게 작성
- [x] 상품 이미지 테이블에는 소프트삭제가 아니라 그냥 삭제를 해도 됨
- [x] 게시글에 유저정보가 빠짐(관계가 없음)

### 오늘 할 일

- [x] (알아낸거)Github 칸반보드 자동화
- [x] Backend 팀원 한 명 Github Admin으로 설정하기
- [x] GCP 파일업로드를 위한 json 파일 쿠버네티스에 설정(팀원A)
- [x] 후원 취소 API 작성(팀원A)
- [x] 도메인의 TXT, A 등 레코드 세트 설정 가비아가 아니라 GCP에서 해주기(HoHoRang)
- [x] Redis 로컬에서 연결하고 Redis 이용해 로그아웃 구현(HoHoRang)
- [x] GCP에서 서버 → Redis 연결 확인(HoHoRang) 및 로그아웃 기능 확인(HoHoRang)

### 오늘 할 일 진행사항

1\. (알아낸거)Github 칸반보드 자동화

각 컬럼에서 Manage automation 설정에 들어가 Preset을 선택 후 옮겨지는 조건을 선택하면 설정이 된다. 그리고 Issue를 create, reopen, close할 때 자동으로 해당하는 컬럼에 들어가게 됨!

2\. Backend 팀원 한 명 Github Admin으로 설정하기

HoHoRang backend github admin으로 설정함. 추후 GCP Cloud Build 트리거 생성하기 위함.

3\. GCP 파일업로드를 위한 json 파일 쿠버네티스에 설정

4\. 후원 취소 API 작성(팀원A)

transaction까지 적용 완료

5\. 도메인의 TXT, A 등 레코드 세트 설정 가비아가 아니라 GCP에서 해주기(HoHoRang)

추후 자동 메일링 기능을 추가할 것을 염두에 두고 메일 도메인 인증

6\. Redis 로컬에서 연결하고 Redis 이용해 로그아웃 구현(HoHoRang)

-   로컬 서버 → 로컬 Redis 연결 정상
-   로컬 서버 → GCP Redis 연결 정상
-   로그아웃 API 구현 및 Redis에 로그아웃된 토큰 저장되는 것 확인

7\. GCP에서 서버 → Redis 연결 확인(HoHoRang) 및 로그아웃 기능 확인(HoHoRang)

### 내일 할 일

- [ ] 주간 회고 작성(각자)
