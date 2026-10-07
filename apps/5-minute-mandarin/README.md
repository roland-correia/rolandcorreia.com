# 5 Minute Mandarin

A platform for Mandarin tutors and their students, plus free five-minute practice lessons for
complete beginners. Built with [Astro](https://astro.build) and [Preact](https://preactjs.com),
served at `rolandcorreia.com/projects/5-minute-mandarin/`.

It has two parts:

- **The tutor and student app** (`/sign-in/`, `/app/`). A prototype that runs on sample data. See
  [The tutor and student app](#the-tutor-and-student-app) below.
- **Practice lessons and the blog** (`/`, `/lessons/`, `/blog/`). Static pages anyone can read.

## The tutor and student app

Sign in with any of the three buttons and pick a sample account: Li Wei is the tutor, the rest are
students. Chloe Martin is in both groups.

| Screen | Tutor | Student |
| --- | --- | --- |
| Dashboard | Month calendar on the left, lessons coming up on the right. Lessons this week, students, join requests. Connect Zoom. | The same calendar and list for their own lessons. Credit balance. Book a one-to-one. |
| Lesson card | Join on Zoom, add materials (slides, PDFs), reschedule, cancel. | Join on Zoom (the same meeting ID), open materials, message the tutor. |
| Chats | Every group and every student. Start a call. Add students. Approve or decline suggestions. | Their groups and their tutor. Suggest someone for a group, which waits for the tutor. |
| Credits / Students | Each student's balance, groups and next lesson. | Balance, buy credits, history. |

In every chat anyone can send text, photos and voice notes, and reply to a particular message. Only
the tutor can start a call. Cancelling a lesson returns one credit to every student booked on it and
"texts" them. Rescheduling texts the new time. Texts are listed under **Texts sent** until a text
service is connected.

### What is real and what is not yet

Everything is kept in the browser's `localStorage` (key `fmm-app`), so each browser has its own
copy of the sample data, and **Reset the sample data** puts it back. Photos, voice notes and files
last only until the page is reloaded.

These need a backend before launch, and are labelled in the app as not connected:

| Feature | What it needs |
| --- | --- |
| Sign in with Google, Microsoft, Apple | An auth service with those providers (for example Supabase Auth, Firebase Auth, Clerk or Auth0) |
| Shared data and live chat | A database with real-time updates, so everyone sees the same lessons and messages |
| Photos, voice notes, materials | File storage |
| Buying credits | A payment provider, such as Stripe Checkout, and a webhook that adds the credits |
| Zoom meetings | A Zoom OAuth app, so a tutor connects their account and meetings are created through the Zoom API |
| Texts on cancel or reschedule | An SMS service, such as Twilio |

GitHub Pages, where this site is hosted, can only serve static files, so it can serve the screens
but not any of the above. All the places that will call the backend are the actions in
`src/app/store.ts`, so the screens should not need to change.

```
src/app/types.ts         the shape of every record: users, lessons, chats, messages, credits, texts
src/app/seed.ts          the sample data, dated from today so the calendar is never empty
src/app/store.ts         the state and every action (cancel, reschedule, send, add member…)
src/app/App.tsx          the frame: navigation, who is signed in, texts sent, toasts
src/app/*.tsx            the screens: SignIn, Dashboard, Calendar, LessonCard, Chats, Credits
src/layouts/AppLayout.astro   the page the app runs in (client-only, not indexed)
src/styles/app.css       the app's layout, on top of global.css
```

Sample people, phone numbers and meeting IDs are made up. Phone numbers use the 07700 900xxx range,
which Ofcom keeps for drama, so none can reach a real person. Prices on the Credits screen are
placeholders.

## Practice lessons

Each lesson is a handful of words with characters, pinyin and sound, then a quick check. About
five minutes each.

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
src/pages/               home, one lesson, about, blog, sign-in and the app pages
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

## Add a blog post

Add a Markdown file to `src/content/posts/` with `title`, `summary`, `date` and `draft` at the top.
Copy an existing post to start.

## Before this is promoted

The lessons and blog posts are first versions. The About page and footer say so. They have not been
reviewed by a Mandarin teacher. Characters, pinyin and tone sandhi notes should be checked by one.
The tutor and student app is a prototype and must not be given real student data until it has a
backend with proper sign-in.

## How it deploys

`.github/workflows/deploy.yml` (in the repo root) builds each app in `apps/`, including this one,
copies the portfolio's plain HTML files next to them, and uploads the result to GitHub Pages.
