// The shapes of everything in the tutor and student app.
//
// For now it all lives in the browser (see store.ts) and starts from the sample data
// in seed.ts. When there is a real backend, these become its tables, and the actions
// in store.ts become calls to it.

export type Role = 'tutor' | 'student';

export interface User {
  id: string;
  name: string;
  /** What to call them: a first name, or the full name where the family name comes first (Li Wei). */
  short: string;
  role: Role;
  /** Shown on the avatar. */
  initials: string;
  /** Where cancellation and reschedule texts go. Sample numbers only. */
  phone?: string;
}

export interface Zoom {
  meetingId: string;
  passcode: string;
}

export interface Material {
  id: string;
  name: string;
  /** An object URL for a file added this visit. Sample materials have none. */
  url?: string;
}

export interface Lesson {
  id: string;
  kind: 'one-to-one' | 'group';
  tutorId: string;
  /** The student, for a one-to-one lesson. */
  studentId?: string;
  /** The group conversation, for a group lesson. Everyone in it is booked on. */
  groupId?: string;
  title: string;
  /** ISO date and time. */
  start: string;
  minutes: number;
  status: 'booked' | 'cancelled';
  /** Set when the time has been moved at least once. */
  rescheduled?: boolean;
  /** The same meeting for tutor and student, so both join the same call. */
  zoom: Zoom;
  materials: Material[];
}

export interface Conversation {
  id: string;
  kind: 'group' | 'direct';
  name: string;
  /** For groups: "HSK 1", shown as a small label. */
  level?: string;
  tutorId: string;
  memberIds: string[];
}

export interface Media {
  kind: 'image' | 'voice';
  /** An object URL. Media is not saved between visits in this prototype. */
  url?: string;
  name?: string;
  seconds?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  authorId: string;
  at: string;
  text?: string;
  media?: Media;
  /** The message this one replies to. */
  replyTo?: string;
  /** A call started by the tutor, with its Zoom details. */
  call?: Zoom;
}

/** A student asking for someone to be added to a group. Only the tutor can approve it. */
export interface JoinRequest {
  id: string;
  groupId: string;
  studentId: string;
  requestedBy: string;
  at: string;
}

export interface CreditEntry {
  id: string;
  studentId: string;
  /** Positive for credits added or returned, negative for credits spent. */
  change: number;
  reason: string;
  at: string;
}

/** A text message that would be sent. Shown in the app until texts are connected. */
export interface TextMessage {
  id: string;
  to: string;
  body: string;
  at: string;
}

export interface State {
  version: number;
  sessionUserId: string | null;
  zoomConnected: boolean;
  users: User[];
  lessons: Lesson[];
  conversations: Conversation[];
  messages: Message[];
  requests: JoinRequest[];
  credits: CreditEntry[];
  texts: TextMessage[];
}
