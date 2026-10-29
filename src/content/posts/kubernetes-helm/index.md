---
title: "Helm"
description: "Kubernetes 패키지 관리자 Helm의 핵심 개념(Chart, Release, Values)과 자주 쓰는 명령어를 정리했다."
pubDate: 2026-01-16T23:46:53+09:00
updatedDate: 2026-01-16T23:49:13+09:00
category: "Dev/Kubernetes"
tags: ["Helm","Kubernetes"]
originalUrl: "https://hohorangrang.tistory.com/87"
---

## 1. Helm이란

-   Kubernetes를 위한 패키지 관리자. apt, yum, npm처럼 애플리케이션을 패키징하고 배포하는 도구

### 핵심 개념

-   Chart: 여러 Kubernetes 리소스를 하나의 패키지로 묶음
-   Release: Chart를 클러스터에 설치한 인스턴스(버전은 Revision이라고 함)
-   Values: Chart를 커스터마이징하는 설정값. 환경별로 다른 values 사용

### 왜 필요할까?

-   복잡한 Kubernetes 리소스 yaml 파일들을 하나로 관리
-   환경별 설정 관리 가능
-   버전 관리 및 롤백 가능
-   차트를 재사용하기 쉬움
-   모든 리소스가 함께 성공하거나 함께 실패(부분 배포 방지)
-   Chart 간 의존성 정의 및 필요한 Chart 자동 설치

> ❓라고는 하지만, 정확히 무슨 기능을 하는지, 왜 필요한지 아직 감이 오지 않는다. 아래 기능들을 살펴보고 마지막에 다시 필요성에 대해 생각해볼 것이다.

## 2. Helm Hub vs Repo

### 1) Hub(웹 인터페이스)

-   인터넷에서 차트를 검색하고 정보를 확인하는 웹 사이트(예를 들면 깃허브와 같음)
-   예: Artifact Hub([https://artifacthub.io](https://artifacthub.io))

### 2) Repo(Helm repository)

-   차트를 저장하고 제공하는 서버/저장소(예를 들면 깃허브 내의 특정 레포지토리와 같음)
-   예: [https://prometheus-community.github.io/helm-charts](https://prometheus-community.github.io/helm-charts)
-   helm repo add로 hub의 repo 중 하나를 로컬에 등록 가능
-   helm repo list로 로컬에 등록된 repo 확인 가능
-   helm repo update로 저장소를 업데이트 할 수 있음

```bash
# Repo 추가 (로컬 Helm에 저장소 등록)
helm repo add prometheus-community <https://prometheus-community.github.io/helm-charts>

# 로컬 저장소 조회
helm repo list
# NAME                	URL
# prometheus-community	<https://prometheus-community.github.io/helm-charts>

# 로컬 저장소 업데이트(최신 차트 목록 가져오기)
helm repo update
# Hang tight while we grab the latest from your chart repositories...
# ...Successfully got an update from the "prometheus-community" chart repository
# Update Complete. ⎈Happy Helming!⎈
```

## 3. Helm install 시 필요한 것

### 1) Kubernetes 클러스터 (필수)

-   Helm은 Kubernetes에 리소스를 배포하므로, 클러스터 연결이 되어있어야 helm install 사용이 가능

### 2) Helm 설치 (필수)

-   명령어 사용을 위해서 당연히 설치해야?

### 3) Values 설정 (선택)

-   기본값으로 설치할 수도 있고, 커스터마이징할 수도 있음

#### a) 기본 설정으로 설치

```bash
# 기본 설정으로 설치
helm install my-release prometheus-community/kube-prometheus-stack
```

#### b) values 파일 수정하여 설치

```bash
# 1. 기본 values 확인
helm show values prometheus-community/kube-prometheus-stack > my-values.yaml

# 2. 필요한 값만 수정
# ex. grafana.enabled: true

# 3. 수정한 values 파일로 설치
helm install my-release prometheus-community/kube-prometheus-stack -f my-values.yaml
```

#### c) 인라인 설정으로 설치

```shell
# 값 직접 지정
helm install my-release prometheus-community/kube-prometheus-stack \
  --set grafana.enabled=true \
  --set prometheus.enabled=true
```

-   c) 인라인 설정 > b) -f로 파일 지정 > a) 기본 설정 순으로 우선순위가 높게 적용됨

## 4. Helm install의 동작

### helm install의 동작 순서

> 실제 helm chart를 예시로 확인하면 더 이해가 쉽다  
> (https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)

0\. helm install 실행

```shell
helm install my-release prometheus-community/kube-prometheus-stack
```

1\. Chart.yaml 읽기 (메타데이터, 의존성 확인)

```shell
name: kube-prometheus-stack
type: application
dependencies:
  - name: crds
  ...
```

2\. values.yaml 읽기 (설정값)

```shell
crds:
  enabled: true
  ...
```

3\. templates/ 디렉토리 템플릿 파일들 + values.yaml 조합

-   ex: templates/alertmanager/service.yaml 템플릿 처리
-   그 안의 조건들을 실제 values.yaml 값으로 치환

4\. Kubernetes 리소스 yaml 생성 (Deployment, Service 등)

```shell
apiVersion: v1
kind: Service
metadata:
  name: kube-prometheus-stack-alertmanager
  ...
```

5\. Kubernetes 클러스터에 배포 (kubectl apply -f XXX.yaml와 같이)

```shell
# Helm 내부적으로 아래와 같이 실행
kubectl apply -f <생성된yaml>
```

## 5. type: application? library?

-   Chart.yaml에 정의된 type에 application은 뭘까?
-   type에는 application, library가 존재함

### 1) application

-   기본값이며, 실제로 설치 가능한 차트를 의미함
-   Kubernetes 리소스(Deployment, Service 등)을 직접 생성
-   values.yaml로 커스터마이징 가능

### 2) library

-   직접 설치할 수 없고, 다른 차트에서 재사용할 공통 로직을 제공하는 차트
-   Kubernetes 리소스를 직접 생성하지 않음
-   templates/ 디렉토리에 named template(helper)만 포함
-   다른 차트의 dependencies에서 참조하여 사용(코드 재사용 및 표준화)

## 6. Helm template

> 💡 쿠버네티스 클러스터에 손쉽게 리소스를 배포하는 건 좋다. 그런데 install을 하면 바로 적용이 되어버리는게 너무 무섭지 않나?

-   그래서 아래 명령어로 차트만 미리 그려볼(렌더링) 수 있다.

```shell
# 차트 전체 렌더링
helm template my-release prometheus-community/kube-prometheus-stack

# ❌ 이렇게는 안 된다
helm template my-release prometheus-community/kube-prometheus-stack/templates/alertmanager/service.yaml

# --show-only 옵션으로 특정 템플릿만 렌더링 할 수 있음
helm template my-release prometheus-community/kube-prometheus-stack \
  --show-only templates/alertmanager/service.yaml
```

-   명령어 이름이 template이라고 템플릿 단위로 렌더링하는가 싶은데, 그게 아니라 차트 전체(하위 모든 템플릿)에 대해서 렌더링한다.
-   helm install 명령어와 동작 방식이 거의 비슷하다.

### helm template의 동작 순서

1.  helm template 실행
2.  Chart.yaml 읽기 (메타데이터, 의존성 확인)
3.  values.yaml 읽기 (설정값)
4.  templates/ 디렉토리 템플릿 파일들 + values.yaml 조합
5.  Kubernetes 리소스 yaml 생성 (Deployment, Service 등)
6.  렌더링된 모든 yaml 출력

## 7. Helm install과 Helm template의 차이

> 💡 helm install에도 --dry-run이라는 옵션이 있다. 이게 helm template과 무슨 차이지?

### 1) helm template

```bash
helm template my-release prometheus-community/kube-prometheus-stack
```

-   values를 템플릿에 렌더링
-   결과를 stdout으로 출력만
-   클러스터에 적용하지 않음
-   릴리즈로 기록되지 않음
-   렌더링한 차트를 kubectl 명령어로 적용할 수 있지만, helm list로 관리되지 않음

### 2) helm install --dry-run --debug

```shell
helm install my-release prometheus-community/kube-prometheus-stack \
  --dry-run --debug
```

-   매니페스트 생성 + 검증까지 수행
-   클러스터 API 서버에 요청해서 리소스 유효성 검증까지 수행
-   실제 생성은 하지 않음

helm template → 빠르게 렌더링하고 GitOps, CI/CD 등에 적용하기 적합

helm install --dry-run → 실제 배포 환경 시뮬레이션

## 8. Helm list, install, upgrade, rollback, history

### 1) helm list

-   설치된 릴리즈 목록을 조회

### 2) helm install

-   새로운 릴리즈를 생성하고 클러스터에 배포
-   릴리즈 이름이 존재하지 않아야 하고(존재하면 에러), REVISION1로 시작(

### 3) helm upgrade

-   기존 릴리즈를 업데이트
-   기존 values와 새 vlaues 병합
-   템플릿 재렌더링
-   변경된 리소스만 업데이트
-   REVISION 번호 증가
-   REVISION 이력 보존

### 4) helm rollback

-   이전 리비전으로 되돌림
-   지정한 리비전의 매니페스트를 다시 적용
-   새로운 리비전이 생성됨(되돌리더라도 하나의 변경점으로 인식)

### 5) helm history

-   릴리즈의 모든 리비전 이력을 조회

## 9. Helm이 Kubernetes에 필요한 이유

### 1) Kubernetes

-   컨테이너 오케스트레이션 플랫폼 자체
-   컨테이터 실행 및 관리
-   스케줄링, 네트워킹, 스토리지
-   리소스(Pod, Service, Deployment 등) 생성/관리

아래와 같은 문제점

-   여러 yaml 파일을 각각 관리해야 함
-   환경별 설정 관리가 어려움
-   버전 관리 및 롤백 메커니즘이 없음
-   업그레이드 시 리소스 간 의존성이나 설치 순서 보장 어려움

### 2) Helm

-   Kubernetes 위에서 동작하는 패키지 관리자(apt, yum, npm과 유사)
-   여러 Kubernetes 리소스를 하나의 패키지(차트)로 묶고 의존성 관리해 설치 순서 보장
-   템플릿 기반으로 설정 관리
-   버전 관리 및 롤백 가능
-   배포 이력 추적
-   재사용 가능한 패키지 공유
