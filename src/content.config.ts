import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const coverMode = z.enum([
  'hero-large',
  'hero-small',
  'showcase',
  'strip',
  'none',
]);

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      pinned: z.boolean().default(false),
      comments: z.boolean().default(false),
      language: z.enum(['en', 'zh']).default('en'),
      i18n_alt: z.string().optional(),
      image: z.string().optional(),
      image_alt: z.string().optional(),
      image_role: z.enum(['mood', 'semantic', 'decorative']).default('mood'),
      image_focus: z.string().default('50% 50%'),
      image_credit: z.string().optional(),
      cover_mode: coverMode.optional(),
    })
    .strict(),
});

const publicThread = z
  .object({
    summary: z.string(),
    bullets: z.array(z.string()).max(4).default([]),
  })
  .strict();

const worklogs = defineCollection({
  loader: glob({ base: './src/content/worklogs', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      description: z.string().optional(),
      public_thread: publicThread.optional(),
    })
    .strict(),
});

export const collections = { posts, worklogs };
