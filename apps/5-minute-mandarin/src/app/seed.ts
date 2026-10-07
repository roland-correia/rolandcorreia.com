// Sample data, so the prototype has something to show. Every person, phone number
// and meeting here is made up. Phone numbers use the 07700 900xxx range, which
// Ofcom keeps for drama and examples, so none of them can reach a real person.
//
// Dates are worked out from today, so the calendar always has lessons on it.

import type { CreditEntry, Lesson, Message, State, User, Zoom } from './types';

export const STATE_VERSION = 2;

const users: User[] = [
  { id: 't1', name: 'Li Wei', short: 'Li Wei', role: 'tutor', initials: 'LW', phone: '07700 900100' },
  { id: 's1', name: 'Amara Okafor', short: 'Amara', role: 'student', initials: 'AO', phone: '07700 900101' },
  { id: 's2', name: 'Ben Turner', short: 'Ben', role: 'student', initials: 'BT', phone: '07700 900102' },
  { id: 's3', name: 'Chloe Martin', short: 'Chloe', role: 'student', initials: 'CM', phone: '07700 900103' },
  { id: 's4', name: 'Daniel Kim', short: 'Daniel', role: 'student', initials: 'DK', phone: '07700 900104' },
  { id: 's5', name: 'Ellie Shah', short: 'Ellie', role: 'student', initials: 'ES', phone: '07700 900105' },
  { id: 's6', name: 'Femi Adebayo', short: 'Femi', role: 'student', initials: 'FA', phone: '07700 900106' },
];

// A small seeded random, so the sample meeting IDs look varied but stay the same.
function seeded(seed: number) {
  return () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 2 ** 32);
}
const random = seeded(5);

export function makeZoom(rand: () => number = Math.random): Zoom {
  const digits = Array.from({ length: 11 }, (_, i) => (i === 0 ? 8 : Math.floor(rand() * 10))).join('');
  const passcode = Array.from({ length: 6 }, () => 'abcdefghjkmnpqrstuvwxyz23456789'[Math.floor(rand() * 31)]).join('');
  return { meetingId: `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`, passcode };
}

// Today at hh:mm, moved by `days`.
function at(days: number, hh: number, mm = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
}

function ago(days: number, hh: number, mm = 0) {
  return at(-days, hh, mm);
}

function lessons(): Lesson[] {
  const out: Lesson[] = [];
  const today = new Date();
  const dow = today.getDay(); // 0 = Sunday
  let n = 0;
  const add = (lesson: Omit<Lesson, 'id' | 'tutorId' | 'status' | 'zoom' | 'materials'> & Partial<Lesson>) =>
    out.push({ id: `l${++n}`, tutorId: 't1', status: 'booked', zoom: makeZoom(random), materials: [], ...lesson });

  // Three weeks back to four weeks ahead.
  for (let day = -14; day <= 28; day++) {
    const weekday = (dow + day + 7 * 10) % 7;
    if (weekday === 2 || weekday === 4) {
      add({ kind: 'group', groupId: 'g1', title: 'Beginners (HSK 1)', start: at(day, 18), minutes: 60 });
    }
    if (weekday === 3) {
      add({ kind: 'group', groupId: 'g2', title: 'Intermediate (HSK 3)', start: at(day, 19), minutes: 60 });
    }
    if (weekday === 1) {
      add({ kind: 'one-to-one', studentId: 's1', title: 'One-to-one', start: at(day, 17), minutes: 45 });
      add({ kind: 'one-to-one', studentId: 's5', title: 'One-to-one', start: at(day, 19, 30), minutes: 45 });
    }
    if (weekday === 5) {
      add({ kind: 'one-to-one', studentId: 's3', title: 'One-to-one', start: at(day, 12), minutes: 45 });
    }
    if (weekday === 6 && day % 2 === 0) {
      add({ kind: 'one-to-one', studentId: 's2', title: 'One-to-one', start: at(day, 10), minutes: 30 });
    }
  }

  // Materials on the most recent past lessons, and one cancelled lesson coming up.
  const past = out.filter((l) => new Date(l.start) < today);
  const lastGroup = past.filter((l) => l.groupId === 'g1').pop();
  if (lastGroup) lastGroup.materials = [{ id: 'm1', name: 'Week 2: the four tones.pdf' }, { id: 'm2', name: 'Greetings practice.pptx' }];
  const lastAmara = past.filter((l) => l.studentId === 's1').pop();
  if (lastAmara) lastAmara.materials = [{ id: 'm3', name: 'Amara: introducing yourself.pptx' }];
  const nextBen = out.find((l) => l.studentId === 's2' && new Date(l.start) > today);
  if (nextBen) nextBen.status = 'cancelled';

  return out;
}

// Credits: one credit books one lesson, group or one-to-one. Each student bought
// packs of 10, and has spent one for every lesson they are booked on.
function credits(all: Lesson[], groups: Record<string, string[]>): CreditEntry[] {
  const out: CreditEntry[] = [];
  let n = 0;
  for (const user of users.filter((u) => u.role === 'student')) {
    const theirs = all.filter((l) => l.studentId === user.id || (l.groupId && groups[l.groupId].includes(user.id)));
    const leftover = 2 + (Number(user.id.slice(1)) % 4);
    for (let bought = 0, pack = 0; bought < theirs.length + leftover; bought += 10, pack++) {
      out.push({ id: `c${++n}`, studentId: user.id, change: 10, reason: 'Bought 10 credits', at: ago(30 - pack * 7, 9) });
    }
    for (const lesson of theirs) {
      out.push({ id: `c${++n}`, studentId: user.id, change: -1, reason: `Booked: ${lesson.title}`, at: ago(21, 9) });
      if (lesson.status === 'cancelled') {
        out.push({ id: `c${++n}`, studentId: user.id, change: 1, reason: `Returned: ${lesson.title} was cancelled by your tutor`, at: ago(1, 10) });
      }
    }
  }
  return out;
}

const groups = { g1: ['t1', 's1', 's2', 's3', 's4'], g2: ['t1', 's3', 's5', 's6'] };

function messages(): Message[] {
  let n = 0;
  const m = (conversationId: string, authorId: string, when: string, text: string, replyTo?: string): Message => ({
    id: `msg${++n}`,
    conversationId,
    authorId,
    at: when,
    text,
    replyTo,
  });

  return [
    m('g1', 't1', ago(6, 9), '大家好！Welcome to the Beginners group. Post here any time, in Chinese or English.'),
    m('g1', 's1', ago(6, 9, 20), '你好！我叫 Amara。'),
    m('g1', 's2', ago(6, 10), '你好 Amara！我叫 Ben 😊'),
    m('g1', 't1', ago(6, 10, 15), '很好！Remember that 你好 is said ní hǎo, with the first word rising.', 'msg3'),
    m('g1', 's3', ago(2, 18, 40), 'Could someone practise 你好吗 with me before Thursday?'),
    m('g1', 's4', ago(2, 19), '我很好，你呢？', 'msg5'),

    m('g2', 't1', ago(5, 8, 30), "This week's topic: where you live. Send a voice note saying where you live, in Chinese."),
    m('g2', 's5', ago(5, 12), '我住在伦敦。'),
    m('g2', 's6', ago(4, 20), '老师，住 和 在 有什么不同？'),
    m('g2', 't1', ago(4, 20, 30), '住 (zhù) means "to live" and 在 (zài) means "at". 我住在伦敦 uses both: "I live in London".', 'msg9'),

    m('d1', 't1', ago(3, 17, 50), "Hi Amara, I've added the slides from today's lesson to the lesson card."),
    m('d1', 's1', ago(3, 18), '谢谢老师！'),
    m('d3', 's3', ago(1, 11), 'Hi Li Wei, could we move Friday to 1pm this week?'),
    m('d3', 't1', ago(1, 11, 30), 'Of course. You will get a text once it is moved.', 'msg13'),
  ];
}

export function seed(): State {
  const all = lessons();
  const direct = users
    .filter((u) => u.role === 'student')
    .map((u) => ({ id: `d${u.id.slice(1)}`, kind: 'direct' as const, name: u.name, tutorId: 't1', memberIds: ['t1', u.id] }));

  return {
    version: STATE_VERSION,
    sessionUserId: null,
    zoomConnected: false,
    users,
    lessons: all,
    conversations: [
      { id: 'g1', kind: 'group', name: 'Beginners', level: 'HSK 1', tutorId: 't1', memberIds: groups.g1 },
      { id: 'g2', kind: 'group', name: 'Intermediate', level: 'HSK 3', tutorId: 't1', memberIds: groups.g2 },
      ...direct,
    ],
    messages: messages(),
    requests: [{ id: 'r1', groupId: 'g1', studentId: 's6', requestedBy: 's2', at: ago(1, 15) }],
    credits: credits(all, groups),
    texts: [],
  };
}
