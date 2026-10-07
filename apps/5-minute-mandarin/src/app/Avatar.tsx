import type { User } from './types';

export function Avatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' }) {
  return (
    <span class={`avatar avatar-${size} avatar-${user.role}`} aria-hidden="true">
      {user.initials}
    </span>
  );
}
