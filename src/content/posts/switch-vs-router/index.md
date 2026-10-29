---
title: "스위치 vs 라우터"
description: "MAC 주소로 동작하는 Layer 2 스위치와 IP 주소로 동작하는 Layer 3 라우터의 동작 방식과 차이를 정리했다."
pubDate: 2026-01-11T19:51:20+09:00
updatedDate: 2026-01-11T19:52:39+09:00
category: "CS/Network"
tags: []
originalUrl: "https://hohorangrang.tistory.com/85"
---

## Layer 2 스위치

#### MAC 주소만으로 동작

동작 방식

1\. 프레임의 Src MAC 보고 자동 학습

\- Port 1 -> aa:aa:aa:aa:aa:aa 학습

\- Port 2 -> bb:bb:bb:bb:bb:bb 학습

2\. Dst MAC 보고 포워딩

\- aa:aa:aa:aa:aa:aa 목적지? -> Port 1로 전달

\- bb:bb:bb:bb:bb:bb 목적지? -> Port 2로 전달

> ARP 사용? ❌  
> IP 주소? ❌

MAC 테이블 예시

| Port | MAC Address |
| --- | --- |
| 1 | aa:aa:aa:aa:aa:aa |
| 2 | bb:bb:bb:bb:bb:bb |
| 3 | cc:cc:cc:cc:cc:cc |

---

## Layer 3 라우터

#### IP 주소로 라우팅, ARP로 MAC 찾기

동작 방식

1\. IP 패킷의 Dst IP 확인

\- 목적지: 10.0.0.50

2\. 라우팅 테이블 검색

\- 10.0.0.0/8 -> next hop: 192.168.1.254

3\. ARP 테이블 확인

\- 192.168.1.254의 MAC은? -> cc:cc:cc:cc:cc:cc

4\. 없으면 ARP Request 전송

\- 192.168.1.254 IP를 가진 기기는?

5\. MAC 주소로 프레임 생성하여 전달

> ARP 사용? ✅  
> IP 주소? ✅ IP 주소를 이용해 라우팅함

라우팅 테이블 예시

| Destination | Next Hop |
| --- | --- |
| 10.0.0.0/8 | 192.168.1.254 |
| 0.0.0.0/0 | 192.168.1.1 |

ARP 테이블 예시

| IP | MAC |
| --- | --- |
| 192.168.1.254 | cc:cc:cc:cc:cc:cc |
| 192.168.1.1 | dd:dd:dd:dd:dd:dd |

---

## 핵심 차이

| 구분 | Layer 2 스위치 | Layer 3 라우터 |
| --- | --- | --- |
| 기준 | MAC 주소 | IP 주소 |
| 학습 | MAC 자동 학습 | 라우팅 테이블 설정 |
| ARP | 쓰지 않음(통과만) | 적극 사용 |
| 범위 | 같은 네트워크 | 네트워크 간 연결 |
| 헤더 변경 | MAC 바꾸지 않음 | MAC 바꿈 |
