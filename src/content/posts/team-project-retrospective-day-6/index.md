---
title: "[Team-Project] 6일차 회고"
description: "팀 프로젝트 6일차 회고. 여러 도메인을 허용하도록 CORS를 수정하고 인증 관련 민감 정보를 환경 변수로 분리했다."
pubDate: 2022-05-15T03:55:20+09:00
updatedDate: 2022-05-16T10:48:45+09:00
category: "Dev/Team-Project"
tags: []
originalUrl: "https://hohorangrang.tistory.com/68"
---

![](./image-1.png)

## 백엔드 진행사항

### 오늘 할 일

- [x] 여러 도메인에서 서버 API 호출하도록 CORS 수정(HoHoRang)
- [x] 인증 관련 소스에 있는 민감 정보 env로 작성(HoHoRang)

### 오늘 할 일 진행사항

1\. 여러 도메인에서 서버 API 호출하도록 CORS 수정(HoHoRang)

env 파일에 여러 도메인 등록하고, 소스코드에서 해당 정보를 배열로 불러와 해당하는 도메인이 있으면 setHeader 시, Access-Control-Allow-Origin에 해당 도메인을 설정하도록 소스 수정

2\. 인증 관련 소스에 있는 민감 정보 env로 작성(HoHoRang)

auth 관련 소스에 있는 로그 및 정보들 env로 따로 작성하여 분리 작업

### 내일 할 일

- [ ] 주간 회고 작성(각자)
