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

## 글 발행 흐름

```
develop 에서 글 작성 → push → (자동) develop → main PR 생성 → 머지 → 배포
```

1. `develop` 브랜치에서 글을 쓰고 push합니다.
2. `ci.yml`이 타입 검사와 빌드를 돌립니다(main 외 모든 브랜치 push). frontmatter 오류가 있으면 여기서 실패합니다.
3. `publish-pr.yml`이 `develop → main` PR을 만듭니다. 이미 열려 있으면 본문의 "반영할 글" 목록만 갱신합니다.
4. PR을 **Create a merge commit**으로 머지하면 `deploy.yml`이 GitHub Pages에 배포합니다.
   - Squash로 머지하면 `develop`과 `main`의 히스토리가 갈라져서 다음 PR에 이미 반영된 커밋이 다시 섞입니다.

`main`에는 직접 push하지 않습니다.
