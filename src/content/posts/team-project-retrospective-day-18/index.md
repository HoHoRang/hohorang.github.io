---
title: "[Team-Project] 18일차 회고"
description: "팀 프로젝트 18일차 회고. 상품 검색 기능을 추가하고 Elastic Search 장애 시 MySQL을 조회하는 방법을 찾아봤다."
pubDate: 2022-05-29T21:54:57+09:00
category: "Dev/Team-Project"
tags: []
originalUrl: "https://hohorangrang.tistory.com/77"
---

![](./image-1.png)

## 백엔드 진행사항

### 오늘 할 일

- [x] 상품 검색기능 추가(Elasticsearch 는 안붙이는걸로)
- [x] 엘라스틱 서치 작동하지 않을 때, MySQL을 조회하는 방법 찾아보기(HoHoRang)

### 오늘 할 일 진행사항

1\. 상품 검색기능 MySQL로 하도록 추가(상품수도 적을 뿐더러, 시간관계상 Elasticsearch로는 하지 않음)

2\. 엘라스틱 서치가 작동하지 않을 때, MySQL(매니지 서비스로 돌아가는 SQL)을 조회하는 방법을 찾아봐야 할 것 같음(AWS에서 제공하는 Open Search라는 서비스를 이용하는 방법도 있음. 다만, Logstash는 지원하지 않아서 별도로 Data를 MySQL로부터 가져오는 작업이 필요함)

→ ConnectionError: getaddrinfo ENOTFOUND elasticsearc 와 같이 해당 오류가 잡힌 경우에 mysql을 조회하도록 하는 방법? → 이 방법은 매번 조회할 때마다 엘라스틱서치 상태를 봐야 함

→ try, catch 문으로 엘라스틱서치 조회가 안되면, MySQL 조회하도록 수정함(에러 발생하면 바로 MySQL 조회됨)

### 이슈

X
