import { SITE_ORIGIN } from './editorial-meta.mjs';

export const TITLE_MIN = 10;
export const TITLE_MAX = 70;
export const DESC_MIN = 40;
export const DESC_MAX = 160;

const LASTMOD_RE = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/;

export function isLastmodFormat(value) {
  return typeof value === 'string' && LASTMOD_RE.test(value);
}

export function documentTitle(title, brand = 'OPC Vibe Stack') {
  if (!title || title === brand || title.endsWith(` · ${brand}`)) return title;
  return `${title} · ${brand}`;
}

export function toolListPhrase(names, locale = 'en') {
  if (!names.length) return locale === 'zh' ? '当前主工具' : 'Current featured tools';
  if (names.length === 1) return names[0];
  if (locale === 'zh') {
    return names.length === 2 ? names.join('与') : `${names.slice(0, -1).join('、')}与${names.at(-1)}`;
  }
  return names.length === 2 ? names.join(' & ') : `${names.slice(0, -1).join(', ')} & ${names.at(-1)}`;
}

export function stackDocumentTitle(toolNames, locale = 'en') {
  const list = toolListPhrase(toolNames, locale);
  return locale === 'zh' ? `${list}工作流对照` : `${list}: Workflow Comparison`;
}

const ARTICLE_OG = {
  '48h-mvp-agent-stack': { en: '/og/playbook-48h-mvp.png', zh: '/og/48h-mvp-agent-stack.zh.png' },
  'hardware-soft-split': { en: '/og/hardware.png', zh: '/og/hardware-soft-split.zh.png' },
  'claude-code': { en: '/og/claude-code.en.png', zh: '/og/claude-code.zh.png' },
  codex: { en: '/og/codex.en.png', zh: '/og/codex.zh.png' },
  'grok-build': { en: '/og/grok-build.en.png', zh: '/og/grok-build.zh.png' },
  'spec-first-agent-loop': { en: '/og/spec-first-agent-loop.en.png', zh: '/og/spec-first-agent-loop.zh.png' },
  'rules-hooks': { en: '/og/rules-hooks.en.png', zh: '/og/rules-hooks.zh.png' },
};

export function ogImageForArticle(slug, locale, fallback = '/og/default.png') {
  return ARTICLE_OG[slug]?.[locale] ?? ARTICLE_OG[slug]?.en ?? fallback;
}

export function ogImageAltForArticle(title, locale) {
  return locale === 'zh'
    ? `${title} — OPC Vibe Stack 指南分享图`
    : `${title} — OPC Vibe Stack guide`;
}

export function parseJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html))) {
    blocks.push(JSON.parse(match[1]));
  }
  return blocks;
}

export function jsonLdTypes(blocks) {
  const types = new Set();
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (node['@graph']) visit(node['@graph']);
    const type = node['@type'];
    if (typeof type === 'string') types.add(type);
    else if (Array.isArray(type)) type.forEach((t) => types.add(t));
  };
  blocks.forEach(visit);
  return types;
}

export function absoluteUrl(path, origin = SITE_ORIGIN) {
  return new URL(path, origin).href;
}

export function breadcrumbList(items, origin = SITE_ORIGIN) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path, origin) } : {}),
    })),
  };
}

export function articleJsonLd({
  headline, description, url, image, datePublished, dateModified, locale, authorName, authorUrl, imageAlt,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: url,
    url,
    inLanguage: locale === 'zh' ? 'zh-Hans' : 'en',
    datePublished,
    dateModified,
    author: { '@type': 'Organization', name: authorName, url: authorUrl },
    publisher: { '@type': 'Organization', name: 'OPC Vibe Stack', url: originFrom(url) },
    image: image ? [{ '@type': 'ImageObject', url: image, ...(imageAlt ? { description: imageAlt } : {}) }] : undefined,
  };
}

function originFrom(url) {
  try { return new URL(url).origin; } catch { return SITE_ORIGIN; }
}

export { SITE_ORIGIN };
