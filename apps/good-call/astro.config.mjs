// @ts-check
import { defineConfig } from 'astro/config';

// The site is served from rolandcorreia.com/projects/good-call/, so every URL
// has to sit under that base path. Internal links go through href() in
// src/lib/paths.ts so they never hard-code it.
// The "Pornography and healthy sexuality" module was merged into the consent module.
// Its old addresses send people to the same questions in their new place.
const movedFromAdultContent = [
  'choosing-what-you-watch', 'every-night', 'first-phone', 'is-that-what-its-like', 'not-like-the-videos',
  'nude-going-round', 'search-history', 'second-best', 'shown-at-school', 'something-you-saw',
  'stronger-stuff', 'the-fake', 'their-viewing', 'watching-together', 'who-made-this',
];

export default defineConfig({
  site: 'https://rolandcorreia.com',
  redirects: {
    '/practice/adult-content/': '/projects/good-call/practice/consent/',
    ...Object.fromEntries(
      movedFromAdultContent.map((slug) => [
        `/practice/adult-content/${slug}/`,
        `/projects/good-call/practice/consent/${slug}/`,
      ]),
    ),
  },
  base: '/projects/good-call',
  trailingSlash: 'always',
  build: {
    // One small stylesheet per page: inline it so there is no render-blocking request.
    inlineStylesheets: 'always',
  },
});
