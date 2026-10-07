// Which lessons this visitor has finished, and their best score in each check.
// Saved in this browser's localStorage only. Nothing is sent anywhere.

const KEY = 'fmm-progress';

// Sent on `document` whenever a result is saved or cleared, so progress bars can redraw.
export const PROGRESS_EVENT = 'fmm:progress';

export interface Result {
  // The most answers right first time in any one go at the check.
  best: number;
  total: number;
}

// Keyed by lesson id, e.g. 'greetings'.
export type Progress = Record<string, Result>;

export function readProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

function write(progress: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Private browsing can block storage. The lesson still works; it just is not remembered.
  }
  document.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

// Keeps the better of this score and any earlier one.
export function recordResult(id: string, right: number, total: number) {
  const progress = readProgress();
  const best = Math.max(right, progress[id]?.best ?? 0);
  write({ ...progress, [id]: { best, total } });
}

export function clearAll() {
  write({});
}
