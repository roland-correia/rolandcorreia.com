// Short confirmations at the bottom of the screen: "Lesson cancelled. 3 texts sent."
// Read out by screen readers through the live region in App.tsx.

import { useEffect, useState } from 'preact/hooks';

let toasts: { id: number; text: string }[] = [];
let next = 0;
const listeners = new Set<() => void>();

export function toast(text: string) {
  const entry = { id: ++next, text };
  toasts = [...toasts, entry];
  listeners.forEach((l) => l());
  setTimeout(() => {
    toasts = toasts.filter((t) => t !== entry);
    listeners.forEach((l) => l());
  }, 5000);
}

export function useToasts() {
  const [, force] = useState(0);
  useEffect(() => {
    const listener = () => force((n) => n + 1);
    listeners.add(listener);
    return () => void listeners.delete(listener);
  }, []);
  return toasts;
}
