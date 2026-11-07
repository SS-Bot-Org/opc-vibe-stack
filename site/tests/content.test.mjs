import test from 'node:test';
import { parse } from 'parse5';
import assert from 'node:assert/strict';
import { mkdtemp, cp, symlink, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { articleSchema, assertConditional } from '../src/lib/content-schema.mjs';
import { readInventory, alternateRoutes } from '../src/lib/inventory.mjs';
import { elements, attr, text, assertUnavailable, assertSwitchTarget, assertHeaderStructure, assertArticleNavigation } from './rendered.mjs';
const site = process.cwd();
async function fixture(run) {
  const dir = await mkdtemp(path.join(tmpdir(), 'opc-content-'));
  try {
    for (const name of ['src', 'scripts', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json'])
      await cp(path.join(site, name), path.join(dir, name), { recursive: true });
    await symlink(path.join(site, 'node_modules'), path.join(dir, 'node_modules'), 'dir');
    await run(dir);
  } finally { await rm(dir, { recursive: true, force: true }); }
}
function build(dir) {
  const result = spawnSync('npm', ['run', 'build'], { cwd: dir, encoding: 'utf8', timeout: 60000 });
  assert.equal(result.error, undefined);
  return { status: result.status, output: result.stdout + result.stderr };
}
for (const [label, mutate, diagnostic] of [
  ['quoted nonexistent changelog link', async (dir) => {
    const file = path.join(dir, 'src/content/changelog/en/2026-w45-m3.md');
    await writeFile(file, (await readFile(file, 'utf8')).replace('- /en/playbooks/', '- "/en/does-not-exist/"'));
  }, /missing output/],
  ['duplicate en\/codex loader ID', async (dir) => {
    await cp(path.join(dir, 'src/content/articles/en/codex.md'), path.join(dir, 'src/content/articles/en/codex-copy.md'));
  }, /duplicate loader ID articles\/en\/codex/],
  ['nonexistent anchor', async (dir) => {
    const file = path.join(dir, 'src/content/changelog/en/2026-w45-m3.md');
    await writeFile(file, (await readFile(file, 'utf8')).replace('- /en/playbooks/', '- "/en/playbooks/#not-a-real-anchor"'));
  }, /missing anchor/],
  ['incomplete published stack metadata', async (dir) => {
    const file = path.join(dir, 'src/content/articles/en/codex.md');
    await writeFile(file, (await readFile(file, 'utf8')).replace(/^bestFor:.*\n/m, ''));
  }, /stack requires bestFor/],
]) test(`FULL npm run build rejects ${label}`, async () => fixture(async (dir) => {
  await mutate(dir);
  const result = build(dir);
  assert.notEqual(result.status, 0, result.output);
  assert.match(result.output, diagnostic);
}));
test('draft translations are excluded from public inventory and hreflang, no invented 404 target', async () => fixture(async (dir) => {
  const file = path.join(dir, 'src/content/articles/zh/spec-first-agent-loop.md');
  await writeFile(file, (await readFile(file, 'utf8')).replace('status: published', 'status: draft'));
  const inventory = await readInventory(dir);
  const route = '/zh/articles/spec-first-agent-loop/';
  assert.ok(!inventory.routes.has(route));
  assert.deepEqual(alternateRoutes(inventory.routes, '/en/articles/spec-first-agent-loop/').map((a) => a.locale), ['en']);
  assert.deepEqual(alternateRoutes(inventory.routes, '/404/'), []);
  assert.ok(inventory.routes.has('/zh/'));
  const result = build(dir);
  assert.equal(result.status, 0, result.output);
  const html = await readFile(path.join(dir, 'dist/zh/articles/spec-first-agent-loop/index.html'), 'utf8');
  assert.match(html, /name="robots" content="noindex"/);
  assert.match(html, /rel="canonical" href="https:\/\/opcvibestack.com\/en\/articles\/spec-first-agent-loop\/"/);
  assert.ok(!html.includes('hreflang='));
  assert.ok(!(await readFile(path.join(dir, 'dist/sitemap.xml'), 'utf8')).includes(`https://opcvibestack.com${route}`));
  const enHtml = await readFile(path.join(dir, 'dist/en/articles/spec-first-agent-loop/index.html'), 'utf8');
  assertUnavailable(enHtml, /Not yet available in Chinese — read in English/);
  assert.match(enHtml, /rel="canonical" href="https:\/\/opcvibestack.com\/en\/articles\/spec-first-agent-loop\/"/);
  assert.ok(!enHtml.includes('hreflang="zh-Hans"'));
  assertHeaderStructure(enHtml);
  assertArticleNavigation(enHtml, 'en');
  assertSwitchTarget(await readFile(path.join(dir, 'dist/en/articles/codex/index.html'), 'utf8'), '/zh/articles/codex/');
  assertSwitchTarget(await readFile(path.join(dir, 'dist/en/stack/index.html'), 'utf8'), '/zh/stack/');
  assertSwitchTarget(await readFile(path.join(dir, 'dist/404.html'), 'utf8'), '/zh/');
  const index = JSON.parse(await readFile(path.join(dir, 'dist/zh/search-index.json'), 'utf8'));
  assert.ok(!index.some((item) => item.slug === 'spec-first-agent-loop'));
}));

test('shared conditional contracts preserve evidence and risk notices', async () => {
  const { articles } = await readInventory();
  const original = articles.find((entry) => entry.data.slug === 'codex').data;
  assert.throws(() => assertConditional(articleSchema.parse({ ...original, toolAvailability: 'warning' }), 'fixture'), /requires a notice/);
  assert.throws(() => assertConditional(articleSchema.parse({ ...original, evidence: 'tested' }), 'fixture'), /requires verification/);
  assert.throws(() => assertConditional(articleSchema.parse({ ...original, publicSources: [] }), 'fixture'), /requires publicSources/);
  assert.doesNotThrow(() => assertConditional(articleSchema.parse({ ...original, evidence: 'tested', verification: {
    date: '2026-11-07', environment: 'local fixture only', outcome: 'assertions passed',
  } }), 'fixture'));
});

test('rendered Chinese article with draft English counterpart preserves context and reports unavailable', async () => fixture(async (dir) => {
  for (const locale of ['en', 'zh']) {
    const source = path.join(dir, `src/content/articles/${locale}/spec-first-agent-loop.md`);
    let raw = (await readFile(source, 'utf8')).replace('slug: spec-first-agent-loop', 'slug: translation-fixture');
    if (locale === 'en') raw = raw.replace('status: published', 'status: draft');
    await writeFile(path.join(dir, `src/content/articles/${locale}/translation-fixture.md`), raw);
  }
  const result = build(dir); assert.equal(result.status, 0, result.output);
  const html = await readFile(path.join(dir, 'dist/zh/articles/translation-fixture/index.html'), 'utf8');
  assertArticleNavigation(html, 'zh');
  assertUnavailable(html, /尚无英文版 — 继续阅读中文/);
  assert.match(html, /rel="canonical" href="https:\/\/opcvibestack.com\/zh\/articles\/translation-fixture\/"/);
  assert.ok(!html.includes('hreflang="en"'));
  const sitemap = await readFile(path.join(dir, 'dist/sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('https://opcvibestack.com/en/articles/translation-fixture/'));
  assert.ok(sitemap.includes('https://opcvibestack.com/zh/articles/translation-fixture/'));
}));

test('FULL build preserves mixed Markdown task/plain lists in both article locales', async () => fixture(async (dir) => {
  for (const locale of ['en', 'zh']) {
    const file = path.join(dir, `src/content/articles/${locale}/codex.md`);
    await writeFile(file, (await readFile(file, 'utf8')) + `

## Mixed list regression

- [ ] Verify **artifact**
- Keep [previous release](/${locale}/stack/) for rollback.
  - Nested **recovery** details
- [x] Confirm manifest
`);
  }
  const result = build(dir);
  assert.equal(result.status, 0, result.output);
  for (const locale of ['en', 'zh']) {
    const doc = parse(await readFile(path.join(dir, `dist/${locale}/articles/codex/index.html`), 'utf8'));
    const list = elements(doc, (n) => n.tagName === 'ul' && text(n).includes('Verify artifact'))[0];
    assert.ok(list, 'the final rendered output retains a native mixed list');
    const items = list.childNodes.filter((n) => n.tagName === 'li');
    assert.equal(items.length, 3);
    assert.match(text(items[0]), /Verify artifact/);
    assert.match(text(items[1]), /Keep previous release for rollback/);
    assert.match(text(items[1]), /Nested recovery details/);
    assert.match(text(items[2]), /Confirm manifest/);
    assert.equal(attr(elements(items[1], (n) => n.tagName === 'a')[0], 'href'), `/${locale}/stack/`);
    assert.equal(elements(list, (n) => n.tagName === 'strong').length, 2);
    assert.equal(elements(list, (n) => n.tagName === 'input').length, 2);
    assert.equal(text(list).split('Nested recovery details').length - 1, 1);
  }
}));
