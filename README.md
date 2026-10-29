# HoHoRang's Devlog

https://hohorang.github.io — Astro로 만든 개발 블로그

## 로컬 실행

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ 생성 + Pagefind 검색 인덱스
npm run preview    # 빌드 결과 확인 (검색은 빌드 후에만 동작)
```

## 글 쓰기

글 하나가 폴더 하나입니다. 이미지는 같은 폴더에 두고 상대 경로로 넣습니다.

```
src/content/posts/<slug>/
├── index.md
└── image-1.png
```

```yaml
---
title: "글 제목"
description: "검색 결과와 목록에 보이는 1~2문장 요약 (200자 이내)"
pubDate: 2026-10-29T10:00:00+09:00
updatedDate: 2026-10-30T10:00:00+09:00 # 선택
category: "Dev/Kubernetes" # src/data/categories.ts 에 있는 값만 가능
tags: ["Kubernetes", "Pod"]
series: "따라하면서 배우는 쿠버네티스" # 선택: 같은 값끼리 시리즈로 묶임
heroImage: ./cover.png # 선택: OG 이미지로 사용
draft: false # true면 개발 서버에서만 보임
---
```

- `<slug>`가 URL이 됩니다: `/posts/<slug>/`. 영어 kebab-case를 권장합니다.
- 본문 제목은 `##`(h2)부터 씁니다. `#`(h1)은 글 제목으로 자동 렌더링됩니다.
- 카테고리를 추가하려면 `src/data/categories.ts`에 항목을 추가합니다.

## 설정

`src/consts.ts`에서 관리합니다. 값이 비어 있으면 해당 기능은 렌더링되지 않습니다.

| 항목 | 설명 |
|---|---|
| `adsenseClient`, `adSlots` | Google AdSense 게시자 ID와 광고 단위 slot ID |
| `gaMeasurementId` | Google Analytics 4 |
| `googleSiteVerification`, `naverSiteVerification` | Search Console / 네이버 서치어드바이저 소유 확인 |
| `giscus` | GitHub Discussions 기반 댓글 |

커스텀 도메인으로 옮길 때는 `src/consts.ts`의 `SITE.url`, `astro.config.mjs`의 `site`를 바꾸고 `public/CNAME`을 추가합니다.

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드해서 GitHub Pages에 배포합니다.
