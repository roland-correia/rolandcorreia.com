export const SITE_NAME = 'Good Call';
export const TAGLINE = 'Practise the call before it counts.';
export const DESCRIPTION =
  'Short, realistic scenarios on consent, racism, parenting and judgement at work. Choose what you would do, then see why each choice helps or harms. No timer and no account.';

// Where sets are listed. 'everyday' sets sit on the home page itself; the others
// each have their own page, reached from a tile on the home page.
export const groups = {
  everyday: { name: 'Everyday life', path: '/' },
  parenting: { name: 'Parenting', path: '/parenting/' },
  work: { name: 'At work', path: '/work/' },
} as const;

export type GroupId = keyof typeof groups;

// A "set" is a group of scenarios. `group` decides where it is listed (see `groups`).
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
  'parent-newborn': {
    name: 'Newborns: 0 to 3 months',
    group: 'parenting',
    blurb: 'Crying, sleep, fevers, feeding and how you are feeling',
    intro:
      'The first weeks are the steepest learning curve most people ever face, on the least sleep. These scenarios cover the moments that frighten new parents most, and what keeps a newborn safe.',
    note: "General guidance, not medical advice. If you are worried about your child's health, call NHS 111. In an emergency, call 999.",
    rules: [
      'Crying is normal, and it can be overwhelming. It is always OK to put your baby down safely and step away for a few minutes.',
      'Never shake a baby, however frustrated you feel.',
      'Every sleep, day and night: on their back, in their own clear cot. Never fall asleep with them on a sofa or armchair.',
      'Under 3 months, a temperature of 38C or higher needs advice the same day. Call NHS 111.',
      'A fed baby is the goal. How you feed is your decision.',
      'Feeling low for more than two weeks is a reason to talk to your GP or health visitor, for either parent.',
    ],
    live: true,
  },
  'parent-baby': {
    name: 'Babies: 3 to 12 months',
    group: 'parenting',
    blurb: 'Weaning, falls, car seats, childcare and attention',
    intro:
      'Babies start moving, eating and noticing everything. Most of what goes wrong at this age is an accident that a small habit would have prevented, and most of what goes right is ordinary time together.',
    note: "General guidance, not medical advice. If you are worried about your child's health, call NHS 111. In an emergency, call 999.",
    rules: [
      'Cut small round foods, such as grapes and cherry tomatoes, into quarters. Never leave a baby alone while eating.',
      'Babies roll and fall sooner than you expect. Change them on the floor, or keep a hand on them.',
      'Every journey, however short, in a properly fitted car seat.',
      'Talking, singing and back-and-forth babble build their brain more than any toy or app.',
      'Short, warm goodbyes at childcare. Sneaking out makes the next drop-off harder.',
    ],
    live: true,
  },
  'parent-toddler': {
    name: 'Toddlers: 1 to 3 years',
    group: 'parenting',
    blurb: 'Tantrums, biting, potty training, safety at home and a new sibling',
    intro:
      'Toddlers have big feelings and very little control over them. Tantrums are not bad behaviour or bad parenting. They are a brain that is still being built. These scenarios are about staying calm and safe while it happens.',
    note: "General guidance, not medical advice. If you are worried about your child's health, call NHS 111. In an emergency, call 999.",
    rules: [
      'A tantrum is a feeling too big to handle, not a plan. Stay calm, keep them safe, and wait it out.',
      'Name the feeling, hold the limit. "You are cross that we are leaving. We are still leaving."',
      'Physical punishment is illegal in Scotland and Wales, and it does not teach what you want it to.',
      'Children are ready for the potty when they are ready, not by a date.',
      'Button batteries, medicines and hot drinks: up high and out of reach. A swallowed button battery means A&E straight away.',
    ],
    live: true,
  },
  'parent-preschool': {
    name: 'Pre-schoolers: 3 to 5 years',
    group: 'parenting',
    blurb: 'Questions, fibs, body safety, screens, starting school and loss',
    intro:
      'Pre-schoolers ask everything, out loud, in public. How you answer now teaches them which subjects are safe to bring to you, which matters far more later on.',
    note: 'General guidance, not professional advice. If you are worried about your child, talk to your GP or health visitor.',
    rules: [
      'Answer questions simply and truthfully, at their level. "I don\'t know, let\'s find out" is a good answer.',
      'Teach the correct names for private parts, and that their body belongs to them.',
      'Warn before screen time ends, and keep screens out of the hour before bed.',
      'Use clear words about death. "Died", not "gone to sleep" or "lost".',
      'A fib at four is a sign of a growing imagination, not a moral failing.',
    ],
    live: true,
  },
  'parent-school': {
    name: 'Primary school: 5 to 11 years',
    group: 'parenting',
    blurb: 'Friendships, bullying, learning, online safety and puberty',
    intro:
      'At school age, much of your child\'s life happens out of your sight. Your job shifts towards being the person they tell. These scenarios are about listening first and acting well.',
    note: 'General guidance, not professional advice. If you are worried about your child\'s safety or development, talk to their school or your GP.',
    rules: [
      'Listen to the whole story before you react. A calm reaction is what makes them tell you next time.',
      'Work with the school, in writing if needed. Most problems are solved faster together.',
      'If your child may be struggling to learn, ask for a meeting with the school\'s SENCo.',
      'Online, the rule is "tell me, and you will not be in trouble". Report adults who ask for photos or secrets to CEOP.',
      'Talk about puberty before it starts. For some children that is eight or nine.',
    ],
    live: true,
  },
  'parent-teen': {
    name: 'Teenagers: 11 to 18 years',
    group: 'parenting',
    blurb: 'Parties, privacy, mental health, identity and school pressure',
    intro:
      'Teenagers need more independence and more support at the same time. The connection you keep through the hard conversations is what keeps them safe when you are not there.',
    note: 'General guidance, not professional advice. If your teenager is at risk of harm, call 999. For worries about their mental health, talk to your GP.',
    rules: [
      'Stay the person they can call. "Ring me, any time, and I will come. No lecture tonight."',
      'Ask more than you tell. Curious questions get honest answers. Interrogations do not.',
      'Respect their privacy, unless their safety is at real risk. Then tell them what you are doing and why.',
      'Self-harm needs a calm response, not panic or punishment. Talk to your GP.',
      'Who they are is not a phase to be argued out of. Listen first.',
    ],
    live: true,
  },
  'parent-adoption': {
    name: 'Adoption, fostering and kinship care',
    group: 'parenting',
    blurb: 'For any age: their story, birth family, trauma and belonging',
    intro:
      'Children who join a family through adoption, fostering or kinship care have the same needs as any child, and some extra ones. Many have lived through loss or trauma before they reached you. These scenarios are about honesty, patience and belonging.',
    note: 'General guidance, not professional advice. Your adoption agency, fostering service or local authority can offer support, and many families are entitled to it.',
    rules: [
      'Tell children their story early, truthfully and often. It should never be a secret they discover.',
      'Behaviour that comes from early trauma needs understanding and support, not only consequences.',
      'You are their real parent or carer, and their birth family is real too. They do not have to choose.',
      'Never speak badly of their birth parents in front of them.',
      'Ask for support early. Post-adoption and kinship support exists for exactly this.',
    ],
    live: true,
  },
  'parent-you': {
    name: 'Looking after yourself',
    group: 'parenting',
    blurb: 'For any age: help, rows, co-parenting, mistakes and comparison',
    intro:
      'Children do best when the adults looking after them are coping. These scenarios are about you: asking for help, repairing after a bad moment, and parenting alongside someone else, or on your own.',
    note: 'General guidance, not professional advice. If you are struggling to cope, talk to your GP, or call Samaritans on 116 123 at any time.',
    rules: [
      'Accepting help is part of parenting well, not a sign that you are failing.',
      'Every parent loses their temper sometimes. What matters is the repair: say sorry, and explain.',
      'Keep adult arguments away from children, and never make them choose between parents.',
      'Other parents\' photos are their best moments, not their whole day.',
      'Share the thinking as well as the doing: the appointments, the forms and the planning are work too.',
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
