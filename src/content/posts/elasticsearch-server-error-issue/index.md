---
title: "[이슈] Elastic Search 서버 관련 오류"
description: "팀 프로젝트에서 사용하는 Elastic Search 서버를 수정하다 발생한 오류의 원인과 해결 과정을 정리했다."
pubDate: 2022-07-07T22:21:26+09:00
updatedDate: 2022-07-07T22:29:08+09:00
category: "Dev/Team-Project"
tags: ["Elastic Search","Team-Project","이슈","팀프로젝트"]
originalUrl: "https://hohorangrang.tistory.com/82"
---

![](./image-1.png)

오늘 Voluntier 사이트에서 사용하는 Elastic Search 서버를 수정하는 과정에서 오류가 발생해서 해결과정을 정리한다.

## 문제 발생

1\. Voluntier 백엔드 서버(A 서버)와는 별개로 Elastic Search, Logstash 프로세스(B 서버)가 떠있는 구글 계정이 따로 있음

2\. 해당 구글 계정의 크레딧이 다 소모되어, 결제 계정을 비활성화함

3\. Elastic Search, Logstash 서버(B 서버)가 비활성화되면서, 기존의 IP가 없어짐

4\. 백엔드 서버(A 서버)에서 Elastic Search, Logstash 서버(B 서버)에 연결이 안되어, 연결시도를 하다가 MySQL 조회로 넘어가지만 조회 오류 발생함

5\. 그래서 기존 B서버가 있는 VM 인스턴스를 다시 재개함

6\. 다시 문제가 발생했는데, 다시 재개하니 외부 IP가 변경되어 버림

7\. 기존에 DNS명에 연결된 IP가 변경되니, Logstash 및 백엔드(A 서버)에서 Elastic Search에 연결이 안됨

8\. 그래서 DNS 설정에서 변경된 IP로 다시 설정함

9\. 추가로, MySQL 서버 설정에서 변경된 IP로 접근 허용해줌

10\. Logstash의 데이터 적재 및 백엔드(A 서버)에서도 접근이 가능해짐

11\. VM 인스턴스(B 서버)는 그대로 있는 상태에서 그 안의 Elastic Search 프로세스만 내리면, 지연시간 없이 연결 실패 후 바로 MySQL 조회하는 로직으로 넘어감

12\. Elastic Search를 통해 검색하면 기능 정상 작동함

## 결론

Elastic Search를 조회하지 못할 때, MySQL을 조회하도록 로직이 구성되어 있는데, Elastic Search의 서버 IP 자체가 변경되어 서버를 찾지 못하면 지연시간이 있고, MySQL로도 정상적으로 조회가 안됨

1.  DNS 구성 / 서버 정상: 정상적으로 조회됨
2.  DNS 구성 / 서버 비정상: MySQL로 정상적으로 넘어감
3.  DNS 구성 / 서버가 없는 경우: 해당 IP로 계속 찾다가 오류 발생함
4.  DNS 구성 안됨 / 서버 상관없음: MySQL로 정상적으로 넘어감

실제로 기업에서 운영할 때에는, 서버 작업 없이는 IP가 변경되는 경우가 없을 것 같다고 생각됨

그래서 우선 DNS 설정에서 Elastic Search 서버를 지우고, 서버를 비활성화함

추후 별도의 계정으로 Elastic Search, Logstash 서버(VM 인스턴스)를 구성해서 연결해주어야 함

그건 그렇고, GCP 무료 크레딧을 이용하다보니, 주기적으로 서버 크레딧이 다 소모되었는지 확인해야 하는게 엄청 귀찮다...

취업을 하더라도 팀프로젝트 사이트는 계속 열어두고 싶은데 다른 방법을 한 번 찾아봐야겠다.
