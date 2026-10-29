---
title: "쿠버네티스 Pod - static Pod(feat. kubelet daemon)"
description: "API 서버 없이 kubelet daemon이 직접 관리하는 static Pod의 개념과 생성, 삭제 방법을 정리합니다."
pubDate: 2026-03-04T17:31:39+09:00
category: "Dev/Kubernetes"
tags: ["Kubernetes", "Pod", "kubelet"]
series: "따라하면서 배우는 쿠버네티스"
---
## 5. static Pod 만들기

- 그동안 kubectl 명령어로 master node의 API에게 전달하면, etcd 정보를 가져다가 scheduler에게 보내서 어떤 노드를 써야할지 선택해서 Pod를 실행하는 구조였다.
- 하지만 static Pod는 master node의 API에게 요청을 전달하지 않는다.
- 각 worker node에는 kubelet이 있는데, 해당 worker node의 static pod 디렉토리에 yaml을 저장하면 자동으로 생성함(삭제하면 Pod도 삭제)

### static container

- API 서버 없이 특정 노드에 있는 kubelet 데몬에 의해 직접 관리
- /etc/kubernetes/manifests/ 디렉토리에 k8s yaml 파일을 저장 시 적용됨
- static pod 디렉토리 구성
  - `# vi /var/lib/kubelet/config.yaml` 을 보면 아래와 같이 staticPodPath를 설정할 수 있음
  - ...
    staticPodPath: /etc/kubernetes/manifests
  - 디렉토리는 수정 시 kubelet 데몬 재실행해야 한다.
    `# systemctl restart kubelet`

### example

- 특정 node에 접속하여 아래와 같이 /etc/kubernetes/manifests/에 yaml 작성

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
    - name: nginx-container
      image: nginx:1.14
      ports:
        - containerPort: 80
          protocol: TCP
```

- 저장하는 순간, nginx-pod-node2.example.com와 같이 Pod가 실행된다.
- yaml을 삭제하는 순간, Pod도 동시에 삭제된다.
- 참고로, master node의 /etc/kubernetes/manifests/ 경로에도 etcd.yaml, kube-apiserver.yaml, kube-controller-manager.yaml, kube-scheduler.yaml과 같은 파일이 기본 저장되어 있다.(자동 실행)
- 다만, master node에 원하는 yaml을 생성해도 master node가 아닌 worker node 중 하나에 배치됨
