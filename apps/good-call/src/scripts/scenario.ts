// One scenario: choose an answer, lock it in, read why.
//
// An answer is final. Once it is locked in it cannot be changed, on this visit or
// a later one, so the result is the visitor's real first judgement. There is still
// no timer: they can take as long as they like before locking in.
//
// Progressive enhancement: without JavaScript the reason for every answer is on
// the page, so the scenario still reads as a worked example.

import { readProgress, recordAnswer, type Call } from './progress';

const root = document.querySelector<HTMLElement>('[data-scenario]');

if (root) {
  const id = root.dataset.id!;
  const form = root.querySelector<HTMLFormElement>('[data-quiz]')!;
  const options = Array.from(root.querySelectorAll<HTMLElement>('[data-option]'));
  const check = root.querySelector<HTMLButtonElement>('[data-check]')!;
  const once = root.querySelector<HTMLElement>('[data-once]')!;
  const locked = root.querySelector<HTMLElement>('[data-locked]')!;
  const showAll = root.querySelector<HTMLButtonElement>('[data-show-all]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;
  const after = root.querySelector<HTMLElement>('[data-after]')!;

  const whyOf = (option: HTMLElement) => option.querySelector<HTMLElement>('[data-why]')!;
  const inputOf = (option: HTMLElement) => option.querySelector<HTMLInputElement>('input')!;

  options.forEach((option) => (whyOf(option).hidden = true));
  after.hidden = true;
  check.hidden = once.hidden = false;
  root.classList.add('js-quiz');

  function reveal(option: HTMLElement) {
    whyOf(option).hidden = false;
  }

  // Shows a locked answer: the choice is marked and can no longer be changed, its
  // reason and the best answer's reason are shown, and the rest are one tap away.
  // `choice` is -1 when an older saved answer did not record which option it was.
  function lock(choice: number) {
    const chosen = options[choice];

    for (const option of options) {
      const input = inputOf(option);
      input.checked = option === chosen;
      input.disabled = true;
    }
    root!.classList.add('locked');

    if (chosen) {
      chosen.classList.add('chosen');
      chosen.querySelector<HTMLElement>('[data-yours]')!.hidden = false;
      reveal(chosen);
      options.filter((option) => option.dataset.call === 'best').forEach(reveal);
    } else {
      options.forEach(reveal);
    }

    check.hidden = once.hidden = hint.hidden = true;
    locked.hidden = after.hidden = false;
    showAll.hidden = options.every((option) => !whyOf(option).hidden);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // A locked form has no button to submit it, but Enter in a field still could.
    if (root.classList.contains('locked')) return;

    const choice = options.findIndex((option) => inputOf(option).checked);
    hint.hidden = choice > -1;
    if (choice === -1) return;

    recordAnswer(id, { call: options[choice].dataset.call as Call, choice });
    lock(choice);

    // Move to the reason so it is read next, by eye or by screen reader.
    whyOf(options[choice]).focus();
  });

  form.addEventListener('change', () => (hint.hidden = true));

  showAll.addEventListener('click', () => {
    const firstNew = options.find((option) => whyOf(option).hidden);
    options.forEach(reveal);
    showAll.hidden = true;
    if (firstNew) whyOf(firstNew).focus();
  });

  // Coming back to a scenario that was already answered shows it locked.
  const saved = readProgress()[id];
  if (saved) lock(saved.choice);
}
