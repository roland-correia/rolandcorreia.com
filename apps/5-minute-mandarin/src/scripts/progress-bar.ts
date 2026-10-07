// Fills in the course progress bar (src/components/ProgressBar.astro) and each
// lesson tile's status from the results saved in this browser, and redraws when one changes.
// Also points each "Start" button (src/components/StartButton.astro) at the first lesson not yet done.

import { readProgress, PROGRESS_EVENT } from './progress';

const bars = Array.from(document.querySelectorAll<HTMLElement>('[data-pbar]'));
const tiles = Array.from(document.querySelectorAll<HTMLElement>('[data-lesson]'));
const starts = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-start]'));

function render() {
  const progress = readProgress();

  for (const bar of bars) {
    const ids = bar.dataset.ids!.split(',');
    const done = ids.filter((id) => progress[id]).length;
    bar.querySelector('progress')!.value = done;
    bar.querySelector<HTMLElement>('[data-pbar-text]')!.textContent =
      done === ids.length ? `All ${ids.length} lessons done.` : `${done} of ${ids.length} lessons done`;
    bar.hidden = false;
  }

  for (const tile of tiles) {
    const result = progress[tile.dataset.lesson!];
    const status = tile.querySelector<HTMLElement>('[data-status]')!;
    tile.classList.toggle('done', Boolean(result));
    status.hidden = !result;
    if (result) status.textContent = `Done. Best check: ${result.best} of ${result.total}.`;
  }

  for (const start of starts) {
    const lessons: { id: string; title: string; href: string }[] = JSON.parse(start.dataset.lessons!);
    const next = lessons.find((lesson) => !progress[lesson.id]);
    const anyDone = lessons.some((lesson) => progress[lesson.id]);
    const target = next ?? lessons[0];
    const verb = !anyDone ? 'Start' : next ? 'Carry on' : 'Go round again';
    start.href = target.href;
    start.textContent = `${verb}: ${target.title}`;
  }
}

if (bars.length > 0 || tiles.length > 0 || starts.length > 0) {
  document.addEventListener(PROGRESS_EVENT, render);
  render();
}
