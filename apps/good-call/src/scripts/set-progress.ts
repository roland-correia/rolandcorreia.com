// On a set's page: marks the scenarios already done, counts them, and offers a reset.
// Without JavaScript the list is simply a list of links.

import { readProgress, clearSet, callLabels } from './progress';

const root = document.querySelector<HTMLElement>('[data-set]');

if (root) {
  const set = root.dataset.set!;
  const links = Array.from(root.querySelectorAll<HTMLElement>('[data-scenario-link]'));
  const summary = root.querySelector<HTMLElement>('[data-summary]')!;
  const reset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const start = root.querySelector<HTMLAnchorElement>('[data-start]')!;
  // Present only when the set is split into categories.
  const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-section]'));

  function render() {
    const progress = readProgress();
    let done = 0;
    let next: HTMLElement | undefined;

    for (const link of links) {
      const status = link.querySelector<HTMLElement>('[data-status]')!;
      const first = progress[link.dataset.id!];
      link.classList.toggle('done', Boolean(first));
      status.hidden = !first;
      if (first) {
        done += 1;
        status.textContent = `Done. Your first answer: ${callLabels[first]}`;
      } else {
        next ??= link;
      }
    }

    summary.hidden = reset.hidden = done === 0;
    summary.textContent = `${done} of ${links.length} done`;

    for (const section of sections) {
      const total = section.querySelectorAll('[data-scenario-link]').length;
      const doneHere = section.querySelectorAll('[data-scenario-link].done').length;
      const label = `${total} ${total === 1 ? 'scenario' : 'scenarios'}`;
      section.querySelector<HTMLElement>('[data-section-count]')!.textContent =
        doneHere > 0 ? `${doneHere} of ${total} done` : label;
    }

    if (done > 0 && next) {
      start.textContent = 'Carry on';
      start.href = next.getAttribute('href')!;
    } else if (done > 0) {
      start.textContent = 'Go through them again';
      start.href = links[0].getAttribute('href')!;
    } else {
      start.textContent = 'Start';
      start.href = links[0].getAttribute('href')!;
    }
  }

  reset.addEventListener('click', () => {
    clearSet(set);
    render();
    start.focus();
  });

  render();
}
