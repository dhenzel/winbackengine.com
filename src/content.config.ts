import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().default('David Henzel'),
    authorBio: z.string().default('Serial entrepreneur and co-founder of LTVplus, a 500+ person global customer support operation. David built Winback Engine after seeing firsthand how much revenue businesses lose from lapsed customers. His team has recovered millions in revenue for clients across fitness, wellness, beauty, and franchise businesses.'),
    authorTitle: z.string().default('Co-Founder, LTVplus & Winback Engine'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    canonical: z.string().optional(),
  }),
});

export const collections = { blog };
