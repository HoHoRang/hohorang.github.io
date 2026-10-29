import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, CATEGORY_TREE, getCategory, type CategoryInfo } from '../data/categories';

export type Post = CollectionEntry<'posts'>;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const postUrl = (post: Post) => `/posts/${post.id}/`;
export const categoryUrl = (category: CategoryInfo) => `/categories/${category.path}/`;
export const tagSlug = (tag: string) => tag.toLowerCase().replace(/[\s/?#%]+/g, '-');
export const tagUrl = (tag: string) => `/tags/${tagSlug(tag)}/`;
export const seriesSlug = (series: string) => series.toLowerCase().replace(/[\s/?#%]+/g, '-');
export const seriesUrl = (series: string) => `/series/${seriesSlug(series)}/`;

// 상위 카테고리에는 하위 카테고리 글까지 포함한다.
export function postsInCategory(posts: Post[], category: CategoryInfo): Post[] {
  return posts.filter(
    (p) => p.data.category === category.key || p.data.category.startsWith(`${category.key}/`),
  );
}

export interface CategoryStat {
  category: CategoryInfo;
  count: number;
  // 가장 최근 글의 발행일 (NEW 표시용)
  latest?: Date;
}

export interface CategoryCount extends CategoryStat {
  children: CategoryStat[];
}

// posts는 최신순이어야 한다 (getPosts 결과).
export function categoryStat(posts: Post[], category: CategoryInfo): CategoryStat {
  const list = postsInCategory(posts, category);
  return { category, count: list.length, latest: list[0]?.data.pubDate };
}

// 글이 하나도 없는 카테고리는 숨긴다.
export function categoryCounts(posts: Post[]): CategoryCount[] {
  return CATEGORY_TREE.map((top) => {
    const children = CATEGORIES.filter((c) => c.parent === top.name)
      .map((c) => categoryStat(posts, c))
      .filter((c) => c.count > 0);
    return { ...categoryStat(posts, getCategory(top.name)), children };
  }).filter((c) => c.count > 0);
}

export function collectTags(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const entry = counts.get(tagSlug(tag)) ?? { tag, count: 0 };
      entry.count += 1;
      counts.set(tagSlug(tag), entry);
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function collectSeries(posts: Post[]): { series: string; posts: Post[] }[] {
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    if (!post.data.series) continue;
    map.set(post.data.series, [...(map.get(post.data.series) ?? []), post]);
  }
  return [...map.entries()].map(([series, list]) => ({
    series,
    posts: list.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()),
  }));
}

// 한국어 기준 분당 약 500자
export function readingMinutes(body = ''): number {
  const text = body.replace(/```[\s\S]*?```/g, '').replace(/[#>*_`\-\[\]()!]/g, '');
  return Math.max(1, Math.round(text.length / 500));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  })
    .format(date)
    .replace(/\.\s?/g, '.')
    .replace(/\.$/, '');
}
