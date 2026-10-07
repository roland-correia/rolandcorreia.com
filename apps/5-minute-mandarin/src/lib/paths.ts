// Builds a URL under the site's base path (/projects/5-minute-mandarin).
// Pass paths that end in a slash for pages, e.g. href('/lessons/greetings/').
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(path = '/'): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

// Absolute URL, for share tags (Open Graph) that need the full address.
export function absolute(path = '/'): string {
  return new URL(href(path), 'https://rolandcorreia.com').toString();
}
