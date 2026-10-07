export const SITE_NAME = '5 Minute Mandarin';
export const TAGLINE = 'A little Mandarin, every day.';
export const DESCRIPTION =
  'Short Mandarin Chinese lessons for complete beginners. Learn a handful of words with characters, pinyin and sound, then check yourself. About five minutes each, no account.';

// A unit groups lessons on the home page, in the order written here.
// Every lesson must name one of these (checked in src/content.config.ts).
export const units = {
  start: { name: 'Getting started', blurb: 'The sounds of Mandarin and your first words' },
  people: { name: 'Meeting people', blurb: 'Who you are, where you are from' },
  out: { name: 'Out and about', blurb: 'Numbers, ordering and finding your way' },
} as const;

export type UnitId = keyof typeof units;
