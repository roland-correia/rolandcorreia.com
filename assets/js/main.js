// The book: keeps the folio (page number) in step with the page on screen,
// opens each page's contents as it arrives, and drives the turn button.
// Everything still reads top to bottom without this script.

const pages = Array.from(document.querySelectorAll(".page"));
const current = document.getElementById("folio-current");
const total = document.getElementById("folio-total");
const turn = document.getElementById("turn");
const pad = (n) => String(n).padStart(2, "0");

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

total.textContent = pad(pages.length);
let index = 0;

function show(i) {
  index = i;
  current.textContent = pad(i + 1);
  const last = i === pages.length - 1;
  turn.classList.toggle("is-last", last);
  turn.setAttribute("aria-label", last ? "Back to the first page" : "Next page");
}

// A page counts as "open" once most of it is on screen.
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-open");
        show(pages.indexOf(entry.target));
      }
    }
  },
  { threshold: 0.55 }
);
pages.forEach((page) => observer.observe(page));

// Which page is on screen right now, worked out from the scroll position
// at the moment of the click. (The observer's index can be mid-update
// while a smooth scroll is still passing over other pages.)
function pageNow() {
  let best = 0;
  pages.forEach((page, i) => {
    if (Math.abs(page.offsetTop - window.scrollY) < Math.abs(pages[best].offsetTop - window.scrollY)) best = i;
  });
  return best;
}

turn.hidden = false;
turn.addEventListener("click", () => {
  const i = pageNow();
  const target = i === pages.length - 1 ? pages[0] : pages[i + 1];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: target.offsetTop, behavior: reduce ? "auto" : "smooth" });
});
