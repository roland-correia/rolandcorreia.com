// On a module's page: points the Start button at the first unanswered question
// on the page, and offers a reset. The progress bars are drawn by progress-bar.ts,
// and each question by scenario.ts.
// Without JavaScript the Start button jumps to the first question.

import { readProgress, clearSet, PROGRESS_EVENT } from './progress';

const root = document.querySelector<HTMLElement>('[data-set]');

if (root) {
  const set = root.dataset.set!;
  const start = root.querySelector<HTMLAnchorElement>('[data-start]')!;
  // The questions behind the Start button, in page order, with their anchors.
  const sequence: { id: string; href: string }[] = JSON.parse(start.dataset.sequence ?? '[]');
  const reset = root.querySelector<HTMLButtonElement>('[data-reset]');

  function render() {
    const progress = readProgress();
    const done = sequence.filter((item) => progress[item.id]).length;
    const next = sequence.find((item) => !progress[item.id]);

    if (done === 0) start.textContent = 'Start';
    else start.textContent = next ? 'Carry on' : 'Review your answers';
    start.href = (next ?? sequence[0]).href;

    if (reset) reset.hidden = done === 0;
  }

  // Clearing answers has to unlock every question on the page, so the page is reloaded.
  reset?.addEventListener('click', () => {
    clearSet(set);
    location.hash = '';
    location.reload();
  });

  // Answering a question further down updates the button without a reload.
  document.addEventListener(PROGRESS_EVENT, render);
  render();
}
