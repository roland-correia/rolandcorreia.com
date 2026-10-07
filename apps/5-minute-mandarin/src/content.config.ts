import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { units } from './lib/site';

// If a field below is missing or the wrong shape, `npm run build` fails and says which one.
const word = z.object({
  // The characters, in simplified Chinese: 你好
  hanzi: z.string().regex(/\p{Script=Han}/u, 'hanzi must contain Chinese characters'),
  // Pinyin with tone marks, not numbers: nǐ hǎo, not ni3 hao3
  pinyin: z.string().refine((p) => !/[1-5]/.test(p), 'Write pinyin with tone marks (ǎ), not numbers (a3)'),
  // What it means in English. Must be different from every other meaning in the lesson,
  // because the check asks the learner to pick it out from the others.
  meaning: z.string(),
  // Optional: how it is used, or a trap to avoid.
  note: z.string().optional(),
});

const lesson = z.object({
  unit: z.enum(Object.keys(units) as [keyof typeof units, ...(keyof typeof units)[]]),
  // Position across the whole course, lowest first. Lessons are taken in this order.
  order: z.number().int().positive(),
  title: z.string(),
  // One line on what the learner can do afterwards: "Say hello, thank you and goodbye."
  goal: z.string(),
  // Four to eight words. More than that will not fit in five minutes.
  words: z
    .array(word)
    .min(4)
    .max(8)
    .refine((words) => new Set(words.map((w) => w.meaning)).size === words.length, {
      message: 'Two words in this lesson have the same meaning, so the check could not tell them apart',
    }),
  // The one idea to take away, shown at the end.
  tip: z.string(),
  // New lessons start as drafts. Drafts show in `npm run dev` but are left out of the live site.
  draft: z.boolean().default(true),
});

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/lessons' }),
  schema: lesson,
});

export const collections = { lessons };
