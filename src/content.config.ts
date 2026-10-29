import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from './data/categories';

// 글 하나 = 폴더 하나 (src/content/posts/<slug>/index.md + 이미지)
const posts = defineCollection({
  loader: glob({
    pattern: '**/index.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(200),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(CATEGORY_KEYS),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      heroImage: image().optional(),
      draft: z.boolean().default(false),
      originalUrl: z.url().optional(),
    }),
});

export const collections = { posts };
