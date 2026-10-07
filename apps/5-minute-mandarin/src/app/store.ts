// The app's state and every action that changes it.
//
// This is a prototype: the state is kept in this browser's localStorage and starts
// from the sample data in seed.ts. Each action below is where a call to a real
// backend will go (sign-in, payments, Zoom, text messages), so the screens do not
// need to change when it arrives.

import { useEffect, useState } from 'preact/hooks';
import { seed, makeZoom, STATE_VERSION } from './seed';
import type { Conversation, Lesson, Message, State, User } from './types';

const KEY = 'fmm-app';

let state: State = load();
const listeners = new Set<() => void>();

function load(): State {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as State | null;
    if (saved && saved.version === STATE_VERSION) return saved;
  } catch {
    // Unreadable or blocked storage: start from the sample data.
  }
  return seed();
}

function save() {
  try {
    // Photos, voice notes and files are object URLs that only last for this visit, so they are not saved.
    const lasting = {
      ...state,
      messages: state.messages.map((m) => (m.media?.url?.startsWith('blob:') ? { ...m, media: { ...m.media, url: undefined } } : m)),
      lessons: state.lessons.map((l) => ({ ...l, materials: l.materials.map(({ url, ...rest }) => rest) })),
    };
    localStorage.setItem(KEY, JSON.stringify(lasting));
  } catch {
    // Private browsing can block storage. The app still works for this visit.
  }
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  save();
  listeners.forEach((listener) => listener());
}

export function getState() {
  return state;
}

// Re-renders a component whenever the state changes.
export function useStore(): State {
  const [, force] = useState(0);
  useEffect(() => {
    const listener = () => force((n) => n + 1);
    listeners.add(listener);
    return () => void listeners.delete(listener);
  }, []);
  return state;
}

const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ---------------------------------------------------------------------------
// Looking things up
// ---------------------------------------------------------------------------

export const userById = (s: State, userId: string) => s.users.find((u) => u.id === userId);
export const currentUser = (s: State): User | undefined => (s.sessionUserId ? userById(s, s.sessionUserId) : undefined);

export function balanceOf(s: State, studentId: string): number {
  return s.credits.filter((c) => c.studentId === studentId).reduce((sum, c) => sum + c.change, 0);
}

/** Everyone booked on a lesson: the one student, or every student in the group. */
export function studentsOf(s: State, lesson: Lesson): string[] {
  if (lesson.studentId) return [lesson.studentId];
  const group = s.conversations.find((c) => c.id === lesson.groupId);
  return group ? group.memberIds.filter((m) => userById(s, m)?.role === 'student') : [];
}

/** The lessons a person teaches or is booked on, in time order. */
export function lessonsFor(s: State, user: User): Lesson[] {
  return s.lessons
    .filter((l) => (user.role === 'tutor' ? l.tutorId === user.id : studentsOf(s, l).includes(user.id)))
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function conversationsFor(s: State, user: User): Conversation[] {
  return s.conversations.filter((c) => c.memberIds.includes(user.id));
}

/** The one-to-one chat between a tutor and a student. */
export function directChat(s: State, tutorId: string, studentId: string) {
  return s.conversations.find((c) => c.kind === 'direct' && c.memberIds.includes(tutorId) && c.memberIds.includes(studentId));
}

// ---------------------------------------------------------------------------
// Signing in. Real sign-in (Google, Microsoft, Apple) needs a backend.
// ---------------------------------------------------------------------------

export function signIn(userId: string) {
  set({ sessionUserId: userId });
}

export function signOut() {
  set({ sessionUserId: null });
}

export function resetDemo() {
  state = seed();
  save();
  listeners.forEach((listener) => listener());
}

// ---------------------------------------------------------------------------
// Text messages. Until texts are connected, each one is kept here and shown on screen.
// ---------------------------------------------------------------------------

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function text(to: string[], body: (user: User) => string) {
  const texts = to
    .map((userId) => userById(state, userId))
    .filter((u): u is User => Boolean(u?.phone))
    .map((u) => ({ id: id(), to: u.id, body: body(u), at: now() }));
  return texts;
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

/**
 * The tutor cancels a lesson. Every booked student gets their credit back and a text.
 * Returns how many students were texted.
 */
export function cancelLesson(lessonId: string): number {
  const lesson = state.lessons.find((l) => l.id === lessonId);
  if (!lesson || lesson.status === 'cancelled') return 0;
  const tutor = userById(state, lesson.tutorId)!;
  const students = studentsOf(state, lesson);

  const texts = text(
    students,
    (u) =>
      `5 Minute Mandarin: Hi ${u.short}, ${tutor.name} has cancelled your ${lesson.title.toLowerCase()} lesson on ${when(lesson.start)}. 1 credit has been returned to your balance.`,
  );
  set({
    lessons: state.lessons.map((l) => (l.id === lessonId ? { ...l, status: 'cancelled' } : l)),
    credits: [
      ...state.credits,
      ...students.map((studentId) => ({
        id: id(),
        studentId,
        change: 1,
        reason: `Returned: ${lesson.title} on ${when(lesson.start)} was cancelled by your tutor`,
        at: now(),
      })),
    ],
    texts: [...state.texts, ...texts],
  });
  return texts.length;
}

/** The tutor moves a lesson. Everyone booked gets a text with the new time. Returns how many. */
export function rescheduleLesson(lessonId: string, start: string): number {
  const lesson = state.lessons.find((l) => l.id === lessonId);
  if (!lesson) return 0;
  const texts = text(
    studentsOf(state, lesson),
    (u) =>
      `5 Minute Mandarin: Hi ${u.short}, your ${lesson.title.toLowerCase()} lesson has moved from ${when(lesson.start)} to ${when(start)}. The Zoom meeting ID is the same: ${lesson.zoom.meetingId}.`,
  );
  set({
    lessons: state.lessons.map((l) => (l.id === lessonId ? { ...l, start, rescheduled: true } : l)),
    texts: [...state.texts, ...texts],
  });
  return texts.length;
}

/** The tutor adds a presentation or file to a lesson, for everyone booked on it to open. */
export function addMaterial(lessonId: string, file: File) {
  set({
    lessons: state.lessons.map((l) =>
      l.id === lessonId ? { ...l, materials: [...l.materials, { id: id(), name: file.name, url: URL.createObjectURL(file) }] } : l,
    ),
  });
}

/** A student books a one-to-one lesson for one credit. Returns false if they have none. */
export function bookLesson(studentId: string, tutorId: string, start: string): boolean {
  if (balanceOf(state, studentId) < 1) return false;
  const lesson: Lesson = {
    id: id(),
    kind: 'one-to-one',
    tutorId,
    studentId,
    title: 'One-to-one',
    start,
    minutes: 45,
    status: 'booked',
    zoom: makeZoom(),
    materials: [],
  };
  set({
    lessons: [...state.lessons, lesson],
    credits: [...state.credits, { id: id(), studentId, change: -1, reason: `Booked: One-to-one on ${when(start)}`, at: now() }],
  });
  return true;
}

/** Times in the next fortnight when the tutor has nothing booked. */
export function freeSlots(tutorId: string): string[] {
  const taken = state.lessons.filter((l) => l.tutorId === tutorId && l.status === 'booked').map((l) => l.start);
  const slots: string[] = [];
  for (let day = 1; day <= 14 && slots.length < 8; day++) {
    for (const hour of [10, 14, 16]) {
      const d = new Date();
      d.setDate(d.getDate() + day);
      d.setHours(hour, 0, 0, 0);
      if (d.getDay() === 0) continue;
      const iso = d.toISOString();
      if (!taken.some((t) => Math.abs(new Date(t).getTime() - d.getTime()) < 60 * 60 * 1000)) slots.push(iso);
    }
  }
  return slots.slice(0, 8);
}

// ---------------------------------------------------------------------------
// Credits. Real payments need a payment provider and a backend.
// ---------------------------------------------------------------------------

export function addCredits(studentId: string, amount: number) {
  set({ credits: [...state.credits, { id: id(), studentId, change: amount, reason: `Bought ${amount} credits`, at: now() }] });
}

// ---------------------------------------------------------------------------
// Zoom. Connecting a real account needs Zoom's OAuth and a backend.
// ---------------------------------------------------------------------------

export function setZoomConnected(connected: boolean) {
  set({ zoomConnected: connected });
}

// ---------------------------------------------------------------------------
// Chats
// ---------------------------------------------------------------------------

export function sendMessage(conversationId: string, authorId: string, content: Pick<Message, 'text' | 'media' | 'replyTo' | 'call'>) {
  const message: Message = { id: id(), conversationId, authorId, at: now(), ...content };
  set({ messages: [...state.messages, message] });
}

/** Only the tutor can start a call. It is posted in the chat with its Zoom details. */
export function startCall(conversationId: string, userId: string) {
  const conversation = state.conversations.find((c) => c.id === conversationId);
  if (!conversation || conversation.tutorId !== userId) return;
  sendMessage(conversationId, userId, { call: makeZoom() });
}

/** The tutor adds a student to a group straight away. */
export function addMember(groupId: string, studentId: string) {
  set({
    conversations: state.conversations.map((c) =>
      c.id === groupId && !c.memberIds.includes(studentId) ? { ...c, memberIds: [...c.memberIds, studentId] } : c,
    ),
    requests: state.requests.filter((r) => !(r.groupId === groupId && r.studentId === studentId)),
  });
}

/** A student suggests someone for a group. It waits for the tutor. */
export function requestMember(groupId: string, studentId: string, requestedBy: string) {
  if (state.requests.some((r) => r.groupId === groupId && r.studentId === studentId)) return;
  set({ requests: [...state.requests, { id: id(), groupId, studentId, requestedBy, at: now() }] });
}

export function declineRequest(requestId: string) {
  set({ requests: state.requests.filter((r) => r.id !== requestId) });
}
