// The frame around every screen of the tutor and student app: navigation, who is
// signed in, the prototype notice, sent texts and toasts. `page` picks the screen.

import { useEffect, useState } from 'preact/hooks';
import { useStore, currentUser, signOut, resetDemo, balanceOf, userById } from './store';
import { useToasts } from './toast';
import { href } from '../lib/paths';
import { relative, plural } from './format';
import { Avatar } from './Avatar';
import { SignIn } from './SignIn';
import { Dashboard } from './Dashboard';
import { Chats } from './Chats';
import { Credits } from './Credits';

type Page = 'sign-in' | 'dashboard' | 'chats' | 'credits';

export default function App({ page }: { page: Page }) {
  const state = useStore();
  const user = currentUser(state);
  const toasts = useToasts();
  const [textsOpen, setTextsOpen] = useState(false);

  // Every screen but sign-in needs someone signed in.
  useEffect(() => {
    if (page !== 'sign-in' && !user) location.replace(href('/sign-in/'));
  }, [page, user]);

  if (page === 'sign-in') return <SignIn />;
  if (!user) return null;

  const nav = [
    { id: 'dashboard', label: 'Dashboard', path: '/app/' },
    { id: 'chats', label: 'Chats', path: '/app/chats/' },
    { id: 'credits', label: user.role === 'tutor' ? 'Students' : 'Credits', path: '/app/credits/' },
  ];
  const myTexts = state.texts.filter((t) => user.role === 'tutor' || t.to === user.id).slice().reverse();

  return (
    <div class="app">
      <aside class="side">
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
        <nav aria-label="App">
          <ul class="side-nav">
            {nav.map((item) => (
              <li>
                <a href={href(item.path)} aria-current={item.id === page ? 'page' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={href('/#practice')}>Practice</a>
            </li>
            <li>
              <a href={href('/blog/')}>Blog</a>
            </li>
          </ul>
        </nav>
        <div class="side-user">
          <Avatar user={user} />
          <div>
            <b>{user.name}</b>
            <small>
              {user.role === 'tutor' ? 'Tutor' : `Student. ${plural(balanceOf(state, user.id), 'credit')}`}
            </small>
          </div>
        </div>
        <button type="button" class="textbtn" onClick={() => setTextsOpen(!textsOpen)} aria-expanded={textsOpen}>
          Texts sent ({myTexts.length})
        </button>
        <button
          type="button"
          class="textbtn"
          onClick={() => {
            signOut();
            location.href = href('/sign-in/');
          }}
        >
          Sign out
        </button>
      </aside>

      <div class="app-main">
        <p class="demo-note">
          Prototype with sample data. Sign-in, payments, Zoom and text messages are not connected yet.{' '}
          <button
            type="button"
            class="linkbtn"
            onClick={() => {
              if (confirm('Put all the sample data back as it was? Your changes in this browser will be lost.')) resetDemo();
            }}
          >
            Reset the sample data
          </button>
        </p>

        {textsOpen && (
          <section class="panel texts" aria-labelledby="texts-title">
            <div class="panel-head">
              <h2 id="texts-title">Texts sent</h2>
              <button type="button" class="iconbtn" onClick={() => setTextsOpen(false)}>
                Close
              </button>
            </div>
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
          </section>
        )}

        {page === 'dashboard' && <Dashboard user={user} />}
        {page === 'chats' && <Chats user={user} />}
        {page === 'credits' && <Credits user={user} />}
      </div>

      <div class="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <p class="toast" key={t.id}>
            {t.text}
          </p>
        ))}
      </div>
    </div>
  );
}
