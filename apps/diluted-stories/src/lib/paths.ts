// Builds a URL under the site's base path (/projects/diluted-stories).
// Pass paths that end in a slash for pages, e.g. href('/topics/tech/').
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(path = '/'): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

// Absolute URL, for share tags (Open Graph) that need the full address.
export function absolute(path = '/'): string {
  return new URL(href(path), 'https://rolandcorreia.com').toString();
}
