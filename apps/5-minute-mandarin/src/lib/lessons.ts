import { getCollection, type CollectionEntry } from 'astro:content';
import { units, type UnitId } from './site';

export type Lesson = CollectionEntry<'lessons'>;
export type Word = Lesson['data']['words'][number];

// Drafts appear while you work (`npm run dev`) and in a preview built with
// PUBLIC_SHOW_DRAFTS=true. A normal build for the live site leaves them out.
const showDrafts = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';

// Every lesson, in course order.
export async function getLessons(): Promise<Lesson[]> {
  const all = await getCollection('lessons', ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export interface Section {
  id: UnitId;
  name: string;
  blurb: string;
  lessons: Lesson[];
}

// The lessons split into their units, leaving out any that are empty.
export function unitsOf(lessons: Lesson[]): Section[] {
  return (Object.keys(units) as UnitId[])
    .map((id) => ({ id, ...units[id], lessons: lessons.filter((l) => l.data.unit === id) }))
    .filter((section) => section.lessons.length > 0);
}

export const pathOf = (lesson: Lesson) => `/lessons/${lesson.id}/`;

// A small seeded shuffle, so the check is the same on every build (and every visit)
// but the right answer does not always sit in the same place.
function shuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const next = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 2 ** 32);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface Question {
  word: Word;
  options: string[];
  answer: number;
}

// One question per word: see the characters, pick the meaning from up to four.
// The wrong options are other meanings from the same lesson.
export function quizOf(lesson: Lesson): Question[] {
  const words = lesson.data.words;
  return shuffle(words, lesson.id).map((word) => {
    const others = shuffle(
      words.filter((w) => w !== word).map((w) => w.meaning),
      `${lesson.id}:${word.hanzi}`,
    ).slice(0, 3);
    const options = shuffle([word.meaning, ...others], `${word.hanzi}:${lesson.id}`);
    return { word, options, answer: options.indexOf(word.meaning) };
  });
}
