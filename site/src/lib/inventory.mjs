import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseDocument } from 'yaml';
import { articleSchema, changelogSchema, loaderId, assertConditional } from './content-schema.mjs';

async function walk(dir) {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...await walk(file));
    else out.push(file);
  }
  return out;
}
export async function readInventory(root = process.cwd()) {
  const collections = {};
  for (const [name, schema] of [['articles', articleSchema], ['changelog', changelogSchema]]) {
    const base = path.join(root, 'src/content', name);
    const identities = new Set(), ids = new Set(), entries = [];
    for (const file of (await walk(base)).filter((f) => /\/(en|zh)\/[^/]+\.md$/.test(f))) {
      const raw = await readFile(file, 'utf8');
      const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw);
      if (!match) throw new Error(`${file}: missing YAML frontmatter`);
      const doc = parseDocument(match[1], { uniqueKeys: true });
      if (doc.errors.length) throw new Error(`${file}: ${doc.errors.join('; ')}`);
      const input = doc.toJS();
      const id = loaderId(path.relative(base, file), input);
      if (ids.has(id)) throw new Error(`${file}: duplicate loader ID ${name}/${id}`);
      ids.add(id);
      const data = schema.parse(input);
      const identity = `${data.locale}/${data.slug}`;
      if (identities.has(identity)) throw new Error(`${file}: duplicate locale/slug ${identity}`);
      identities.add(identity);
      if (path.relative(base, file).split(path.sep)[0] !== data.locale)
        throw new Error(`${file}: locale must match directory`);
      if (name === 'articles') assertConditional(data, file);
      entries.push({ file, data });
    }
    collections[name] = entries;
  }
  for (const { file, data } of collections.articles) {
    if (data.status === 'draft') continue;
    for (const slug of data.notice?.relatedSlugs || []) {
      const exists = collections.articles.some((entry) => entry.data.slug === slug && entry.data.status !== 'draft' &&
        (entry.data.locale === data.locale || entry.data.locale === 'en'));
      if (!exists) throw new Error(`${file}: notice has no public target ${slug}`);
    }
  }
  const routes = new Set();
  for (const file of await walk(path.join(root, 'src/pages'))) {
    const rel = path.relative(path.join(root, 'src/pages'), file).replaceAll(path.sep, '/');
    if (!/^(en|zh)\//.test(rel) || !rel.endsWith('.astro') || rel.includes('[')) continue;
    routes.add('/' + rel.replace(/index\.astro$/, '').replace(/\.astro$/, '/'));
  }
  for (const { data } of collections.articles)
    if (data.status === 'published') routes.add(`/${data.locale}/articles/${data.slug}/`);
  return { ...collections, routes };
}
export function alternateRoutes(routes, currentPath) {
  const suffix = currentPath.replace(/^\/(en|zh)\//, '/');
  if (!/^\/(en|zh)\//.test(currentPath)) return [];
  return ['en', 'zh'].map((locale) => ({ locale, href: `/${locale}${suffix}` }))
    .filter(({ href }) => routes.has(href));
}
