// The screens of the tutor and student app. `page` picks one. The sidebar around
// them is a separate island (Sidebar.tsx), so it is the same on every page.

import { useEffect } from 'preact/hooks';
import { useStore, currentUser, resetDemo } from './store';
import { href } from '../lib/paths';
import { SignIn } from './SignIn';
import { Dashboard } from './Dashboard';
import { Chats } from './Chats';
import { Credits } from './Credits';

export type Page = 'sign-in' | 'dashboard' | 'chats' | 'credits';

/** A practice lesson, passed in from the static pages so the dashboard can show practice progress. */
export interface PracticeLesson {
  id: string;
  title: string;
  path: string;
}

export default function App({ page, practice }: { page: Page; practice: PracticeLesson[] }) {
  const state = useStore();
  const user = currentUser(state);

  // Every screen but sign-in needs someone signed in.
  useEffect(() => {
    if (page !== 'sign-in' && !user) location.replace(href('/sign-in/'));
  }, [page, user]);

  if (page === 'sign-in') return <SignIn />;
  if (!user) return null;

  return (
    <>
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

      {page === 'dashboard' && <Dashboard user={user} practice={practice} />}
      {page === 'chats' && <Chats user={user} />}
      {page === 'credits' && <Credits user={user} />}
    </>
  );
}
