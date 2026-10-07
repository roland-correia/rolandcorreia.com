import { getCollection } from 'astro:content';

// Drafts show in `npm run dev` and in a PUBLIC_SHOW_DRAFTS=true preview, never on the live site.
const showDrafts = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';

/** Published posts, newest first. */
export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
