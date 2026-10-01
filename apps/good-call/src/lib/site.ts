export const SITE_NAME = 'Good Call';
export const TAGLINE = 'Practise the call before it counts.';
export const DESCRIPTION =
  'Short, realistic scenarios on consent and on judgement at work. Choose what you would do, then see why each choice helps or harms. No timer and no account.';

// A "set" is a group of scenarios. `group` decides where it is listed:
// 'everyday' sets sit on the home page, 'work' sets are the roles on /work/.
// `live: false` shows as "coming later" and has no page yet.
export const sets = {
  consent: {
    name: 'Consent',
    group: 'everyday',
    blurb: 'Touch, photos, privacy, staying over, pressure and changing your mind',
    intro:
      'Consent is for everyone. Anyone can misread a moment, and anyone can have their own boundary ignored. These scenarios put you on both sides.',
    note: 'Some scenarios are about dating, sex and alcohol. Nothing is described in detail. Written for adults.',
    rules: [
      'Consent is a free choice. A yes given under pressure, fear or obligation is not one.',
      'It is specific. Yes to one thing, one time, with one person is not yes to anything else.',
      'It can be taken back at any point, with or without words.',
      'The person has to be able to choose. Very drunk, asleep or afraid is not able.',
      'If you are not sure, ask. Asking is not awkward. Guessing wrong is.',
    ],
    live: true,
  },
  administrator: {
    name: 'Administrator',
    group: 'work',
    blurb: 'Confidentiality, priorities, mistakes and unclear instructions',
    intro:
      'Practice for the situational judgement questions used in admin and office job applications. Real tests rarely explain what they are looking for. This one does.',
    note: 'Practice only. Every employer scores these tests in its own way, so use the reasons here as a guide, not a mark scheme.',
    rules: [
      'Tell people early. A problem shared at 10am is easier to fix than one found at 5pm.',
      "Keep private information private, even when the person asking sounds genuine or senior.",
      'Own a mistake quickly and say what you have done about it.',
      'When an instruction is unclear, ask a specific question before you start.',
      'Stay calm with upset people. Listen first, then say what you can do.',
    ],
    live: true,
  },
  'customer-service': { name: 'Customer service', group: 'work', blurb: 'Coming later', live: false },
  'care-support': { name: 'Care and support', group: 'work', blurb: 'Coming later', live: false },
  'team-leader': { name: 'Team leader', group: 'work', blurb: 'Coming later', live: false },
} as const;

export type SetId = keyof typeof sets;

// Categories split a long set into sections on its page, in the order written here.
// A set with no entry is shown as one list. Every scenario in a set that has
// categories must name one of them (checked in src/content.config.ts).
export const categories: Partial<Record<SetId, Record<string, { name: string; blurb: string }>>> = {
  consent: {
    touch: { name: 'Everyday touch', blurb: 'Hugs, play, offering help and children' },
    privacy: { name: 'Privacy, photos and messages', blurb: 'What is yours to see, share or send' },
    pressure: { name: 'Pressure and power', blurb: 'When saying no is made hard' },
    nights: { name: 'Nights out and staying over', blurb: 'Alcohol, parties and sleepovers' },
    intimacy: { name: 'Sex and intimacy', blurb: 'Checking in, sleep, conditions and changing your mind' },
  },
};

// How an answer is judged. Real situations are rarely just right or wrong,
// so there is a middle step, and every answer comes with its reason.
// The mark is shown next to the label so the verdict never depends on colour alone.
export const calls = {
  best: { label: 'Good call', mark: '✓' },
  okay: { label: 'Could be better', mark: '~' },
  risky: { label: 'Not the best call', mark: '!' },
} as const;

export type Call = keyof typeof calls;
