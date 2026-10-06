export const SITE_NAME = 'Diluted Stories';
export const TAGLINE = 'Research, diluted.';
export const DESCRIPTION =
  'Short videos and one-page stories on tech and money research. Every story shows the finding, the catch and the source.';

// The topics ("pillars"). `live: false` shows as "coming later" and has no page yet.
export const pillars = {
  tech: { name: 'Tech', blurb: 'Devices, software and the rules around them', live: true },
  money: { name: 'Money', blurb: 'Spending, saving and risk', live: true },
  style: { name: 'Style', blurb: 'Coming later', live: false },
} as const;

export type Pillar = keyof typeof pillars;
