// Sign in. Real sign-in with Google, Microsoft or Apple needs a backend to check
// who someone is, so for now each button leads to a choice of sample accounts.

import { useState } from 'preact/hooks';
import { useStore, signIn, conversationsFor } from './store';
import { href } from '../lib/paths';
import { Avatar } from './Avatar';

const providers = ['Google', 'Microsoft', 'Apple'];

export function SignIn() {
  const state = useStore();
  const [provider, setProvider] = useState<string | null>(null);

  const go = (userId: string) => {
    signIn(userId);
    location.href = href('/app/');
  };

  return (
    <div class="signin">
      <h1>Sign in</h1>
      {!provider ? (
        <>
          <p class="lead">Tutors and students use the same sign-in. No new password to remember.</p>
          <div class="stack-sm">
            {providers.map((p) => (
              <button type="button" class="btn ghost block" onClick={() => setProvider(p)}>
                Continue with {p}
              </button>
            ))}
          </div>
          <p class="fine">New here? Signing in for the first time creates your account.</p>
        </>
      ) : (
        <>
          <p class="notice">
            {provider} sign-in is not connected yet. Choose a sample account to see the app as a tutor or a student.
          </p>
          <ul class="accounts">
            {state.users.map((u) => {
              const groups = conversationsFor(state, u).filter((c) => c.kind === 'group');
              return (
                <li>
                  <button type="button" class="account" onClick={() => go(u.id)}>
                    <Avatar user={u} />
                    <span>
                      <b>{u.name}</b>
                      <small>
                        {u.role === 'tutor' ? 'Tutor' : 'Student'}
                        {u.role === 'student' && groups.length > 0 && `. ${groups.map((g) => g.name).join(' and ')}`}
                      </small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" class="textbtn" onClick={() => setProvider(null)}>
            Back
          </button>
        </>
      )}
    </div>
  );
}
