// One scenario: choose an answer, check it, read why.
//
// Progressive enhancement: without JavaScript the reason for every answer is on
// the page, so the scenario still reads as a worked example. With JavaScript the
// reasons are hidden until an answer is checked. There is no timer and no limit
// on tries: checking a second answer is how you compare the reasons.

import { recordFirstAnswer, type Call } from './progress';

const root = document.querySelector<HTMLElement>('[data-scenario]');

if (root) {
  const id = root.dataset.id!;
  const form = root.querySelector<HTMLFormElement>('[data-quiz]')!;
  const options = Array.from(root.querySelectorAll<HTMLElement>('[data-option]'));
  const check = root.querySelector<HTMLButtonElement>('[data-check]')!;
  const showAll = root.querySelector<HTMLButtonElement>('[data-show-all]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;
  const after = root.querySelector<HTMLElement>('[data-after]')!;

  const whyOf = (option: HTMLElement) => option.querySelector<HTMLElement>('[data-why]')!;
  const inputOf = (option: HTMLElement) => option.querySelector<HTMLInputElement>('input')!;

  options.forEach((option) => (whyOf(option).hidden = true));
  after.hidden = true;
  check.hidden = false;
  root.classList.add('js-quiz');

  function reveal(option: HTMLElement) {
    whyOf(option).hidden = false;
    option.classList.add('checked');
  }

  // The principle and the link to the next scenario appear once the best answer is on screen.
  // The reasons for the answers not yet checked stay one tap away.
  function finish() {
    after.hidden = false;
    check.hidden = true;
    showAll.hidden = options.every((option) => !whyOf(option).hidden);
    showAll.textContent = 'Show the reasons for the other answers';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const chosen = options.find((option) => inputOf(option).checked);

    hint.hidden = Boolean(chosen);
    if (!chosen) return;

    const call = chosen.dataset.call as Call;
    recordFirstAnswer(id, call);
    reveal(chosen);

    if (call === 'best') {
      finish();
    } else {
      check.textContent = 'Check another answer';
      showAll.hidden = false;
    }

    // Move to the reason so it is read next, by eye or by screen reader.
    whyOf(chosen).focus();
  });

  form.addEventListener('change', () => (hint.hidden = true));

  showAll.addEventListener('click', () => {
    const firstNew = options.find((option) => whyOf(option).hidden);
    options.forEach(reveal);
    finish();
    if (firstNew) whyOf(firstNew).focus();
  });
}
