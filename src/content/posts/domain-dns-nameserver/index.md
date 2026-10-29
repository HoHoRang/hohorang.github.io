---
title: "도메인은 어디서 관리할까?(DNS, NS)"
description: "도메인을 구입한 뒤 왜 NS 설정이 필요한지, 도메인 등록 기관과 DNS 서비스의 역할 차이를 정리했다."
pubDate: 2026-02-04T23:15:09+09:00
category: "CS/Network"
tags: ["DNS","NS","도메인"]
originalUrl: "https://hohorangrang.tistory.com/88"
---

## 도메인에 대한 의문점

> 도메인을 왜 구입해야 하고, 구입한 도메인에 NS 설정은 왜 해야할까?  
> 이 도메인은 이 NS를 제공하는 곳에서 레코드를 관리하겠다는 개념인건가?

## NS(Name Server) 레코드의 의미

> "이 도메인의 DNS 레코드는 이 NS들이 관리한다"는 위임 선언

## 도메인 등록 기관 vs DNS 서비스 제공자

```bash
┌─────────────────────────────────────────────────┐
│ 도메인 등록 기관 (Registrar)                        │
│ 예: GoDaddy, Namecheap, Gabia 등                 │
│                                                 │
│ 역할:                                            │
│ ✅ 도메인 소유권 관리                                │
│ ✅ 도메인 갱신/결제                                 │
│ ✅ NS 레코드 설정                                  │
│ ❌ 실제 DNS 레코드 관리 (A, CNAME 등)는 안 함          │
└──────────────────┬──────────────────────────────┘
                   │
                   │ NS 레코드로 위임
                   ↓
┌─────────────────────────────────────────────────┐
│ DNS 서비스 제공자 (DNS Provider)                    │
│ 예: AWS Route53, Cloudflare, Google Cloud DNS    │
│                                                 │
│ 역할:                                            │
│ ✅ 실제 DNS 레코드 관리 (A, CNAME, TXT 등)           │
│ ✅ DNS 조회 응답                                   │
│ ✅ external-dns가 여기에 등록                       │
│ ❌ 도메인 소유권 관리 안 함                           │
└─────────────────────────────────────────────────┘
```

## 실제 예시

### Step 1: 도메인 구매

```bash
Namecheap에서 'example.com' 도메인 구매
```

이 시점의 NS 기본 설정:

```bash
example.com.  IN  NS  dns1.namecheap.com.
example.com.  IN  NS  dns2.namecheap.com.
```

Namecheap의 DNS 서버가 example.com의 레코드를 관리

### Step 2: AWS Route53으로 DNS 관리 이전

왜 이전하나?

\- AWS에서 쿠버네티스 클러스터 운영

\- external-dns가 자동으로 레코드 관리하려면 API 필요

\- Namecheap DNS는 API가 제한적

```bash
# 1. AWS Route53에서 Hosted Zone 생성
$ aws route53 create-hosted-zone --name example.com

# AWS가 NS 레코드 제공
Name Servers:
  ns-1234.awsdns-12.com
  ns-5678.awsdns-34.org
  ns-9012.awsdns-56.net
  ns-3456.awsdns-78.co.uk
```

```bash
# 2. Namecheap 관리 페이지에서 NS 변경
기존:
  dns1.namecheap.com
  dns2.namecheap.com

변경:
  ns-1234.awsdns-12.com
  ns-5678.awsdns-34.org
  ns-9012.awsdns-56.net
  ns-3456.awsdns-78.co.uk
```

### Step 3: 이제 AWS Route53에서 레코드 관리

```bash
# AWS Route53에서 레코드 추가
my-service.example.com  A  192.168.10.111

# external-dns(on-premise 환경)도 여기에 자동 등록
$ kubectl apply -f ingress.yaml
→ external-dns가 AWS Route53 API 호출
→ 레코드 자동 생성
```

Namecheap은 더 이상 DNS 레코드를 관리하지 않고, NS만 관리

## DNS 조회 과정에서의 NS의 역할

### 클라이언트가 my-service.example.com을 조회할 때

```bash
1. 클라이언트
   ↓ "example.example.com의 IP는?"

2. 로컬 DNS (168.126.63.1 - KT)
   ↓ 캐시 없음 → 재귀 조회 시작

3. 루트 네임서버 (.)
   ↓ ".com TLD는 ns1.nic.com에 물어보세요"

4. .com TLD 네임서버
   ↓ "example.com는 누가 관리하나요?"
   ↓ NS 레코드 확인:
   example.com.  IN  NS  ns-1234.awsdns-12.com.  ← 여기!
   ↓ "example.com는 AWS Route53이 관리합니다"

5. AWS Route53 (ns-1234.awsdns-12.com)
   ↓ "my-service.example.com는 192.168.10.111입니다"

6. 로컬 DNS (KT)
   ↓ 캐싱 후 클라이언트에 응답

7. 클라이언트
   → 192.168.10.111 받음!
```

## 왜 도메인 등록기관과 DNS 서비스 제공자를 나눌까?

```bash
도메인 등록 기관:
  ✅ 도메인 갱신 자동화
  ✅ 소유권 보호
  ✅ WHOIS 관리
  ❌ DNS 성능/기능은 보통

DNS 서비스 제공자:
  ✅ 빠른 DNS 응답 (전 세계 분산)
  ✅ DDoS 방어
  ✅ 고급 기능 (트래픽 라우팅, Geo DNS)
  ✅ API (external-dns 같은 자동화)
```

```bash
Registrar에서 NS만 바꾸면
→ 쉽게 DNS 제공자 변경 가능

예:
Namecheap DNS (부족함)
  ↓ NS 변경
AWS Route53 (만족)
  ↓ NS 변경
Cloudflare (더 좋음)
```

```bash
# external-dns가 자동으로 레코드 관리
external-dns:
  provider: aws  # ← Route53 API 사용

# Namecheap DNS는 API가 제한적이라
# 자동화가 어렵거나 불가능
```
