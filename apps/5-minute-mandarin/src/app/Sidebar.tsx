// The sidebar on every page: the wordmark, the navigation, who is signed in,
// texts sent, reading settings and sign in or out. Signed out, it shows only the
// public pages and a Sign in button.

import { useState } from 'preact/hooks';
import { useStore, currentUser, signOut, balanceOf, userById } from './store';
import { useToasts } from './toast';
import { href } from '../lib/paths';
import { relative, plural } from './format';
import { Avatar } from './Avatar';
import { Modal } from './Modal';

/** Which item is highlighted. Matches the ids in `items` below. */
export type NavId = 'home' | 'dashboard' | 'chats' | 'credits' | 'practice' | 'blog' | 'about' | 'sign-in';

export default function Sidebar({ current }: { current: NavId }) {
  const state = useStore();
  const user = currentUser(state);
  const toasts = useToasts();
  const [textsOpen, setTextsOpen] = useState(false);

  const items: { id: NavId; label: string; path: string; signedIn?: boolean }[] = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'dashboard', label: 'Dashboard', path: '/app/', signedIn: true },
    { id: 'chats', label: 'Chats', path: '/app/chats/', signedIn: true },
    { id: 'credits', label: user?.role === 'tutor' ? 'Students' : 'Credits', path: '/app/credits/', signedIn: true },
    { id: 'practice', label: 'Practice', path: '/practice/' },
    { id: 'blog', label: 'Blog', path: '/blog/' },
    { id: 'about', label: 'About', path: '/about/' },
  ];
  const myTexts = user ? state.texts.filter((t) => user.role === 'tutor' || t.to === user.id).slice().reverse() : [];

  return (
    <>
      <a class="wm" href={href('/')}>
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="7" />
          <circle cx="16" cy="16" r="9.5" />
          <path d="M16 16V9.5M16 16l4.75 -3.25" />
        </svg>
        <span>
          5 Minute <b>Mandarin</b>
        </span>
      </a>

      <nav aria-label="Main">
        <ul class="side-nav">
          {items
            .filter((item) => !item.signedIn || user)
            .map((item) => (
              <li>
                <a href={href(item.path)} aria-current={item.id === current ? 'page' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
        </ul>
      </nav>

      <div class="side-foot">
        {user ? (
          <>
            <div class="side-user">
              <Avatar user={user} />
              <div>
                <b>{user.name}</b>
                <small>{user.role === 'tutor' ? 'Tutor' : `Student. ${plural(balanceOf(state, user.id), 'credit')}`}</small>
              </div>
            </div>
            <button type="button" class="side-link" onClick={() => setTextsOpen(true)}>
              Texts sent ({myTexts.length})
            </button>
          </>
        ) : (
          current !== 'sign-in' && (
            <a class="btn block" href={href('/sign-in/')}>
              Sign in
            </a>
          )
        )}
        <button type="button" class="side-link" data-open-settings aria-haspopup="dialog">
          Reading settings
        </button>
        {user && (
          <button
            type="button"
            class="side-link"
            onClick={() => {
              signOut();
              location.href = href('/');
            }}
          >
            Sign out
          </button>
        )}
      </div>

      {textsOpen && (
        <Modal title="Texts sent" onClose={() => setTextsOpen(false)}>
          <p class="meta">
            Students get a text when a lesson is cancelled or moved. Until texts are connected, they are listed here
            instead.
          </p>
          {myTexts.length === 0 ? (
            <p class="meta">None yet.</p>
          ) : (
            <ul class="text-list">
              {myTexts.map((t) => {
                const to = userById(state, t.to)!;
                return (
                  <li>
                    <small>
                      To {to.name}, {to.phone}. {relative(t.at)}
                    </small>
                    <p>{t.body}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </Modal>
      )}

      <div class="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <p class="toast" key={t.id}>
            {t.text}
          </p>
        ))}
      </div>
    </>
  );
}
