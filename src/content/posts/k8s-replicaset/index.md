---
title: "ReplicaSet"
description: "ReplicaSet으로 Pod 개수를 보장하는 방법과 ReplicationController와의 차이점(selector)을 정리합니다."
pubDate: 2026-04-09T14:33:06+09:00
category: "Dev/Kubernetes"
tags: ["Kubernetes", "Controller", "ReplicaSet"]
series: "따라하면서 배우는 쿠버네티스"
---
- ReplicationController와 같은 역할을 하는 컨트롤러
- ReplicationController보다 풍부한 selector

  ```yaml
  selector:
    matchLabels:
      component: redis
    matchExpressions:
      - { key: tier, operator: In, values: [cache] }
      - { key: environment, operator: NotIn, values: [dev] }
  ```

- matchExpressions 연산
  - In: key와 values를 지정하여, key, value가 일치하는 Pod만 연결
  - NotIn: key는 일치하고 value는 일치하지 않는 Pod에 연결
  - Exists: key에 맞는 label의 pod를 연결
  - DoesNotExist: key와 다른 label의 pod를 연결
