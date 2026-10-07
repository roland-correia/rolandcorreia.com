// @ts-check
import { defineConfig } from 'astro/config';

// The site is served from rolandcorreia.com/projects/5-minute-mandarin/, so every URL
// has to sit under that base path. Internal links go through href() in
// src/lib/paths.ts so they never hard-code it.
export default defineConfig({
  site: 'https://rolandcorreia.com',
  base: '/projects/5-minute-mandarin',
  trailingSlash: 'always',
  build: {
    // One small stylesheet per page: inline it so there is no render-blocking request.
    inlineStylesheets: 'always',
  },
});
