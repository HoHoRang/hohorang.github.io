---
title: "쿠버네티스 Pod - livenessProbe를 이용해서 Self-healing Pod 만들기"
description: "livenessProbe의 httpGet, tcpSocket, exec 방식으로 컨테이너 상태를 진단하고 self-healing Pod를 만드는 방법을 정리합니다."
pubDate: 2026-03-01T23:30:02+09:00
category: "Dev/Kubernetes"
tags: ["Kubernetes", "Pod", "livenessProbe"]
series: "따라하면서 배우는 쿠버네티스"
---
## Self-healing

- Fail한 컨테이너를 재시작, 재스케줄링 및 대체를 보장

## Liveness Probe(1)

- Pod가 계속 실행할 수 있음을 보장
- Pod의 Spec에 정의
- ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: nginx-pod
  spec:
    containers:
      - name: nginx-container
        image: nginx:1.14
        # 아래 항목 추가
        livenessProbe:
          httpGet:
            path: /
            port: 80
  ```

## Liveness Probe(2)

- livenessProbe 메커니즘
  - httpGet probe: 지정한 IP주소, port, path에 HTTP GET 요청을 보내, 해당 컨테이너가 응답하는지를 확인한다. 반환코드가 200이 아닌 값이 오면 오류, 컨테이너를 다시 시작한다.
  - ```yaml
    livenessProbe:
      httpGet:
        path: /
        port: 80
    ```
  - tcpSocket probe: 지정된 포트에 TCP 연결을 시도. 연결되지 않으면 컨테이너를 다시 시작한다.
  - ```yaml
    livenessProbe:
      tcpSocket:
        port: 22
    ```
  - exec probe: exec 명령을 전달하고 명령의 종료코드가 0이 아니면 컨테이너를 다시 시작한다.
  - ```yaml
    livenessProbe:
      exec:
        command:
          - ls
          - /data/file
    ```

## Liveness Probe(3)

- liveness probe 매개 변수
  - periodSeconds: health check 반복 실행 시간(초)
  - initialDelaySeconds: Pod 실행 후 delay할 시간(초)
  - timeoutSeconds: health check 후 응답을 기다리는 시간(초)
  - ```yaml
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
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 15
            periodSeconds: 20
            timeoutSeconds: 1
            successThreshold: 1
            failureThreshold: 3
    ```

## Liveness Probe example

- liveness probe는 Pod의 spec에 정의한다.
- 아래 example에서 사용한 smlinux/unhealthy 컨테이너는 HTTP connection 있을 때마다 내부 서버 오류로 HTTP 500 Error를 발생시킨다.
- ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: liveness-pod
  spec:
    containers:
      - name: unhealthy-container
        image: smlinux/unhealthy
        ports:
          - containerPort: 8080
            protocol: TCP
        livenessProbe:
          httpGet:
            path: /
            port: 8080
  ```

## Example

- 아래의 liveness-exam.yaml 파일에 self-healing 기능을 추가하시오
  - 동작되는 Pod 내의 컨테이너에 /tmp/healthy 파일이 있는지 5초마다 확인한다.
  - Pod 실행 후 10초 후부터 검사한다.
  - 성공횟수는 1번, 실패횟수는 연속 2회로 구성한다.
- ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: liveness-exam
  spec:
    containers:
      - name: busybox-container
        image: busybox
        args:
          - /bin/sh
          - -c
          - touch /tmp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 600
        livenessProbe:
          exec:
            command:
              - ls
              - /tmp/healthy
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 1
          successThreshold: 1
          failureThreshold: 2
  ```
