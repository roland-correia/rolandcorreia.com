// Fills in the course progress bar (src/components/ProgressBar.astro) and each
// lesson tile's status from the results saved in this browser, and redraws when one changes.
// Also points the "Start" button at the first lesson not yet done.

import { readProgress, PROGRESS_EVENT } from './progress';

const bars = Array.from(document.querySelectorAll<HTMLElement>('[data-pbar]'));
const tiles = Array.from(document.querySelectorAll<HTMLElement>('[data-lesson]'));
const start = document.querySelector<HTMLAnchorElement>('[data-start]');

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

  if (start) {
    const next = tiles.find((tile) => !progress[tile.dataset.lesson!]);
    const anyDone = tiles.some((tile) => progress[tile.dataset.lesson!]);
    const target = next ?? tiles[0];
    if (target) {
      start.href = target.getAttribute('href')!;
      const verb = !anyDone ? 'Start' : next ? 'Carry on' : 'Go round again';
      start.textContent = `${verb}: ${target.dataset.title}`;
    }
  }
}

if (bars.length > 0 || tiles.length > 0) {
  document.addEventListener(PROGRESS_EVENT, render);
  render();
}
