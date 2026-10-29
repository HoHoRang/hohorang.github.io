---
title: "Ingress, Cert-manager, Issuer가 인증서를 발급받는 방식"
description: "쿠버네티스에서 Ingress, Cert-manager, Issuer가 순서대로 상호작용해 TLS 인증서를 발급받는 과정을 정리했다."
pubDate: 2026-01-13T23:02:42+09:00
updatedDate: 2026-01-16T23:52:32+09:00
category: "Dev/Kubernetes"
tags: ["Kubernetes","network","security"]
originalUrl: "https://hohorangrang.tistory.com/86"
---

(내가 다시 보려고 정리해두는 글)

## 인증서 발급 순서

> 아래 순서는 쿠버네티스 상 Ingress, Cert-manager, Issuer라는 리소스가 있을 때를 가정하고 설명합니다.  
> (+ 인증서를 발급받기 위한 도메인 관련 설정, 인증은 제외한 설명입니다)

### 1. Cert-manager가 Ingress 감시

-   Ingress 리소스를 Watch
-   cert-manager.io/cluster-issuer annotation 확인
-   spec.tls\[\].secretName 확인

### 2. Certificate 리소스 생성

-   cert-manager가 자동 생성
-   실제 인증서가 아니라 발급 요청 설정

```go
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: data.example.com-tls
spec:
  secretName: data.example.com-tls  # 생성할 Secret 이름
  issuerRef:
    name: on-prem-issuer
    kind: ClusterIssuer
  dnsNames:
    - data.example.com
```

### 3. CertificateRequest 생성

-   cert-manager가 Certificate를 처리하며 CertificateRequest 생성
-   이 단계에서 issuer로 전달(그냥 Issuer는 네임스페이스 단위, ClusterIssuer는 클러스터 단위로 적용)

```shell
apiVersion: cert-manager.io/v1
kind: CertificateRequest
metadata:
  name: data.example.com-tls-xxxxx
spec:
  issuerRef:
    name: issuer # 외부 CA와 통신하거나 자체 인증서 생성하기 위한 리소스
    kind: ClusterIssuer
  dnsNames:
    - data.example.com
```

### 4. Challenge 리소스 생성 (DNS-01)

-   cert-manager가 Challenge 생성
-   DNS-01 챌린지 수행

```go
apiVersion: acme.cert-manager.io/v1
kind: Challenge
metadata:
  name: data.example.com-tls-xxxxx-0
spec:
  type: DNS-01
  dnsName: data.example.com
  solver:
    dns01:
      route53:
        region: ap-northeast-2
```

### 5. Issuer가 Let's Encrypt와 통신

-   issuer가 Let's Encrypt ACME 서버와 통신(인증서 발급기관으로 Let's Encrypt를 사용할 때)
-   DNS-01 챌린지 수행:
    -   Let's Encrypt가 챌린지 토큰 제공
    -   cert-manager가 Route53에 TXT 레코드 생성
    -   Let's Encrypt가 DNS 조회로 검증
    -   검증 완료 후 인증서 발급

### 6. cert-manager가 인증서 수신 → Secret 생성

-   cert-manager가 인증서를 받아 Secret 생성

```go
apiVersion: v1
kind: Secret
metadata:
  name: data.example.com-tls
type: kubernetes.io/tls
data:
  tls.crt: <실제 인증서>
  tls.key: <개인키>
```

### 7. Ingress가 Secret 사용

-   nginx-ingress-controller가 Secret을 자동 로드
-   HTTPS 활성화

### 전체 흐름

| 단계 | 리소스 | 설명 |
| --- | --- | --- |
| 1 | Ingress | cert-manager에게 신호 제공 |
| 2 | Certificate | cert-manager가 인증서 발급 요청 설정 |
| 3 | CertificateRequest | issuer로 전달되는 요청 |
| 4 | Challenge | cert-manager가 생성하고 issuer가 DNS-01 챌린지 수행 |
| 5 | issuer | Let's Encrypt와 통신 |
| 6 | Secret | 실제 인증서 저장 |
| 7 | Ingress | Secret 사용하여 HTTPS 활성화 |
