---
title: "7개 디스크 설치"
description: "RAID 실습을 위해 하드 디스크 7개를 추가하고, 파티션 타입을 raid auto로 지정한 뒤 mdadm을 설치하는 과정을 정리합니다."
pubDate: 2026-02-28T00:00:59+09:00
category: "Dev/Linux"
tags: ["Linux", "Ubuntu", "Disk"]
series: "이것이 우분투 리눅스다"
---
https://www.youtube.com/watch?v=stRWo6sPGyI&list=PLVsNizTWUw7HAcyW6bma7trGJfiTSDA44&index=35

1. 하드 디스크 추가

2. 각 하드 디스크 파티셔닝 (/dev/sd\*)

3. 파티셔닝 시, Type을 기본 Linux -> raid auto로 변경

4. apt -y install mdadm (raid 툴)

5. 재부팅
