// The dashboard: a few numbers, the calendar on the left and the lessons coming up
// on the right. Tutors also see join requests and their Zoom connection. Students
// see their credit balance and can book a one-to-one lesson.

import { useState } from 'preact/hooks';
import {
  useStore,
  lessonsFor,
  balanceOf,
  conversationsFor,
  setZoomConnected,
  freeSlots,
  bookLesson,
  userById,
} from './store';
import { dayKey, dayLong, day, time, plural } from './format';
import { href } from '../lib/paths';
import { toast } from './toast';
import { Calendar } from './Calendar';
import { LessonCard } from './LessonCard';
import { Modal } from './Modal';
import { readProgress } from '../scripts/progress';
import type { User } from './types';
import type { PracticeLesson } from './App';

export function Dashboard({ user, practice }: { user: User; practice: PracticeLesson[] }) {
  const state = useStore();
  const [selected, setSelected] = useState<Date | null>(null);
  const [booking, setBooking] = useState(false);
  const isTutor = user.role === 'tutor';

  const mine = lessonsFor(state, user);
  const now = Date.now();
  const upcoming = mine.filter((l) => new Date(l.start).getTime() + l.minutes * 60000 > now);
  const shown = selected
    ? mine.filter((l) => dayKey(new Date(l.start)) === dayKey(selected))
    : upcoming.slice(0, 8);

  const weekEnd = now + 7 * 24 * 3600 * 1000;
  const thisWeek = upcoming.filter((l) => l.status === 'booked' && new Date(l.start).getTime() < weekEnd);
  const groups = conversationsFor(state, user).filter((c) => c.kind === 'group');
  const requests = state.requests.filter((r) => groups.some((g) => g.id === r.groupId));
  const students = new Set(groups.flatMap((g) => g.memberIds).filter((id) => userById(state, id)?.role === 'student'));
  state.lessons.filter((l) => l.tutorId === user.id && l.studentId).forEach((l) => students.add(l.studentId!));
  const balance = balanceOf(state, user.id);
  const practised = readProgress();
  const practiceDone = practice.filter((p) => practised[p.id]).length;
  const nextPractice = practice.find((p) => !practised[p.id]);
  const tutorId = isTutor ? user.id : state.users.find((u) => u.role === 'tutor')!.id;

  return (
    <div class="dash">
      <header class="dash-head">
        <div>
          <p class="kicker">{dayLong(new Date())}</p>
          <h1>
            你好, <span>{user.short}</span>
          </h1>
        </div>
        {!isTutor && (
          <button type="button" class="btn" onClick={() => setBooking(true)}>
            Book a lesson
          </button>
        )}
      </header>

      <div class="stats">
        <div class="stat">
          <b>{thisWeek.length}</b>
          <span>{thisWeek.length === 1 ? 'lesson' : 'lessons'} in the next 7 days</span>
        </div>
        {isTutor ? (
          <>
            <div class="stat">
              <b>{students.size}</b>
              <span>students</span>
            </div>
            <a class="stat" href={href('/app/chats/')}>
              <b>{requests.length}</b>
              <span>{requests.length === 1 ? 'request' : 'requests'} to join a group</span>
            </a>
          </>
        ) : (
          <>
            <a class={`stat ${balance < 2 ? 'low' : ''}`} href={href('/app/credits/')}>
              <b>{balance}</b>
              <span>{balance === 1 ? 'credit' : 'credits'} left</span>
            </a>
            <div class="stat">
              <b>{groups.length}</b>
              <span>{groups.length === 1 ? 'group' : 'groups'}: {groups.map((g) => g.name).join(', ')}</span>
            </div>
            <a class="stat" href={nextPractice?.path ?? href('/practice/')}>
              <b>
                {practiceDone}/{practice.length}
              </b>
              <span>{nextPractice ? `practice lessons done. Next: ${nextPractice.title}` : 'practice lessons done'}</span>
            </a>
          </>
        )}
      </div>

      {isTutor && (
        <div class={`zoom-bar ${state.zoomConnected ? 'on' : ''}`}>
          <p>
            <b>Zoom</b>{' '}
            {state.zoomConnected
              ? 'connected. New lessons and calls get a Zoom meeting automatically.'
              : 'not connected. Connect your account so lessons and group calls open in Zoom.'}
          </p>
          <button
            type="button"
            class="btn ghost small"
            onClick={() => {
              setZoomConnected(!state.zoomConnected);
              toast(state.zoomConnected ? 'Zoom disconnected.' : 'Zoom connected (sample only, no real account is linked).');
            }}
          >
            {state.zoomConnected ? 'Disconnect' : 'Connect Zoom'}
          </button>
        </div>
      )}

      <div class="dash-grid">
        <Calendar lessons={mine} selected={selected} onSelect={setSelected} />

        <section class="upcoming" aria-labelledby="upcoming-title">
          <div class="panel-head">
            <h2 id="upcoming-title">{selected ? dayLong(selected) : 'Coming up'}</h2>
            {selected && (
              <button type="button" class="textbtn" onClick={() => setSelected(null)}>
                Show all coming up
              </button>
            )}
          </div>
          {shown.length === 0 ? (
            <p class="meta">{selected ? 'No lessons on this day.' : 'Nothing booked yet.'}</p>
          ) : (
            <div class="lesson-list">
              {shown.map((l) => (
                <LessonCard lesson={l} user={user} key={l.id} />
              ))}
            </div>
          )}
        </section>
      </div>

      {booking && (
        <Modal title="Book a one-to-one lesson" onClose={() => setBooking(false)}>
          <p>
            45 minutes with {userById(state, tutorId)!.name}, for 1 credit. You have {plural(balance, 'credit')}.
          </p>
          {balance < 1 ? (
            <a class="btn block" href={href('/app/credits/')}>
              Buy credits first
            </a>
          ) : (
            <ul class="slots">
              {freeSlots(tutorId).map((slot) => (
                <li>
                  <button
                    type="button"
                    class="btn ghost block"
                    onClick={() => {
                      if (bookLesson(user.id, tutorId, slot)) {
                        setBooking(false);
                        toast(`Booked for ${day(slot)}, ${time(slot)}. 1 credit used.`);
                      }
                    }}
                  >
                    {day(slot)}, {time(slot)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
}
