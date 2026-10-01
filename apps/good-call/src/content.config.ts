import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categories } from './lib/site';

// A scenario cannot be built without a reason for every answer.
// If a field below is missing or the wrong shape, `npm run build` fails and says which one.
const option = z.object({
  // What the person could do.
  text: z.string(),
  // 'best' = Good call, 'okay' = Could be better, 'risky' = Not the best call.
  call: z.enum(['best', 'okay', 'risky']),
  // The feedback: why this choice helps or harms. Required for every option, not just wrong ones.
  why: z.string().min(40),
});

const scenario = z.object({
  // Which set it belongs to. Must match a live set in src/lib/site.ts.
  set: z.enum(['consent', 'administrator']),
  // The section of the set's page it sits under. Only for sets that have categories in src/lib/site.ts.
  category: z.string().optional(),
  // Position within the category (or within the set, if it has no categories), lowest first.
  order: z.number().int().positive(),
  title: z.string(),
  // The skill or theme, shown as a small label: "Touch", "Confidentiality".
  topic: z.string(),

  // What is happening. Leave a blank line between paragraphs.
  situation: z.string(),
  question: z.string().default('What is the best call?'),

  options: z
    .array(option)
    .min(3)
    .max(4)
    .refine((options) => options.filter((o) => o.call === 'best').length === 1, {
      message: 'A scenario needs exactly one option with call: best',
    }),

  // The idea to take away, shown once the best answer is found.
  principle: z.string(),

  // New scenarios start as drafts. Drafts show in `npm run dev` but are left out of the live site.
  draft: z.boolean().default(true),
});

const scenarios = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/scenarios' }),
  schema: scenario.refine(
    ({ set, category }) => {
      const allowed = categories[set];
      return allowed ? category !== undefined && category in allowed : category === undefined;
    },
    {
      path: ['category'],
      message: 'Use a category listed for this set in src/lib/site.ts, or leave it out if the set has none',
    },
  ),
});

export const collections = { scenarios };
