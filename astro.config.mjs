// @ts-check
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE.url(src/consts.ts)과 같은 값이어야 한다.
const site = 'https://hohorang.github.io';

// 사이트맵 lastmod용: 글 URL → 마지막 수정일
// (설정 파일에서는 content collection을 쓸 수 없어 frontmatter를 직접 읽는다)
const postsDir = new URL('./src/content/posts/', import.meta.url);
const lastmod = new Map(
  readdirSync(postsDir)
    .filter((slug) => existsSync(new URL(`${slug}/index.md`, postsDir)))
    .map((slug) => {
      const fm = readFileSync(new URL(`${slug}/index.md`, postsDir), 'utf8').split('---')[1] ?? '';
      const date = fm.match(/^updatedDate:\s*(.+)$/m)?.[1] ?? fm.match(/^pubDate:\s*(.+)$/m)?.[1];
      return [`${site}/posts/${slug}/`, date ? new Date(date.replace(/['"]/g, '')) : undefined];
    }),
);

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/(search|404)\/?$/.test(page),
      serialize(item) {
        const date = lastmod.get(item.url);
        if (date && !isNaN(date.valueOf())) item.lastmod = date.toISOString();
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
});
