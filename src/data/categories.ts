// 카테고리는 여기서만 정의한다. 글 frontmatter의 category 값은
// '상위' 또는 '상위/하위' 형식이어야 하며, 빌드 시 이 목록으로 검증된다.
export interface CategoryNode {
  name: string;
  slug: string;
  emoji?: string;
  children?: CategoryNode[];
}

export const CATEGORY_TREE: CategoryNode[] = [
  {
    name: 'CS',
    slug: 'cs',
    emoji: '🖥️',
    children: [
      { name: 'Algorithm', slug: 'algorithm' },
      { name: 'Network', slug: 'network' },
      { name: 'Database', slug: 'database' },
      { name: 'OS', slug: 'os' },
      { name: 'ETC', slug: 'etc' },
    ],
  },
  {
    name: 'Language',
    slug: 'language',
    emoji: '🔤',
    children: [
      { name: 'Java', slug: 'java' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Golang', slug: 'golang' },
      { name: 'Python', slug: 'python' },
    ],
  },
  {
    name: 'Framework',
    slug: 'framework',
    emoji: '🏛️',
    children: [
      { name: 'Spring', slug: 'spring' },
      { name: 'NestJS', slug: 'nestjs' },
      { name: 'Django', slug: 'django' },
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'Wails', slug: 'wails' },
    ],
  },
  {
    name: 'Dev',
    slug: 'dev',
    emoji: '💾',
    children: [
      { name: 'DevOps', slug: 'devops' },
      { name: 'Kubernetes', slug: 'kubernetes' },
      { name: 'Linux', slug: 'linux' },
      { name: 'Git', slug: 'git' },
      { name: 'LLM', slug: 'llm' },
      { name: 'Redis', slug: 'redis' },
      { name: 'ELK', slug: 'elk' },
      { name: 'MQ', slug: 'mq' },
      { name: 'AWS', slug: 'aws' },
      { name: 'Trouble-Shooting', slug: 'trouble-shooting' },
      { name: 'TIL', slug: 'til' },
      { name: 'Team-Project', slug: 'team-project' },
      { name: 'ETC', slug: 'etc' },
    ],
  },
];

export interface CategoryInfo {
  key: string; // frontmatter 값: 'Dev/Kubernetes'
  name: string; // 표시 이름: 'Kubernetes'
  path: string; // URL 경로: 'dev/kubernetes'
  emoji?: string;
  parent?: string; // 상위 key
}

export const CATEGORIES: CategoryInfo[] = CATEGORY_TREE.flatMap((top) => [
  { key: top.name, name: top.name, path: top.slug, emoji: top.emoji },
  ...(top.children ?? []).map((child) => ({
    key: `${top.name}/${child.name}`,
    name: child.name,
    path: `${top.slug}/${child.slug}`,
    parent: top.name,
  })),
]);

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key) as [string, ...string[]];

export function getCategory(key: string): CategoryInfo {
  const found = CATEGORIES.find((c) => c.key === key);
  if (!found) throw new Error(`Unknown category: ${key}`);
  return found;
}
