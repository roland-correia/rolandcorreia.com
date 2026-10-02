# Good Call

Practice for judgement: short scenarios on consent and on situations at work. You choose what you
would do, then see why each choice helps or harms. Built with [Astro](https://astro.build), served at
`rolandcorreia.com/projects/good-call/`.

## Run it on your computer

You need Node 22.12 or newer (`brew install node`). Then, from this folder:

```bash
npm install     # once, to download the dependencies
npm run dev     # live preview at http://localhost:4321/projects/good-call/
```

Stop it with `Ctrl+C`. `npm run dev` also shows **draft** scenarios.

| Command | What it does |
| --- | --- |
| `npm run dev` | Live preview while you write. Drafts are visible. |
| `npm run check` | Type-checks the code. Run it before you commit. |
| `npm run build` | Builds the real site into `dist/`. Drafts are left out. |
| `npm run preview` | Serves what `build` produced. |

## Add a scenario

1. Copy a file in a folder under `src/content/scenarios/` (`consent/`, `racism/`, `adult-content/`,
   `interview/`, `administrator/`, `customer-service/`) and rename it. The file name becomes the URL (`my-scenario.yaml` is
   `/practice/consent/my-scenario/`).
2. Fill in the fields and leave `draft: true` while you work on it.
3. Run `npm run dev` and answer it the way a visitor will. Check every option, not just the best one.
4. Check any fact or law it mentions against the source. Then change `draft` to `false`.
5. Commit on a new branch, open a pull request, and merge it. The site rebuilds and deploys itself.

Every scenario needs these fields, and the build **fails with a clear message** if one is missing:

| Field | What it is |
| --- | --- |
| `set`, `order` | Which set it belongs to (the folder name, such as `consent` or `interview`) and its position in it. |
| `category` | For sets with sections (all except `customer-service`): which section it sits under. `order` then sorts within that section. |
| `title`, `topic` | The heading, and the skill or theme shown as a small label. |
| `situation` | What is happening. Leave a blank line between paragraphs. |
| `question` | Optional. Defaults to "What is the best call?". Interview questions use "Which answer works best?". |
| `options` | Three or four. Each has `text`, `call` and `why`. Exactly one must be `call: best`. |
| `principle` | The idea to take away, shown once the best answer is found. |
| `draft` | Whether it is still a draft. |

`call` is the verdict: `best` (Good call), `okay` (Could be better) or `risky` (Not the best call).
`why` is the feedback, and every option must have one, including the best. Vary which position the
best answer sits in.

The categories for each set are listed in `categories` in `src/lib/site.ts`. Their order there is
the order on the page. To add one, add a line there and use its name in a scenario. A set with no
categories is shown as one list.

## Add a role

1. Add the role to `sets` in `src/lib/site.ts` with `group: 'work'`, an `intro`, a `note`, its
   `rules` and `live: true`. Roles marked `live: false` show on `/work/` as "Coming later".
2. Add its name to the `set` list in `src/content.config.ts`.
3. Create `src/content/scenarios/<role>/` and add scenarios to it.

## How it is put together

```
src/content.config.ts    the rules every scenario must follow (the schema)
src/content/scenarios/   the scenarios, one YAML file each, in a folder per set
src/lib/site.ts          the sets (consent and each work role), their categories and the three verdicts
src/pages/               home, the role picker, a set, one scenario, about
src/layouts/Base.astro   the page shell, share tags and reading settings
src/components/          the wordmark, scenario tile, progress bar, settings dialog and support links
src/scripts/             scenario.ts (lock in an answer), progress.ts (saved answers), progress-bar.ts,
                         set-progress.ts, settings.ts
src/styles/global.css    colours, type and layout, all in one place
```

Choices worth knowing about:

- **No timer, but one go.** Visitors can take as long as they like, then lock in an answer. A locked
  answer cannot be changed, on that visit or a later one, so it is their real first judgement.
  They can still read the reasons for the other answers afterwards.
- **Three verdicts, not right and wrong.** Each has a label and a mark, so it never depends on colour.
- **The quiz is progressive enhancement.** Without JavaScript every reason is on the page, so each
  scenario reads as a worked example.
- **Nothing leaves the browser.** Answers and reading settings are kept in `localStorage`. There is
  no account, no analytics and no third-party request.
- **Progress is saved and shown as a bar** on the home page, each set's page and each scenario.
  "Clear my answers and start this set again" on a set's page is the only way to answer again.
- **Links use `href()`** from `src/lib/paths.ts`, so nothing hard-codes the `/projects/good-call` base path.

## Before this is promoted

The scenarios are first versions. The About page says so. They have not been reviewed by a consent
educator, a lawyer or a recruiter. The legal points (capacity to consent, sleep, agreed conditions,
sending and sharing intimate images, reporting a data breach) describe the law in England and Wales
and should be re-checked before each is relied on.

## How it deploys

`.github/workflows/deploy.yml` (in the repo root) runs on every pull request, to catch problems,
and on every merge to `main`, to publish. It builds each app in `apps/`, copies the portfolio's
plain HTML files next to them, and uploads the result to GitHub Pages.
