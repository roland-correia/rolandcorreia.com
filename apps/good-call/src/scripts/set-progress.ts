// On a set's page or a chapter's page: points the Start button at the next
// unanswered scenario, marks the scenarios already answered, and offers a reset.
// The progress bars are drawn by progress-bar.ts.
// Without JavaScript the Start button opens the first scenario, and the lists are plain links.

import { readProgress, clearSet, callLabels } from './progress';

const root = document.querySelector<HTMLElement>('[data-set]');

if (root) {
  const set = root.dataset.set!;
  const start = root.querySelector<HTMLAnchorElement>('[data-start]')!;
  // The scenarios behind the Start button, in order: the whole set, or one chapter.
  const sequence: { id: string; href: string }[] = JSON.parse(start.dataset.sequence ?? '[]');
  const startLabel = start.dataset.startLabel ?? 'Start';
  // Present only where scenarios are listed, and on the set's own page.
  const links = Array.from(root.querySelectorAll<HTMLElement>('[data-scenario-link]'));
  const reset = root.querySelector<HTMLButtonElement>('[data-reset]');

  function render() {
    const progress = readProgress();

    for (const link of links) {
      const status = link.querySelector<HTMLElement>('[data-status]')!;
      const answer = progress[link.dataset.id!];
      link.classList.toggle('done', Boolean(answer));
      status.hidden = !answer;
      if (answer) status.textContent = `Done. Your answer: ${callLabels[answer.call]}`;
    }

    const done = sequence.filter((item) => progress[item.id]).length;
    const next = sequence.find((item) => !progress[item.id]);

    if (done === 0) start.textContent = startLabel;
    else start.textContent = next ? 'Carry on' : 'Review your answers';
    start.href = (next ?? sequence[0]).href;

    if (reset) reset.hidden = !Object.keys(progress).some((id) => id.startsWith(`${set}/`));
  }

  reset?.addEventListener('click', () => {
    clearSet(set);
    render();
    start.focus();
  });

  render();
}
