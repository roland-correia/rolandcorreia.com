# Diluted Stories

Short videos and one-page stories on tech and money research. Built with [Astro](https://astro.build),
served at `rolandcorreia.com/projects/diluted-stories/`.

## Run it on your computer

You need Node 22.12 or newer (`brew install node`). Then, from this folder:

```bash
npm install     # once, to download the dependencies
npm run dev     # live preview at http://localhost:4321/projects/diluted-stories/
```

Stop it with `Ctrl+C`. `npm run dev` also shows **draft** stories.

| Command | What it does |
| --- | --- |
| `npm run dev` | Live preview while you write. Drafts are visible. |
| `npm run check` | Type-checks the code. Run it before you commit. |
| `npm run build` | Builds the real site into `dist/`. Drafts are left out. |
| `npm run preview` | Serves what `build` produced. |

## Publish a story

1. Copy `src/content/articles/right-to-repair.md` and rename it. The file name becomes the URL
   (`my-story.md` is `/articles/my-story/`).
2. Fill in the front matter (the block between the `---` lines) and write the story under it.
3. Run `npm run dev` and read it the way a visitor will: card by card.
4. Check every claim and figure against its source. Then change `draft: true` to `draft: false`.
5. Remove the story's line from `src/data/upcoming.ts` if it was listed there.
6. Commit on a new branch, open a pull request, and merge it. The site rebuilds and deploys itself.

Every story needs these fields, and the build **fails with a clear message** if one is missing:

| Field | What it is |
| --- | --- |
| `title`, `pillar` | The headline, and `tech`, `money` or `style`. |
| `finding` | Card 1. One sentence, 20 to 180 characters. |
| `posterCaption` | The big words on the video poster. |
| `paperMinutes` | How long the paper takes to read. The page's own reading time is worked out for you. |
| `storyHeading` | The heading above card 2. The story itself is the text below the front matter. |
| `caveat` | Card 3. A `headline` and a `detail`: what the research does not show. |
| `sources` | Card 4. At least one, with title, authors, publisher, year, url and `access`. |
| `video` | Optional. `url` and `duration` (`0:58`). Adds the "Watch" link on the poster. |
| `publishedAt`, `draft` | The date, and whether it is still a draft. |

## How it is put together

```
src/content.config.ts   the rules every story must follow (the schema)
src/content/articles/   the stories, one Markdown file each
src/pages/              the pages: home, topics, one topic, one story
src/layouts/Base.astro  the page shell, share tags and reading settings
src/components/         the wordmark, video poster, minutes bar, settings dialog
src/scripts/            settings.ts (the Aa dialog) and article-cards.ts (one card at a time)
src/styles/global.css   colours, type and layout, all in one place
design/og-default.html  the source for the default share image
```

Choices worth knowing about:

- **One card at a time is progressive enhancement.** Without JavaScript the whole story is on the page.
- **Reading settings** (size, spacing, background, one card or whole page) are saved in the visitor's
  browser only. A tiny script in `Base.astro` applies them before the page paints.
- **No third-party requests.** Fonts are served from this site, and the video poster links out
  instead of embedding a player, so nothing from TikTok, Instagram or Google loads on the page.
- **Links use `href()`** from `src/lib/paths.ts`, so nothing hard-codes the `/projects/diluted-stories` base path.

## How it deploys

`.github/workflows/deploy.yml` (in the repo root) runs on every pull request, to catch problems,
and on every merge to `main`, to publish. It builds this app, copies the portfolio's plain HTML
files next to it, and uploads the result to GitHub Pages.
