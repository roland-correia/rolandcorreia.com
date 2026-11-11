// @ts-check
import { defineConfig } from 'astro/config';

// The site is served from rolandcorreia.com/projects/good-call/, so every URL
// has to sit under that base path. Internal links go through href() in
// src/lib/paths.ts so they never hard-code it.
export default defineConfig({
  site: 'https://rolandcorreia.com',
  base: '/projects/good-call',
  trailingSlash: 'always',
  // The development toolbar sits over the bottom of the screen, where the flashcard
  // buttons are. It only ever appears in `npm run dev`, never on the live site.
  devToolbar: { enabled: false },
  build: {
    // One small stylesheet per page: inline it so there is no render-blocking request.
    inlineStylesheets: 'always',
  },
});
