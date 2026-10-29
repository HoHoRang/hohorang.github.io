// 사이트 전역 설정. 커스텀 도메인으로 옮길 때는 SITE.url만 바꾸면 된다.
export const SITE = {
  url: 'https://hohorang.github.io',
  title: "HoHoRang's Devlog",
  description: 'CS, 언어, 프레임워크, DevOps를 공부하며 정리하는 개발 블로그',
  author: 'HoHoRang',
  locale: 'ko-KR',
  github: 'https://github.com/HoHoRang',
  postsPerPage: 10,
};

// 비워 두면 해당 기능은 렌더링되지 않는다.
export const INTEGRATIONS = {
  // Google AdSense 게시자 ID (예: 'ca-pub-1234567890123456')
  adsenseClient: '',
  // AdSense에서 만든 광고 단위의 data-ad-slot 값
  adSlots: {
    listInline: '',
    postTop: '',
    postBottom: '',
  },
  // Google Analytics 4 측정 ID (예: 'G-XXXXXXXXXX')
  gaMeasurementId: '',
  // Search Console / 네이버 서치어드바이저 HTML 태그 인증 값
  googleSiteVerification: '',
  naverSiteVerification: '',
  // https://giscus.app 에서 발급받은 값
  giscus: {
    repo: '',
    repoId: '',
    category: '',
    categoryId: '',
  },
};
