// Students: their credit balance, buying more, and every credit in and out.
// Tutors: each student's balance and groups.
// One credit books one lesson. A lesson the tutor cancels gives the credit back.

import { useState } from 'preact/hooks';
import { useStore, balanceOf, addCredits, conversationsFor, lessonsFor, directChat } from './store';
import { relative, day, time, plural } from './format';
import { href } from '../lib/paths';
import { toast } from './toast';
import { Avatar } from './Avatar';
import { Modal } from './Modal';
import type { User } from './types';

// Sample prices, to be set by the business before launch.
const packs = [
  { credits: 1, price: '£20' },
  { credits: 5, price: '£95', note: 'Save £5' },
  { credits: 10, price: '£180', note: 'Save £20' },
];

export function Credits({ user }: { user: User }) {
  return user.role === 'tutor' ? <Students user={user} /> : <StudentCredits user={user} />;
}

function StudentCredits({ user }: { user: User }) {
  const state = useStore();
  const [buying, setBuying] = useState<(typeof packs)[number] | null>(null);
  const balance = balanceOf(state, user.id);
  const history = state.credits.filter((c) => c.studentId === user.id).slice().reverse();

  return (
    <div class="stack">
      <h1>Credits</h1>
      <div class="balance">
        <b>{balance}</b>
        <span>{balance === 1 ? 'credit' : 'credits'} left. One credit books one lesson, group or one-to-one.</span>
      </div>
      <p class="meta">If your tutor cancels a lesson, its credit comes straight back here.</p>

      <section class="group" aria-labelledby="buy-title">
        <h2 id="buy-title">Buy credits</h2>
        <div class="packs">
          {packs.map((p) => (
            <button type="button" class="pack" onClick={() => setBuying(p)}>
              <b>{plural(p.credits, 'credit')}</b>
              <span>{p.price}</span>
              {p.note && <small>{p.note}</small>}
            </button>
          ))}
        </div>
      </section>

      <section class="group" aria-labelledby="history-title">
        <h2 id="history-title">History</h2>
        <ul class="ledger">
          {history.map((c) => (
            <li>
              <span>
                {c.reason}
                <small>{relative(c.at)}</small>
              </span>
              <b class={c.change > 0 ? 'plus' : 'minus'}>
                {c.change > 0 ? '+' : '−'}
                {Math.abs(c.change)}
              </b>
            </li>
          ))}
        </ul>
      </section>

      {buying && (
        <Modal title={`Buy ${plural(buying.credits, 'credit')}`} onClose={() => setBuying(null)}>
          <p>
            {plural(buying.credits, 'credit')} for {buying.price}.
          </p>
          <p class="notice">
            Payments are not connected yet, so no money is taken. In this prototype the credits are added straight away.
          </p>
          <button
            type="button"
            class="btn block"
            onClick={() => {
              addCredits(user.id, buying.credits);
              setBuying(null);
              toast(`${plural(buying.credits, 'credit')} added.`);
            }}
          >
            Add {plural(buying.credits, 'credit')}
          </button>
        </Modal>
      )}
    </div>
  );
}

function Students({ user }: { user: User }) {
  const state = useStore();
  const groups = conversationsFor(state, user).filter((c) => c.kind === 'group');
  const students = state.users.filter((u) => u.role === 'student');

  return (
    <div class="stack">
      <h1>Students</h1>
      <p class="meta">Each student's credits, groups and next lesson.</p>
      <ul class="student-list">
        {students.map((s) => {
          const theirGroups = groups.filter((g) => g.memberIds.includes(s.id));
          const next = lessonsFor(state, s).find((l) => l.status === 'booked' && new Date(l.start) > new Date());
          const balance = balanceOf(state, s.id);
          const chat = directChat(state, user.id, s.id);
          return (
            <li class="student">
              <Avatar user={s} />
              <div>
                <b>{s.name}</b>
                <small>{theirGroups.length ? theirGroups.map((g) => g.name).join(', ') : 'One-to-one only'}</small>
                <small>{next ? `Next: ${day(next.start)}, ${time(next.start)}` : 'Nothing booked'}</small>
              </div>
              <span class={`credits ${balance < 2 ? 'low' : ''}`}>{plural(balance, 'credit')}</span>
              {chat && (
                <a class="btn ghost small" href={href(`/app/chats/?c=${chat.id}`)}>
                  Message
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
