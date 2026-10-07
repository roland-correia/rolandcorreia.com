# 5 Minute Mandarin

Short Mandarin Chinese lessons for complete beginners. Each lesson is a handful of words with
characters, pinyin and sound, then a quick check. About five minutes each. Built with
[Astro](https://astro.build), served at `rolandcorreia.com/projects/5-minute-mandarin/`.

## Run it on your computer

You need Node 22.12 or newer (`brew install node`). Then, from this folder:

```bash
npm install     # once, to download the dependencies
npm run dev     # live preview at http://localhost:4321/projects/5-minute-mandarin/
```

Stop it with `Ctrl+C`. `npm run dev` also shows **draft** lessons.

| Command | What it does |
| --- | --- |
| `npm run dev` | Live preview while you write. Drafts are visible. |
| `npm run check` | Type-checks the code. Run it before you commit. |
| `npm run build` | Builds the real site into `dist/`. Drafts are left out. |
| `npm run preview` | Serves what `build` produced. |

## Add a lesson

1. Copy a file in `src/content/lessons/` and rename it. The file name becomes the URL
   (`colours.yaml` is `/lessons/colours/`).
2. Fill in the fields and leave `draft: true` while you work on it.
3. Run `npm run dev`, go through the lesson and take the check.
4. Check every character, pinyin spelling and tone mark against a dictionary such as
   [MDBG](https://www.mdbg.net/chinese/dictionary). Then change `draft` to `false`.
5. Commit on a new branch, open a pull request, and merge it. The site rebuilds and deploys itself.

Every lesson needs these fields, and the build **fails with a clear message** if one is missing:

| Field | What it is |
| --- | --- |
| `unit`, `order` | Which unit it sits under on the home page (see `units` in `src/lib/site.ts`), and its position in the whole course. |
| `title`, `goal` | The heading, and one line on what the learner can do afterwards. |
| `words` | Four to eight. Each has `hanzi` (simplified characters), `pinyin` (with tone marks, not numbers), `meaning` and an optional `note`. |
| `tip` | The one idea to take away, shown at the end. |
| `draft` | Whether it is still a draft. |

Every `meaning` in a lesson must be different, because the check asks the learner to pick the
right one out from the others. The build stops if two are the same.

## How it is put together

```
src/content.config.ts    the rules every lesson must follow (the schema)
src/content/lessons/     the lessons, one YAML file each
src/lib/site.ts          the name, description and units
src/lib/lessons.ts       loading lessons, and building each lesson's check
src/pages/               home, one lesson, about
src/layouts/Base.astro   the page shell, share tags, reading settings and the footer
src/components/          the wordmark, progress bar, Listen button and settings dialog
src/scripts/             lesson.ts (the check), progress.ts (saved results), progress-bar.ts,
                         speak.ts (the Listen button), settings.ts
src/styles/global.css    colours, type and layout, all in one place
```

Choices worth knowing about:

- **The check can be taken again.** It is for learning, not a test, so the best score is kept.
- **One question at a time, then the words come back.** The word list is hidden during the check so
  it is a real check, and shown again at the end.
- **The check is the same every time.** Questions and options are shuffled at build time with a
  fixed seed, so the right answer moves around but does not change between visits.
- **The check is progressive enhancement.** Without JavaScript every question is on the page with
  the right answer marked, so it reads as a revision list.
- **Pinyin can be hidden in the check** from the Aa menu, to practise reading characters.
- **Listen uses voices on the device only.** `speak.ts` skips online voices, which would send the
  text to a server, and Apple's robotic novelty voices. With no Mandarin voice the button stays hidden.
- **Nothing leaves the browser.** Results and reading settings are kept in `localStorage`. There is
  no account, no analytics and no third-party request.
- **Links use `href()`** from `src/lib/paths.ts`, so nothing hard-codes the base path.

## Before this is promoted

The lessons are first versions. The About page and footer say so. They have not been reviewed by a
Mandarin teacher. Characters, pinyin and tone sandhi notes should be checked by one.

## How it deploys

`.github/workflows/deploy.yml` (in the repo root) builds each app in `apps/`, including this one,
copies the portfolio's plain HTML files next to them, and uploads the result to GitHub Pages.
