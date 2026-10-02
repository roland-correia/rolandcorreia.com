// Fills in every progress bar on the page (src/components/ProgressBar.astro) from
// the answers saved in this browser, and redraws when an answer is saved or cleared.

import { readProgress, PROGRESS_EVENT } from './progress';

const bars = Array.from(document.querySelectorAll<HTMLElement>('[data-pbar]'));

function render() {
  const progress = readProgress();

  for (const bar of bars) {
    const ids = bar.dataset.ids!.split(',');
    const answers = ids.map((id) => progress[id]).filter(Boolean);
    const good = answers.filter((answer) => answer.call === 'best').length;

    bar.querySelector('progress')!.value = answers.length;
    bar.querySelector<HTMLElement>('[data-pbar-text]')!.textContent =
      answers.length === 0
        ? `0 of ${ids.length} done`
        : `${answers.length} of ${ids.length} done. ${good} good ${good === 1 ? 'call' : 'calls'}.`;
    bar.hidden = false;
  }
}

if (bars.length > 0) {
  document.addEventListener(PROGRESS_EVENT, render);
  render();
}
