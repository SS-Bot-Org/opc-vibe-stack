import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';
import { readInventory } from './inventory.mjs';

export type Article = CollectionEntry<'articles'>;
export type ChangelogEntry = CollectionEntry<'changelog'>;

export function isPublicArticle(a: Article): boolean {
  return a.data.status === 'published' || a.data.status === 'deprecated';
}

export function isListedArticle(a: Article): boolean {
  return a.data.status === 'published';
}

export async function getPublicArticles(locale = 'en'): Promise<Article[]> {
  const all = await getCollection('articles');
  return all
    .filter((a) => a.data.locale === locale && isPublicArticle(a))
    .sort((a, b) => b.data.updated.localeCompare(a.data.updated));
}

export async function getListedArticles(locale = 'en'): Promise<Article[]> {
  const all = await getCollection('articles');
  return all
    .filter((a) => a.data.locale === locale && isListedArticle(a))
    .sort((a, b) => b.data.updated.localeCompare(a.data.updated));
}

export async function getStackCards(locale = 'en'): Promise<Article[]> {
  const listed = await getListedArticles(locale);
  const cards = listed.filter((a) => a.data.category === 'stack');
  return site.primaryToolIds
    .map((id) => cards.find((c) => c.data.toolId === id || c.data.slug === id))
    .filter((c): c is Article => Boolean(c));
}

export async function getArticlesByStage(
  stage: 'research' | 'build' | 'sell',
  locale = 'en',
): Promise<Article[]> {
  const listed = await getListedArticles(locale);
  return listed.filter(
    (a) =>
      a.data.category !== 'stack' &&
      (a.data.stage === stage || a.data.stage === 'cross'),
  );
}

export async function getPlaybooks(locale = 'en'): Promise<Article[]> {
  const listed = await getListedArticles(locale);
  return listed.filter((a) => a.data.category === 'playbook');
}

export async function getArticleBySlug(slug: string, locale = 'en'): Promise<Article | undefined> {
  const all = await getPublicArticles(locale);
  return all.find((a) => a.data.slug === slug);
}

export async function getPublishedChangelog(locale = 'en'): Promise<ChangelogEntry[]> {
  const all = await getCollection('changelog');
  return all
    .filter((e) => e.data.locale === locale && e.data.status === 'published')
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || b.data.slug.localeCompare(a.data.slug));
}

export function articleHref(slug: string, locale = 'en'): string {
  return `/${locale}/articles/${slug}/`;
}

export type SearchIndexItem = {
  title: string;
  tags: string[];
  summary: string;
  url: string;
  slug: string;
};

export async function buildSearchIndex(locale = 'en'): Promise<SearchIndexItem[]> {
  const listed = await getListedArticles(locale);
  const { routes } = await readInventory();
  // Use the same published route inventory as sitemap and alternate links.
  return listed.filter((a) => routes.has(articleHref(a.data.slug, locale))).map((a) => ({
    title: a.data.title,
    tags: a.data.tags,
    summary: a.data.summary,
    url: articleHref(a.data.slug, locale),
    slug: a.data.slug,
  }));
}

/** EN articles that lack a published zh counterpart (for zh fallback routes). */
export async function getEnArticlesMissingZh(): Promise<Article[]> {
  const en = await getPublicArticles('en');
  const zh = await getPublicArticles('zh');
  const zhSlugs = new Set(zh.map((a) => a.data.slug));
  return en.filter((a) => !zhSlugs.has(a.data.slug));
}

const NEXT_STAGE: Record<string, string> = {
  research: 'build',
  build: 'sell',
  sell: 'cross',
};

/** Select up to `limit` high-relevance companion guides in the same locale. */
export async function getRelatedArticles(
  current: Article,
  locale = 'en',
  limit = 3,
): Promise<Article[]> {
  const listed = await getListedArticles(locale);
  const currentTools = new Set(current.data.tools);
  const currentTags = new Set(current.data.tags);
  const relatedSet = new Set(current.data.notice?.relatedSlugs ?? []);
  const targetTool = current.data.toolId ?? current.data.slug;

  return listed
    .filter((cand) => cand.data.slug !== current.data.slug)
    .map((cand) => {
      let score = 0;
      if (relatedSet.has(cand.data.slug)) score += 100;
      if (current.data.category === 'stack' && cand.data.tools.includes(targetTool)) score += 30;
      if (cand.data.category === 'playbook' && current.data.category !== 'playbook') score += 22;
      if (cand.data.stage === current.data.stage) score += 20;
      if (NEXT_STAGE[current.data.stage] === cand.data.stage) score += 14;
      for (const tool of cand.data.tools) {
        if (currentTools.has(tool)) score += 10;
      }
      for (const tag of cand.data.tags) {
        if (currentTags.has(tag)) score += 8;
      }
      return { cand, score };
    })
    .sort((a, b) => b.score - a.score || b.cand.data.updated.localeCompare(a.cand.data.updated))
    .slice(0, limit)
    .map((item) => item.cand);
}
