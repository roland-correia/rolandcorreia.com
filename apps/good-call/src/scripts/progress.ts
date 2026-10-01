// Which scenarios this visitor has finished, and what they chose first.
// Saved in this browser's localStorage only. Nothing is sent anywhere.

const KEY = 'gc-progress';

export type Call = 'best' | 'okay' | 'risky';

// Keyed by scenario id, e.g. 'consent/hug-hello'. The value is the first answer checked.
export type Progress = Record<string, Call>;

export const callLabels: Record<Call, string> = {
  best: 'Good call',
  okay: 'Could be better',
  risky: 'Not the best call',
};

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
    // Private browsing can block storage. The scenario still works; it just is not remembered.
  }
}

// Only the first answer is kept, so trying again never overwrites an honest first go.
export function recordFirstAnswer(id: string, call: Call) {
  const progress = readProgress();
  if (id in progress) return;
  write({ ...progress, [id]: call });
}

export function clearSet(set: string) {
  const progress = readProgress();
  for (const id of Object.keys(progress)) {
    if (id.startsWith(`${set}/`)) delete progress[id];
  }
  write(progress);
}
