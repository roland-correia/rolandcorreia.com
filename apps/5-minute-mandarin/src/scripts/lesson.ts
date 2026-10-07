// One lesson: learn the words, then check yourself one question at a time.
//
// Unlike a test, the check can be taken again as often as you like. The best score
// is kept. Learning is the point, not the mark.
//
// Progressive enhancement: without JavaScript every question is on the page with
// its right answer marked, so the check still works as a list to revise from.

import { recordResult } from './progress';

const root = document.querySelector<HTMLElement>('[data-lesson-page]');

if (root) {
  const id = root.dataset.id!;
  const learn = root.querySelector<HTMLElement>('[data-learn]')!;
  const begin = root.querySelector<HTMLButtonElement>('[data-begin]')!;
  const check = root.querySelector<HTMLElement>('[data-check]')!;
  const questions = Array.from(root.querySelectorAll<HTMLFieldSetElement>('[data-q]'));
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const result = root.querySelector<HTMLElement>('[data-result]')!;
  const score = root.querySelector<HTMLElement>('[data-score]')!;
  const retry = root.querySelector<HTMLButtonElement>('[data-retry]')!;

  const optionsOf = (q: HTMLElement) => Array.from(q.querySelectorAll<HTMLElement>('.opt'));
  const feedbackOf = (q: HTMLElement) => q.querySelector<HTMLElement>('[data-feedback]')!;

  let current = 0;
  let right = 0;

  root.classList.add('js-check');

  function reset() {
    current = 0;
    right = 0;
    for (const q of questions) {
      q.hidden = true;
      q.classList.remove('answered');
      feedbackOf(q).hidden = true;
      for (const option of optionsOf(q)) {
        option.classList.remove('chosen', 'right');
        const input = option.querySelector('input')!;
        input.checked = false;
        input.disabled = false;
      }
    }
    next.hidden = true;
  }

  function show(index: number) {
    current = index;
    const q = questions[index];
    q.hidden = false;
    q.focus();
  }

  function start() {
    reset();
    learn.hidden = begin.hidden = result.hidden = true;
    check.hidden = false;
    show(0);
  }

  function finish() {
    check.hidden = true;
    learn.hidden = result.hidden = retry.hidden = false;
    recordResult(id, right, questions.length);
    score.textContent =
      right === questions.length
        ? `All ${right} right. 太好了! (tài hǎo le, brilliant!)`
        : `${right} of ${questions.length} right first time.`;
    score.focus();
  }

  // Answering is one tap: the choice is marked at once, with the right answer if it was wrong.
  check.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    const q = input.closest<HTMLFieldSetElement>('[data-q]');
    if (!q || q.classList.contains('answered')) return;

    const options = optionsOf(q);
    const chosen = options.findIndex((option) => option.contains(input));
    const answer = Number(q.dataset.answer);
    const isRight = chosen === answer;

    q.classList.add('answered');
    options[chosen].classList.add('chosen');
    options[answer].classList.add('right');
    options.forEach((option) => (option.querySelector('input')!.disabled = true));
    if (isRight) right++;

    const feedback = feedbackOf(q);
    feedback.dataset.result = isRight ? 'right' : 'wrong';
    feedback.textContent = isRight
      ? '✓ Right.'
      : `~ Not quite. It means "${options[answer].dataset.text}".`;
    feedback.hidden = false;

    next.textContent = current === questions.length - 1 ? 'See how I did' : 'Next question';
    next.hidden = false;
  });

  next.addEventListener('click', () => {
    questions[current].hidden = true;
    next.hidden = true;
    if (current < questions.length - 1) show(current + 1);
    else finish();
  });

  begin.addEventListener('click', start);
  retry.addEventListener('click', start);

  reset();
  check.hidden = result.hidden = true;
  begin.hidden = false;
}
