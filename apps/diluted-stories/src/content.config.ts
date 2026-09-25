import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A story cannot be built without a source and a "what this doesn't show" note.
// If a field below is missing or the wrong shape, `npm run build` fails and says which one.
const source = z.object({
  title: z.string(),
  authors: z.string(),
  publisher: z.string(),
  year: z.number().int(),
  url: z.url(),
  doi: z.string().optional(),
  access: z.enum(['open', 'paywalled']),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    pillar: z.enum(['tech', 'money', 'style']),

    // Card 1, "The finding": one sentence, plus the words on the video poster.
    finding: z.string().min(20).max(180),
    posterCaption: z.string().max(80),
    video: z
      .object({
        url: z.url(),
        duration: z.string().regex(/^\d+:\d{2}$/, 'Use m:ss, for example 0:58'),
      })
      .optional(),
    // Optional: about how long the source takes to read (roughly 200 words a minute).
    // Only add it once you have checked. Without it, the minutes bar is left out.
    paperMinutes: z.number().int().positive().optional(),

    // Optional line shown at the top of the story, e.g. a correction or "sample story".
    notice: z.string().optional(),

    // Card 2, "The story": the Markdown body of the file, under this heading.
    storyHeading: z.string(),

    // Card 3, "The catch": required on every story.
    caveat: z.object({ headline: z.string(), detail: z.string() }),

    // Card 4, "The source": at least one, always.
    sources: z.array(source).min(1),

    publishedAt: z.coerce.date(),
    // New stories start as drafts. Drafts show in `npm run dev` but are left out of the live site.
    draft: z.boolean().default(true),
  }),
});

export const collections = { articles };
