import { editorialAboutUpdated } from './editorial-meta.mjs';

/**
 * Real lastmod dates for sitemap URLs. Never use the build clock.
 * Articles use frontmatter `updated`. Section pages use the latest
 * substantive date of the content they list. About uses a pinned
 * editorial-update date that must be bumped when that page changes.
 */
export function articleLastmod(data) {
  return data.updated;
}

export function latestDate(dates) {
  return dates.filter(Boolean).sort().at(-1) ?? null;
}

export function routeLastmod(route, inventory) {
  const article = /^\/(en|zh)\/articles\/([^/]+)\/$/.exec(route);
  if (article) {
    const hit = inventory.articles.find(
      (entry) => entry.data.locale === article[1] && entry.data.slug === article[2] && entry.data.status === 'published',
    );
    return hit ? articleLastmod(hit.data) : null;
  }
  const section = /^\/(en|zh)\/([^/]*)\/?$/.exec(route);
  if (!section) return null;
  const locale = section[1];
  const name = section[2] || 'home';
  const listed = inventory.articles.filter((entry) => entry.data.locale === locale && entry.data.status === 'published');
  const changelog = inventory.changelog
    .filter((entry) => entry.data.locale === locale && entry.data.status === 'published')
    .map((entry) => entry.data.date);
  const updated = (pred) => latestDate(listed.filter(pred).map((entry) => entry.data.updated));
  switch (name) {
    case 'home':
      return latestDate([...listed.map((entry) => entry.data.updated), ...changelog]);
    case 'changelog':
      return latestDate(changelog);
    case 'stack':
      return updated((entry) => entry.data.category === 'stack');
    case 'research':
    case 'build':
    case 'sell':
      return updated((entry) => entry.data.category !== 'stack' && (entry.data.stage === name || entry.data.stage === 'cross'));
    case 'playbooks':
      return updated((entry) => entry.data.category === 'playbook');
    case 'hardware':
      return updated((entry) => entry.data.slug === 'hardware-soft-split' || entry.data.tags?.includes('hardware'));
    case 'anti-patterns':
      return updated((entry) => entry.data.category === 'alert' || entry.data.slug === 'security-quickcheck');
    case 'about':
      return editorialAboutUpdated;
    default:
      return null;
  }
}
