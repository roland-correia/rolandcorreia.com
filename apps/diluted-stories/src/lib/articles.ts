import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

// Drafts appear while you work (`npm run dev`) and in a preview built with
// PUBLIC_SHOW_DRAFTS=true. A normal build for the live site leaves them out.
const showDrafts = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';

export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

const WORDS_PER_MINUTE = 200;

// Reading time is measured from the words on the page, never typed by hand,
// so the "this page vs the paper" comparison stays honest.
export function readMinutes(article: Article): number {
  const { finding, caveat } = article.data;
  const text = `${finding} ${caveat.headline} ${caveat.detail} ${article.body ?? ''}`;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
