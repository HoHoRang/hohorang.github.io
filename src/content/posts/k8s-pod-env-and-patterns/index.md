---
title: "쿠버네티스 Pod - Pod 환경변수 설정과 실행 패턴"
description: "Pod 환경변수로 컨테이너에 데이터를 전달하는 방법과 Sidecar, Adapter, Ambassador 같은 Pod 구성 패턴을 정리합니다."
pubDate: 2026-03-12T16:17:25+09:00
category: "Dev/Kubernetes"
tags: ["Kubernetes", "Pod"]
series: "따라하면서 배우는 쿠버네티스"
---
## 7. Pod의 환경변수 설정하기

### 환경변수

- Pod 내의 컨테이너가 실행될 때 필요로 하는 변수
- 컨테이너 제작 시 미리 정의
  - Nginx Dockerfile의 예
    ENV NGINX_VERSION 1.19.2
    ENV NJS_VERSION 0.4.3
- Pod 실행 시 미리 정의된 컨테이너 환경변수를 변경할 수 있다.

### 환경변수 사용 예

`$ cat pod-nginx-env.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-env
spec:
  containers:
    - name: nginx-container
      image: nginx:1.14
      ports:
        - containerPort: 80
          protocol: TCP
      env: # 추가된 환경변수
        - name: MYVAR
          value: "testvalue"
```

## 8. Pod 구성 패턴의 종류

### Pod 실행 패턴

- Pod를 구성하고 실행하는 패턴
- multi-container Pod
  - Sidecar: container 2가지가 함께 동작해야 구현할 수 있는 형태
  - Adapter: 밖에 있는 서비스(데이터)를 가져와 App으로 서비스하는 형태
  - Ambassador: App에서 받은 데이터를 내부 서비스들로 분배(LB)하는 형태
