// Shows a story one card at a time, with a progress bar and Next / Previous.
//
// Progressive enhancement: without JavaScript every card is on the page, in
// order, so the story still reads top to bottom. With JavaScript, "One card at a
// time" (the default) hides all but the current card. Readers who prefer to
// scroll can switch to "Whole page" in the Aa settings.

const root = document.querySelector<HTMLElement>('[data-story]');

if (root) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-card]'));
  const progress = root.querySelector<HTMLElement>('[data-progress]')!;
  const bars = Array.from(progress.querySelectorAll('i'));
  const count = root.querySelector<HTMLElement>('[data-count]')!;
  const stepper = root.querySelector<HTMLElement>('[data-stepper]')!;
  const prev = stepper.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = stepper.querySelector<HTMLButtonElement>('[data-next]')!;
  const names = cards.map((card) => card.dataset.title ?? '');

  // A link ending in #card=the-catch opens straight on that card. The hash is
  // deliberately not a bare element id (#the-catch): the browser would treat that
  // as "scroll to this section" and skip past the header.
  const wanted = new URLSearchParams(location.hash.slice(1)).get('card');
  let index = Math.max(0, cards.findIndex((card) => card.id === wanted));

  function rememberCard() {
    const base = location.pathname + location.search;
    history.replaceState(null, '', index === 0 ? base : `${base}#card=${cards[index].id}`);
  }

  const oneAtATime = () => document.documentElement.dataset.flow !== 'page';

  function render(moveFocus = false) {
    const cardsMode = oneAtATime();
    root!.classList.toggle('js-cards', cardsMode);
    cards.forEach((card, i) => {
      card.hidden = cardsMode ? i !== index : false;
    });
    progress.hidden = stepper.hidden = !cardsMode;
    if (!cardsMode) return;

    bars.forEach((bar, i) => bar.classList.toggle('done', i <= index));
    count.textContent = `Card ${index + 1} of ${cards.length}, ${names[index]}`;
    prev.hidden = index === 0;
    next.hidden = index === cards.length - 1;
    if (index < cards.length - 1) next.textContent = `Next: ${names[index + 1]}`;
    rememberCard();

    if (moveFocus) {
      root!.scrollIntoView();
      cards[index].querySelector<HTMLElement>('h1, h2')?.focus({ preventScroll: true });
    }
  }

  next.addEventListener('click', () => {
    if (index < cards.length - 1) {
      index += 1;
      render(true);
    }
  });

  prev.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      render(true);
    }
  });

  document.addEventListener('ds:settings', () => render(false));

  render(false);
}
