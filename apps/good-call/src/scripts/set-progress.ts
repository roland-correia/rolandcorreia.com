// On a module's page: points the Start button at the topic holding the first
// unanswered question, and offers a reset. The progress bars are drawn by progress-bar.ts.
// Without JavaScript the Start button opens the first topic.

import { readProgress, clearSet, PROGRESS_EVENT } from './progress';

const root = document.querySelector<HTMLElement>('[data-set]');

if (root) {
  const set = root.dataset.set!;
  const start = root.querySelector<HTMLAnchorElement>('[data-start]')!;
  // Every question in the module, in order, with the address of its topic.
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

  reset?.addEventListener('click', () => {
    clearSet(set);
    start.focus();
  });

  // Clearing answers redraws the button and the bars.
  document.addEventListener(PROGRESS_EVENT, render);
  render();
}
