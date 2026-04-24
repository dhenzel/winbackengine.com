import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import fs from 'node:fs';
import path from 'node:path';

const imageExists = (val: string | undefined) => {
  if (!val) return true;
  return fs.existsSync(path.join(process.cwd(), 'public', val));
};

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().default('David Henzel'),
    authorBio: z.string().default('Serial entrepreneur and co-founder of LTVplus, a 500+ person global customer support operation. David built Winback Engine after seeing firsthand how much revenue businesses lose from lapsed customers. His team has recovered millions in revenue for clients across fitness, wellness, beauty, and franchise businesses.'),
    authorTitle: z.string().default('Co-Founder, LTVplus & Winback Engine'),
    image: z.string().optional().refine(imageExists, (val) => ({
      message: `Hero image not found at public${val} — add the file or remove the image field`,
    })),
    tags: z.array(z.string()).default([]),
    canonical: z.string().optional(),

    slug: z.string().optional(),
    category: z.string().optional(),
    vertical: z.string().optional(),
    primary_keyword: z.string().optional(),
    secondary_keywords: z.array(z.string()).optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    pillar_page: z.string().optional(),
    cta: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    post_type: z.string().optional(),
  }),
});

export const collections = { blog };
