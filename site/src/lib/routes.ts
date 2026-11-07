import { site, type Locale } from '../data/site';

export function localeHome(locale: Locale | string = site.defaultLocale): string {
  return `/${locale}/`;
}

export function absoluteUrl(path: string): string {
  const base = site.origin.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function withTrailingSlash(path: string): string {
  if (path.includes('#')) {
    const [p, hash] = path.split('#');
    return `${withTrailingSlash(p)}#${hash}`;
  }
  if (path.endsWith('/')) return path;
  if (/\.[a-z0-9]+$/i.test(path)) return path;
  return `${path}/`;
}

export function htmlLang(locale: Locale | string): string {
  return locale === 'zh' ? 'zh-Hans' : 'en';
}

/** Sections that exist as real translated zh pages at M3. */
export const ZH_TRANSLATED_SECTIONS = new Set(['about', 'stack']);

/** Map an English path to its preferred zh counterpart or EN fallback target. */
export function counterpartPath(path: string, targetLocale: Locale | string): string {
  const clean = path.split('#')[0].replace(/\/+$/, '') || '';
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 0) return `/${targetLocale}/`;
  const [, ...rest] = parts[0] === 'en' || parts[0] === 'zh' ? parts : ['en', ...parts];
  if (rest.length === 0) return `/${targetLocale}/`;
  const section = rest[0];
  if (targetLocale === 'zh') {
    if (section === 'about' || section === 'stack') return `/zh/${section}/`;
    if (section === 'articles' && rest[1]) {
      // Tool cards are translated; others fall back at request time
      const slug = rest[1];
      if (site.primaryToolIds.includes(slug as (typeof site.primaryToolIds)[number])) {
        return `/zh/articles/${slug}/`;
      }
      return `/zh/articles/${slug}/`; // may be fallback page
    }
    return `/zh/${rest.join('/')}/`;
  }
  return `/en/${rest.join('/')}/`;
}
