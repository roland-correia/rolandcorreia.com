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
    blurb: 'Touch, texting, photos, privacy, parties, pressure and changing your mind',
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
  racism: {
    name: 'Racism',
    group: 'everyday',
    blurb: 'Remarks, jokes, skin colour, and what to do when you see it',
    intro:
      'Racism is not only shouting in the street. It is also the joke in the group chat, the comment about skin tone and the CV put to one side. These scenarios put you in three positions: the person who sees it, the person who did it, and the person it happens to.',
    note: 'Describes racist remarks and behaviour, online and in person. No slurs are repeated. Written for adults.',
    rules: [
      'Impact matters more than intent. "I didn\'t mean it" does not undo how it landed.',
      'Silence looks like agreement. You do not need a speech. "That\'s not OK" is enough.',
      'Look after the person targeted first. Standing with them matters more than winning an argument.',
      'No skin tone is better than another. Praise for being lighter is the same prejudice as an insult for being darker.',
      'If you get it wrong, listen, apologise without excuses and change it. Being corrected is not an attack.',
      'Racist abuse and threats can be crimes, online as well as in person, and can be reported.',
    ],
    live: true,
  },
  'adult-content': {
    name: 'Porn and real life',
    group: 'everyday',
    blurb: 'Children seeing it early, habits, expectations and relationships',
    intro:
      'Most people will see porn, and many see it before they are ready. These scenarios are about what it can do to expectations, habits and relationships, and what helps.',
    note: 'About pornography, including children coming across it. Nothing is described in detail. Written for adults.',
    rules: [
      'Porn is a performance made to be watched. It is not a guide to sex, bodies or what people enjoy.',
      'Children often see it by accident or are shown it. A calm conversation protects them more than a punishment does.',
      'Something you saw on a screen is not something your partner has agreed to. Ask first, and not in the moment.',
      'If a habit is costing you sleep, focus or closeness, that is worth acting on. Shame makes it harder to change, not easier.',
      'The people on screen have to have agreed too. If it looks secret, leaked or underage, do not watch it or share it. Report it.',
    ],
    live: true,
  },
  interview: {
    name: 'Interview questions',
    group: 'work',
    blurb: 'For any role: the common questions, and what they are really asking',
    intro:
      'Interview questions often mean more than they say. Each of these gives you a common question and four ways to answer it, then explains what the interviewer is listening for.',
    note: 'Practice only. Interviewers differ, so use the reasons as a guide and put the answers in your own words, with your own examples.',
    rules: [
      'Most questions are asking one thing: can we rely on you to do this job alongside other people?',
      'For "tell me about a time" questions, give one real example: what the situation was, what you did, and how it turned out.',
      'Say "I", not "we". They are hiring you, not your old team.',
      'It is fine to pause, to ask for the question again, or to look at your notes. Taking a moment looks thoughtful.',
      'Be honest. A small true example beats a grand vague one, and a real weakness you are working on beats a fake one.',
      'You can ask for adjustments before the day, such as the questions in writing or extra time.',
    ],
    live: true,
  },
  administrator: {
    name: 'Administrator',
    group: 'work',
    blurb: 'Confidentiality, priorities, people and asking for what you need',
    intro:
      'Practice for the situational judgement questions used in admin and office job applications. Real tests rarely explain what they are looking for. This one does.',
    note: 'Practice only. Every employer scores these tests in its own way, so use the reasons here as a guide, not a mark scheme.',
    rules: [
      'Tell people early. A problem shared at 10am is easier to fix than one found at 5pm.',
      "Keep private information private, even when the person asking sounds genuine or senior.",
      'Own a mistake quickly and say what you have done about it.',
      'When an instruction is unclear, ask a specific question before you start.',
      'Stay calm with upset people. Listen first, then say what you can do.',
      'Ask for help, training or adjustments when you need them. Struggling in silence helps nobody.',
    ],
    live: true,
  },
  'customer-service': {
    name: 'Customer service',
    group: 'work',
    blurb: 'Complaints, policies, queues and not knowing the answer',
    intro:
      'Practice for the situational judgement questions used in retail, call centre and front-of-house job applications. Each answer comes with the reason an employer would give.',
    note: 'Practice only. Every employer has its own policies, so use the reasons here as a guide, not a mark scheme.',
    rules: [
      'Listen before you fix. An upset customer who feels heard is halfway to calm.',
      'Say what you can do, not only what you cannot.',
      'Never guess. "I will find out" is a better answer than a wrong one.',
      'Policies exist for fairness. If an exception is needed, ask someone who is allowed to make it.',
      'You do not have to accept abuse. Know when, and how, to hand over or end the conversation.',
    ],
    live: true,
  },
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
    texting: { name: 'Texting and crushes', blurb: 'Asking, waiting, mixed signals and friends for now' },
    pressure: { name: 'Pressure and power', blurb: 'When saying no is made hard' },
    nights: { name: 'Parties, clubs and nights out', blurb: 'Dancing, drinks, crowds, sleepovers and looking out for people' },
    intimacy: { name: 'Sex and intimacy', blurb: 'Checking in, sleep, conditions and changing your mind' },
  },
  interview: {
    opening: { name: 'About you', blurb: 'The questions most interviews start with' },
    examples: { name: 'Tell me about a time', blurb: 'Questions that want a real example' },
    tricky: { name: 'Tricky moments', blurb: 'Blanks, gaps, adjustments and your own questions' },
  },
  administrator: {
    trust: { name: 'Trust and confidentiality', blurb: 'Private information, security and honesty' },
    priorities: { name: 'Priorities and instructions', blurb: 'Deadlines, clashes and unclear requests' },
    people: { name: 'Working with people', blurb: 'Upset visitors, gossip and feedback' },
    asking: { name: 'Asking for what you need', blurb: 'Help, workload and adjustments' },
  },
  racism: {
    online: { name: 'Social media and group chats', blurb: 'Memes, comments, old posts and abuse in your inbox' },
    everyday: { name: 'Out and about', blurb: 'What you see, and what you say, in public' },
    family: { name: 'Family and home', blurb: 'Relatives, children and comments about skin colour' },
    work: { name: 'At work', blurb: 'Customers, colleagues, names and who gets a chance' },
  },
  'adult-content': {
    children: { name: 'Children and teenagers', blurb: 'First phones, what they see, and what to say' },
    yourself: { name: 'Your own viewing', blurb: 'Habits, expectations, where it comes from and who agreed to it' },
    relationships: { name: 'Relationships', blurb: 'What the screen brings into a relationship' },
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
