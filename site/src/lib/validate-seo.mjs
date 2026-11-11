import { parse } from 'parse5';
import {
  TITLE_MIN, TITLE_MAX, DESC_MIN, DESC_MAX,
  isLastmodFormat, parseJsonLdBlocks, jsonLdTypes,
} from './seo.mjs';
import { SITE_ORIGIN, attrsOf } from './validate-output-lib.mjs';

function textOf(node) {
  if (!node) return '';
  if (node.nodeName === '#text') return node.value || '';
  return (node.childNodes || []).map(textOf).join('');
}

function findAll(node, pred, out = []) {
  if (pred(node)) out.push(node);
  for (const child of node.childNodes || []) findAll(child, pred, out);
  return out;
}

export function inspectHtml(html) {
  const doc = parse(html);
  const metas = {};
  for (const node of findAll(doc, (n) => n.tagName === 'meta')) {
    const attrs = attrsOf(node);
    const key = attrs.name || attrs.property;
    if (key) metas[key] = attrs.content ?? '';
  }
  const links = findAll(doc, (n) => n.tagName === 'link').map((n) => attrsOf(n));
  const canonical = links.find((a) => a.rel === 'canonical')?.href;
  const hreflang = links
    .filter((a) => a.rel === 'alternate' && a.hreflang)
    .map((a) => ({ lang: a.hreflang, href: a.href }));
  const title = textOf(findAll(doc, (n) => n.tagName === 'title')[0]).trim();
  const h1s = findAll(doc, (n) => n.tagName === 'h1').map((n) => textOf(n).trim()).filter(Boolean);
  const jsonLd = parseJsonLdBlocks(html);
  return {
    title,
    description: metas.description || '',
    robots: metas.robots || '',
    ogType: metas['og:type'] || '',
    ogImageAlt: metas['og:image:alt'] || '',
    canonical,
    hreflang,
    h1s,
    jsonLd,
    jsonLdTypes: jsonLdTypes(jsonLd),
    noindex: /\bnoindex\b/i.test(metas.robots || ''),
  };
}

export function assertIndexedPageSeo(pageKey, info, route, origin = SITE_ORIGIN) {
  const errors = [];
  const expectedCanonical = new URL(route, origin).href;
  if (info.canonical !== expectedCanonical) {
    errors.push(`${pageKey}: canonical must be self (${expectedCanonical}, got ${info.canonical || 'missing'})`);
  }
  if (info.h1s.length !== 1) {
    errors.push(`${pageKey}: expected exactly one H1, found ${info.h1s.length}`);
  }
  if (!info.title) errors.push(`${pageKey}: missing <title>`);
  else if (info.title.length < TITLE_MIN || info.title.length > TITLE_MAX) {
    errors.push(`${pageKey}: title length ${info.title.length} is outside ${TITLE_MIN}–${TITLE_MAX} (${info.title})`);
  }
  if (!info.description) errors.push(`${pageKey}: missing meta description`);
  else if (info.description.length < DESC_MIN || info.description.length > DESC_MAX) {
    errors.push(`${pageKey}: description length ${info.description.length} is outside ${DESC_MIN}–${DESC_MAX}`);
  }
  if (!info.ogImageAlt) errors.push(`${pageKey}: missing og:image:alt`);
  return errors;
}

export function assertArticleSeo(pageKey, info) {
  const errors = [];
  if (info.ogType !== 'article') errors.push(`${pageKey}: og:type must be article`);
  if (!info.jsonLdTypes.has('Article')) errors.push(`${pageKey}: missing Article JSON-LD`);
  if (!info.jsonLdTypes.has('BreadcrumbList')) errors.push(`${pageKey}: missing BreadcrumbList JSON-LD`);
  return errors;
}

export function assertHreflangReciprocal(pagesByPath) {
  const errors = [];
  for (const [path, info] of pagesByPath) {
    if (info.noindex) continue;
    const targets = info.hreflang;
    const selfLang = path.startsWith('/zh/') ? 'zh-Hans' : 'en';
    if (!targets.some((t) => t.lang === selfLang && new URL(t.href).pathname === path)) {
      errors.push(`${path}: missing self hreflang (${selfLang})`);
    }
    for (const alt of targets) {
      const altPath = new URL(alt.href).pathname;
      const other = pagesByPath.get(altPath);
      if (!other) {
        errors.push(`${path}: hreflang ${alt.lang} points to missing ${altPath}`);
        continue;
      }
      const back = other.hreflang.some((t) => new URL(t.href).pathname === path);
      if (!back) errors.push(`${path}: hreflang ${alt.lang} is not reciprocated by ${altPath}`);
    }
  }
  return errors;
}

export function assertSitemapLastmods(sitemapXml, inventory, routeLastmod) {
  const errors = [];
  const entries = [...sitemapXml.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*(?:<lastmod>(.*?)<\/lastmod>)?\s*<\/url>/g)]
    .map((m) => ({ loc: m[1], lastmod: m[2] }));
  const paths = entries.map((e) => new URL(e.loc).pathname);
  if (paths.length !== inventory.routes.size || paths.some((p) => !inventory.routes.has(p))) {
    errors.push('Sitemap must exactly match published route inventory');
  }
  for (const entry of entries) {
    const path = new URL(entry.loc).pathname;
    if (!entry.lastmod) errors.push(`${path}: sitemap missing lastmod`);
    else if (!isLastmodFormat(entry.lastmod)) errors.push(`${path}: sitemap lastmod is not W3C date (${entry.lastmod})`);
    const expected = routeLastmod(path, inventory);
    if (expected && entry.lastmod !== expected) {
      errors.push(`${path}: sitemap lastmod ${entry.lastmod} does not match source date ${expected}`);
    }
  }
  return { errors, paths };
}

export { TITLE_MIN, TITLE_MAX, DESC_MIN, DESC_MAX };
