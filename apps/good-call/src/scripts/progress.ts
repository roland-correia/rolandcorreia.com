// Which scenarios this visitor has answered, and what they chose.
// Saved in this browser's localStorage only. Nothing is sent anywhere.

const KEY = 'gc-progress';

// Sent on `document` whenever an answer is saved or cleared, so progress bars can redraw.
export const PROGRESS_EVENT = 'gc:progress';

export type Call = 'best' | 'okay' | 'risky';

export interface Answer {
  call: Call;
  // Which option was chosen, counting from 0. -1 means it is not known: the answer
  // was saved by an earlier version of the site, which kept only the verdict.
  choice: number;
}

// Keyed by scenario id, e.g. 'consent/hug-hello'.
export type Progress = Record<string, Answer>;

export const callLabels: Record<Call, string> = {
  best: 'Good call',
  okay: 'Could be better',
  risky: 'Not the best call',
};

export function readProgress(): Progress {
  let saved: Record<string, Answer | Call>;
  try {
    saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }

  const progress: Progress = {};
  for (const [id, value] of Object.entries(saved)) {
    progress[id] = typeof value === 'string' ? { call: value, choice: -1 } : value;
  }
  return progress;
}

function write(progress: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Private browsing can block storage. The scenario still works; it just is not remembered.
  }
  document.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

// An answer is final. Once one is saved for a scenario it is never replaced.
export function recordAnswer(id: string, answer: Answer) {
  const progress = readProgress();
  if (id in progress) return;
  write({ ...progress, [id]: answer });
}

export function clearSet(set: string) {
  const progress = readProgress();
  for (const id of Object.keys(progress)) {
    if (id.startsWith(`${set}/`)) delete progress[id];
  }
  write(progress);
}
