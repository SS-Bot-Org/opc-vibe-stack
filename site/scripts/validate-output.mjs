import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';
import { readInventory } from '../src/lib/inventory.mjs';
import {
  SITE_ORIGIN,
  attrsOf,
  parseSrcset,
  validateImageRef,
} from '../src/lib/validate-output-lib.mjs';
import {
  inspectHtml,
  assertIndexedPageSeo,
  assertArticleSeo,
  assertHreflangReciprocal,
  assertSitemapLastmods,
} from '../src/lib/validate-seo.mjs';
import { routeLastmod } from '../src/lib/lastmod.mjs';

const root = path.resolve('dist');
const files = new Map();
async function walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(file);
    else files.set('/' + path.relative(root, file).replaceAll(path.sep, '/'), file);
  }
}
await walk(root);

const pages = new Map();
const imageRefs = [];
for (const [key, file] of files) {
  if (!key.endsWith('.html')) continue;
  const ids = new Set(), links = [];
  function visit(node) {
    const attrs = attrsOf(node);
    if (attrs.id) {
      if (ids.has(attrs.id)) throw new Error(`${key}: duplicate anchor ${attrs.id}`);
      ids.add(attrs.id);
    }
    if (attrs.href) links.push(attrs.href);
    if (node.tagName === 'img') {
      if (attrs.src) {
        imageRefs.push({
          from: key, src: attrs.src, alt: attrs.alt,
          decorative: attrs['data-decorative'] === 'true',
        });
      }
      for (const candidate of parseSrcset(attrs.srcset)) {
        imageRefs.push({
          from: key, src: candidate, alt: attrs.alt,
          decorative: attrs['data-decorative'] === 'true', fromSrcset: true,
        });
      }
    }
    for (const child of node.childNodes || []) visit(child);
  }
  visit(parse(await readFile(file, 'utf8')));
  pages.set(key, { ids, links });
}

function check(href, from) {
  const base = from.replace(/index\.html$/, '');
  const url = new URL(href, SITE_ORIGIN + base);
  if (url.origin !== SITE_ORIGIN) return;
  const key = decodeURIComponent(url.pathname) + (url.pathname.endsWith('/') ? 'index.html' : '');
  if (!files.has(key)) throw new Error(`${from}: missing output ${href}`);
  if (url.hash && !pages.get(key)?.ids.has(decodeURIComponent(url.hash.slice(1))))
    throw new Error(`${from}: missing anchor ${href}`);
}

for (const [key, page] of pages) for (const href of page.links) check(href, key);
for (const img of imageRefs) validateImageRef(img, files);

const inventory = await readInventory();
for (const { file, data } of inventory.changelog) {
  if (data.status !== 'published') continue;
  for (const change of data.changes) for (const href of change.affectedPages) {
    if (!href.startsWith('/') || href.startsWith('//')) throw new Error(`${file}: affectedPages must be local`);
    check(href, '/index.html');
  }
}
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapReport = assertSitemapLastmods(sitemap, inventory, routeLastmod);
for (const href of sitemapReport.paths) check(href, '/index.html');

const seoPages = new Map();
const seoErrors = [...sitemapReport.errors];
for (const [key, file] of files) {
  if (!key.endsWith('.html') || key === '/404.html') continue;
  const html = await readFile(file, 'utf8');
  let info;
  try {
    info = inspectHtml(html);
  } catch (error) {
    seoErrors.push(`${key}: JSON-LD or HTML inspect failed (${error.message})`);
    continue;
  }
  const route = key.replace(/index\.html$/, '');
  seoPages.set(route, info);
  if (info.noindex || !inventory.routes.has(route)) continue;
  seoErrors.push(...assertIndexedPageSeo(key, info, route));
  if (/^\/(en|zh)\/articles\//.test(route)) seoErrors.push(...assertArticleSeo(key, info));
}
const indexed = new Map([...seoPages].filter(([route, info]) => !info.noindex && inventory.routes.has(route)));
seoErrors.push(...assertHreflangReciprocal(indexed));
if (seoErrors.length) throw new Error(seoErrors.join('\n'));

console.log(`output ok: ${pages.size} HTML files, internal links/anchors, ${imageRefs.length} images, ${sitemapReport.paths.length} sitemap routes, and SEO metadata`);
