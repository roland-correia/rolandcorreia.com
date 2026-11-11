// A topic's deck: one card on screen at a time, like flashcards.
//
// - Move with the Next and Back buttons, by swiping left and right on a touch
//   screen, or with the arrow keys.
// - The deck opens on the first unanswered card, or on the summary if every
//   card is answered. The address keeps the current card (#card=2, or
//   #card=done), so a reload or a shared link opens the same card. It is
//   deliberately not a bare element id (#card-2): the browser would treat that
//   as "scroll to this element" and skip past the topic's heading.
// - After the last card comes a summary of the topic, which leads straight on
//   to the next topic.
// - Movement is skipped for people who ask their device for reduced motion.
//
// Without JavaScript every card is shown in order and this file does nothing.

import { readProgress, callLabels, PROGRESS_EVENT, type Call } from './progress';

const deck = document.querySelector<HTMLElement>('[data-deck]');

if (deck) setUpDeck(deck);

function setUpDeck(deck: HTMLElement) {
  const stage = deck.querySelector<HTMLElement>('[data-deck-stage]')!;
  const slides = Array.from(stage.querySelectorAll<HTMLElement>('[data-slide]'));
  const cards = slides.filter((slide) => !slide.hasAttribute('data-summary'));
  const summary = slides[slides.length - 1];
  const ids = cards.map((card) => card.querySelector<HTMLElement>('[data-scenario]')!.dataset.id!);
  const nav = deck.querySelector<HTMLElement>('[data-deck-nav]')!;
  const prev = nav.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = nav.querySelector<HTMLButtonElement>('[data-next]')!;
  const count = deck.querySelector<HTMLElement>('[data-deck-count]')!;
  const dots = Array.from(deck.querySelectorAll<HTMLElement>('[data-dot]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const marks: Record<Call, string> = { best: '✓', okay: '~', risky: '!' };

  let index = 0;

  deck.classList.add('js-deck');
  nav.hidden = false;

  // The address form of a slide: #card=1 … #card=n, then #card=done.
  const keyOf = (i: number) => (slides[i] === summary ? 'done' : String(i + 1));

  // Where to open: the card named in the address, else the first unanswered card, else the summary.
  // Both #card=2 and #card-2 (used by links that also work without JavaScript) are understood.
  function startingIndex(): number {
    const match = location.hash.match(/^#card[=-](\d+|done)$/);
    if (match) {
      if (match[1] === 'done') return slides.length - 1;
      const n = Number(match[1]) - 1;
      if (n >= 0 && n < cards.length) return n;
    }
    const progress = readProgress();
    const unanswered = ids.findIndex((id) => !progress[id]);
    return unanswered > -1 ? unanswered : slides.length - 1;
  }

  function show(target: number, direction: -1 | 0 | 1, moveFocus: boolean) {
    index = Math.max(0, Math.min(slides.length - 1, target));
    slides.forEach((slide, i) => (slide.hidden = i !== index));
    const current = slides[index];

    if (direction !== 0 && !reducedMotion.matches) {
      current.animate(
        [
          { opacity: 0, transform: `translateX(${direction * 40}px) scale(0.98)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 340, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    }

    history.replaceState(null, '', `#card=${keyOf(index)}`);
    if (current === summary) renderSummary();
    update();

    if (moveFocus) {
      // Bring the top of the deck into view, then move focus to the card's heading
      // so screen readers announce the new card.
      const top = deck.getBoundingClientRect().top;
      if (top < 0) deck.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      current.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    }
  }

  function update() {
    const progress = readProgress();
    const onSummary = slides[index] === summary;

    dots.forEach((dot, i) => {
      const answer = progress[ids[i]];
      dot.dataset.call = answer ? answer.call : '';
      dot.classList.toggle('current', i === index);
    });

    const complete = ids.every((id) => progress[id]);
    count.textContent = onSummary ? (complete ? 'Topic complete' : 'Topic summary') : `Card ${index + 1} of ${cards.length}`;

    nav.hidden = onSummary;
    prev.disabled = index === 0;
    // Read from the saved answers: the "answer saved" event arrives before the card
    // itself has finished locking.
    const answered = !onSummary && Boolean(progress[ids[index]]);
    const last = index === cards.length - 1;
    if (answered) next.textContent = last ? 'See how you did' : 'Next card';
    else next.textContent = last ? 'Skip to the summary' : 'Skip this one';
    next.classList.toggle('ghost', !answered);
  }

  function renderSummary() {
    const progress = readProgress();
    const answers = ids.map((id) => progress[id]);
    const answered = answers.filter(Boolean).length;
    const good = answers.filter((answer) => answer?.call === 'best').length;
    const score = summary.querySelector<HTMLElement>('[data-done-score]')!;

    const complete = answered === cards.length;
    summary.querySelector<HTMLElement>('[data-done-badge]')!.hidden = !complete;
    summary.querySelector<HTMLElement>('[data-done-kicker]')!.textContent = complete ? 'Topic complete' : 'Topic summary';

    if (complete) {
      score.textContent = `You made ${good} good ${good === 1 ? 'call' : 'calls'} out of ${cards.length}.`;
    } else {
      const left = cards.length - answered;
      score.textContent = `${answered} of ${cards.length} answered. ${left} ${left === 1 ? 'card is' : 'cards are'} waiting for you.`;
    }

    summary.querySelectorAll<HTMLElement>('[data-done-mark]').forEach((mark) => {
      const answer = progress[mark.dataset.id!];
      mark.dataset.call = answer ? answer.call : '';
      mark.textContent = answer ? marks[answer.call] : '';
    });
    summary.querySelectorAll<HTMLElement>('[data-done-verdict]').forEach((verdict) => {
      const answer = progress[verdict.dataset.id!];
      verdict.textContent = answer ? `Your answer: ${callLabels[answer.call]}` : 'Not answered yet';
    });
  }

  const goNext = () => index < slides.length - 1 && show(index + 1, 1, true);
  const goPrev = () => index > 0 && show(index - 1, -1, true);

  next.addEventListener('click', goNext);
  prev.addEventListener('click', goPrev);

  // Summary links jump back to a card.
  summary.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLElement>('[data-goto]');
    if (!link) return;
    event.preventDefault();
    show(Number(link.dataset.goto), -1, true);
  });

  // Arrow keys move between cards, except inside a set of answers, where they
  // already move between the options.
  deck.addEventListener('keydown', (event) => {
    if ((event.target as HTMLElement).closest('input, select, textarea, [contenteditable]')) return;
    if (event.key === 'ArrowRight') goNext();
    if (event.key === 'ArrowLeft') goPrev();
  });

  // Swiping. The page still scrolls up and down as normal (touch-action: pan-y in
  // the CSS); a mostly sideways drag moves the card with the finger, and letting
  // go past the threshold turns to the next or previous card.
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let tracking = false;
  let suppressClick = false;
  const threshold = 70;

  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    tracking = true;
    dragging = false;
    startX = event.clientX;
    startY = event.clientY;
  });

  stage.addEventListener('pointermove', (event) => {
    if (!tracking) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!dragging) {
      if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.2) {
        if (Math.abs(dy) > 12) tracking = false;
        return;
      }
      dragging = true;
      // Keep receiving the drag if the finger leaves the card. This can fail if the
      // pointer has already been released, which only means there is nothing to capture.
      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        /* nothing to capture */
      }
    }
    // Resist at either end of the deck.
    const atEnd = (dx < 0 && index === slides.length - 1) || (dx > 0 && index === 0);
    const offset = atEnd ? dx * 0.25 : dx;
    slides[index].style.transform = `translateX(${offset}px) rotate(${offset * 0.015}deg)`;
    slides[index].style.transition = 'none';
  });

  function endDrag(event: PointerEvent) {
    if (!tracking) return;
    tracking = false;
    if (!dragging) return;
    dragging = false;
    // Swallow the click that follows a drag, but only that one.
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 400);
    const dx = event.clientX - startX;
    const current = slides[index];
    current.style.transition = '';
    current.style.transform = '';
    if (dx <= -threshold && index < slides.length - 1) show(index + 1, 1, true);
    else if (dx >= threshold && index > 0) show(index - 1, -1, true);
    else if (!reducedMotion.matches) {
      current.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], {
        duration: 260,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      });
    }
  }

  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // A drag that started on an answer must not also select it.
  stage.addEventListener(
    'click',
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  // Locking in an answer changes the Next button and the progress dots.
  document.addEventListener(PROGRESS_EVENT, update);

  show(startingIndex(), 0, false);
}
