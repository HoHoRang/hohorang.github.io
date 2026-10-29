---
title: "[Team-Project] 19일차 회고"
description: "팀 프로젝트 19일차 회고. any 타입 제거 등 리팩토링을 이어가고 README와 실제 배포 시 고려 사항을 정리했다."
pubDate: 2022-05-29T21:57:40+09:00
updatedDate: 2022-05-29T21:58:38+09:00
category: "Dev/Team-Project"
tags: []
originalUrl: "https://hohorangrang.tistory.com/78"
---

![](./image-1.png)

## 백엔드 진행사항

### 오늘 할 일

- [x] 리팩토링(계속)
- [x] Wallpaper(월간젤리) API 수정
- [x] 프로젝트 README.md 작성하기
- [x] 실제 배포시 고려할 사항 정리

### 오늘 할 일 진행사항

1\. 리팩토링(계속)

→ Code Refactoring(any 타입 제거)

2\. Wallpaper(월간젤리) API 수정

-   월간젤리 fetch 시, 가장 마지막에 등록한 월간젤리 보여주도록 설정(mobile\_ 버전은 안보이게)
-   월간젤리 create 시, 그대로 생성하기
-   월간젤리 메일링 시, mobile\_버전인 것만 메일링하기

3\. 프로젝트 README.md 작성하기

부족한 항목은 프론트 배포 완료 후 자료 준비하면서 추가로 수정 예정

4\. 실제 배포시 고려할 사항 정리

→ config(환경변수) 정보에 SOCIAL\_REDIRECT\_URL 정보 변경하기

→ user.resolver.ts 파일에 sendThanksMailTest API에 Crontab 설정하기

→ 시현을 위해 월간젤리(Wallpaper) 테이블에 4월, 5월 월간젤리 데이터 넣어놓기

### 이슈

X
