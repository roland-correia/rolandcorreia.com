// A month calendar. Each day shows how many lessons are on it; choosing a day
// shows that day's lessons in the list beside it.

import { useState } from 'preact/hooks';
import { dayKey, dayLong } from './format';
import type { Lesson } from './types';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function Calendar({
  lessons,
  selected,
  onSelect,
}: {
  lessons: Lesson[];
  selected: Date | null;
  onSelect: (d: Date | null) => void;
}) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const byDay = new Map<string, Lesson[]>();
  for (const l of lessons) {
    const key = dayKey(new Date(l.start));
    byDay.set(key, [...(byDay.get(key) ?? []), l]);
  }

  // Weeks start on Monday. Pad the first week with the end of the month before.
  const first = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  while (cells.length % 7) cells.push(null);

  const today = dayKey(new Date());
  const shift = (by: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + by, 1));

  return (
    <section class="panel calendar" aria-labelledby="cal-title">
      <div class="panel-head">
        <h2 id="cal-title">{month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h2>
        <div class="cal-nav">
          <button type="button" class="iconbtn" onClick={() => shift(-1)} aria-label="Previous month">
            ‹
          </button>
          <button type="button" class="iconbtn" onClick={() => shift(1)} aria-label="Next month">
            ›
          </button>
        </div>
      </div>
      <div class="cal-grid" role="grid">
        {WEEKDAYS.map((w) => (
          <span class="cal-wd" role="columnheader">
            {w}
          </span>
        ))}
        {cells.map((d) => {
          if (!d) return <span class="cal-pad" />;
          const key = dayKey(d);
          const theirs = (byDay.get(key) ?? []).filter((l) => l.status === 'booked');
          const isSelected = selected && dayKey(selected) === key;
          return (
            <button
              type="button"
              class={`cal-day ${key === today ? 'today' : ''} ${isSelected ? 'selected' : ''} ${theirs.length ? 'has' : ''}`}
              aria-pressed={Boolean(isSelected)}
              aria-label={`${dayLong(d)}. ${theirs.length ? `${theirs.length} lesson${theirs.length === 1 ? '' : 's'}` : 'No lessons'}`}
              onClick={() => onSelect(isSelected ? null : d)}
            >
              <span>{d.getDate()}</span>
              {theirs.length > 0 && <small>{theirs.length}</small>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
