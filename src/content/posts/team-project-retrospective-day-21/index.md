---
title: "[Team-Project] 21일차 회고"
description: "팀 프로젝트 21일차 회고. 프론트엔드 배포 후 발생한 CORS 에러 등 버그를 수정했다."
pubDate: 2022-05-29T22:03:18+09:00
category: "Dev/Team-Project"
tags: []
originalUrl: "https://hohorangrang.tistory.com/80"
---

![](./image-1.png)

## 백엔드 진행사항

### 오늘 할 일

- [x] 프론트 배포 후 버그 잡기

### 오늘 할 일 진행사항

1\. 프론트 배포 후 버그 잡기

→ 팀 노션에 정리 후 수정

### 이슈

1\. 프론트 배포 후, 접속시 CORS 에러 발생함

→ CORS URL을 배열 형식이 아니라, https://voluntier.site 로 설정해줘야 함.

→ 배열 형식이어도 됨. 오타 수정하니 잘 작동함(vountier.site → voluntier.site)
