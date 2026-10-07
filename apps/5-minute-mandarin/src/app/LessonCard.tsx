// One lesson in the upcoming list: when, who, the Zoom meeting and its materials.
// The tutor can add materials, move it or cancel it. A student can join and open materials.

import { useState } from 'preact/hooks';
import {
  useStore,
  userById,
  studentsOf,
  cancelLesson,
  rescheduleLesson,
  addMaterial,
  directChat,
} from './store';
import { day, time, plural } from './format';
import { href } from '../lib/paths';
import { toast } from './toast';
import { Modal } from './Modal';
import type { Lesson, User } from './types';

// For <input type="datetime-local">, which wants local time without a zone.
const localInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function LessonCard({ lesson, user }: { lesson: Lesson; user: User }) {
  const state = useStore();
  const [dialog, setDialog] = useState<null | 'zoom' | 'move' | 'cancel'>(null);
  const [newStart, setNewStart] = useState(localInput(lesson.start));
  const isTutor = user.role === 'tutor';
  const students = studentsOf(state, lesson).map((id) => userById(state, id)!);
  const group = lesson.groupId ? state.conversations.find((c) => c.id === lesson.groupId) : undefined;
  const tutor = userById(state, lesson.tutorId)!;
  const cancelled = lesson.status === 'cancelled';
  const past = new Date(lesson.start).getTime() + lesson.minutes * 60000 < Date.now();
  const chat = isTutor ? lesson.studentId && directChat(state, user.id, lesson.studentId) : directChat(state, lesson.tutorId, user.id);
  const chatHref = chat ? href(`/app/chats/?c=${chat.id}`) : undefined;

  const who = isTutor
    ? group
      ? `${group.name} group. ${plural(students.length, 'student')}`
      : students[0]?.name
    : group
      ? `${group.name} group with ${tutor.name}`
      : `With ${tutor.name}`;

  return (
    <article class={`lesson ${cancelled ? 'is-cancelled' : ''}`}>
      <header class="lesson-head">
        <div>
          <p class="lesson-when">
            {day(lesson.start)}, {time(lesson.start)}
            <span class="meta"> · {lesson.minutes} min</span>
          </p>
          <h3>{isTutor && !group ? students[0]?.name : lesson.title}</h3>
          <p class="meta">{isTutor && !group ? 'One-to-one' : who}</p>
        </div>
        <span class={`chip chip-${lesson.kind}`}>{lesson.kind === 'group' ? 'Group' : '1:1'}</span>
      </header>

      {cancelled && <p class="status-line">Cancelled. {isTutor ? 'Credits were returned.' : 'Your credit was returned.'}</p>}
      {!cancelled && lesson.rescheduled && <p class="status-line moved">Moved to this time.</p>}

      {isTutor && group && (
        <p class="names">{students.map((s) => s.name).join(', ')}</p>
      )}

      {lesson.materials.length > 0 && (
        <div class="materials">
          <b>Materials</b>
          <ul>
            {lesson.materials.map((m) => (
              <li>
                {m.url ? (
                  <a href={m.url} download={m.name}>
                    {m.name}
                  </a>
                ) : (
                  <span title="A sample file. It cannot be opened in this prototype.">{m.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!cancelled && (
        <div class="lesson-actions">
          {!past && (
            <button type="button" class="btn small" onClick={() => setDialog('zoom')}>
              Join on Zoom
            </button>
          )}
          {isTutor && (
            <label class="btn ghost small file-btn">
              Add materials
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.key,.doc,.docx,image/*"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    addMaterial(lesson.id, file);
                    toast(`${file.name} added. ${plural(students.length, 'student')} can open it.`);
                  }
                }}
              />
            </label>
          )}
          {isTutor && !past && (
            <>
              <button type="button" class="btn ghost small" onClick={() => setDialog('move')}>
                Reschedule
              </button>
              <button type="button" class="btn ghost small danger" onClick={() => setDialog('cancel')}>
                Cancel
              </button>
            </>
          )}
          {chatHref && (
            <a class="btn ghost small" href={chatHref}>
              Message
            </a>
          )}
        </div>
      )}

      {dialog === 'zoom' && (
        <Modal title="Join on Zoom" onClose={() => setDialog(null)}>
          <p>Tutor and students join the same meeting.</p>
          <dl class="zoom">
            <dt>Meeting ID</dt>
            <dd>{lesson.zoom.meetingId}</dd>
            <dt>Passcode</dt>
            <dd>{lesson.zoom.passcode}</dd>
          </dl>
          <p class="notice">
            Zoom is not connected yet. Once {isTutor ? 'you connect your Zoom account' : 'your tutor connects Zoom'}, this
            button opens the meeting directly.
          </p>
        </Modal>
      )}

      {dialog === 'move' && (
        <Modal title="Reschedule this lesson" onClose={() => setDialog(null)}>
          <label class="field">
            <span>New date and time</span>
            <input type="datetime-local" value={newStart} onInput={(e) => setNewStart((e.target as HTMLInputElement).value)} />
          </label>
          <p class="meta">
            {plural(students.length, 'student')} will get a text with the new time. The Zoom meeting stays the same.
          </p>
          <button
            type="button"
            class="btn block"
            onClick={() => {
              const start = new Date(newStart);
              if (Number.isNaN(start.getTime())) return;
              const sent = rescheduleLesson(lesson.id, start.toISOString());
              setDialog(null);
              toast(`Lesson moved to ${day(start.toISOString())}, ${time(start.toISOString())}. ${plural(sent, 'text')} sent.`);
            }}
          >
            Move lesson and text {students.length === 1 ? students[0].short : 'students'}
          </button>
        </Modal>
      )}

      {dialog === 'cancel' && (
        <Modal title="Cancel this lesson?" onClose={() => setDialog(null)}>
          <p>
            {day(lesson.start)}, {time(lesson.start)}: {isTutor && !group ? students[0]?.name : lesson.title}.
          </p>
          <p>
            {students.length === 1
              ? `${students[0].name} gets their credit back straight away and a text to say the lesson is cancelled.`
              : `All ${students.length} students get their credit back straight away and a text to say the lesson is cancelled.`}
          </p>
          <button
            type="button"
            class="btn block danger-fill"
            onClick={() => {
              const sent = cancelLesson(lesson.id);
              setDialog(null);
              toast(`Lesson cancelled. ${plural(students.length, 'credit')} returned, ${plural(sent, 'text')} sent.`);
            }}
          >
            Cancel lesson and return credits
          </button>
        </Modal>
      )}
    </article>
  );
}
