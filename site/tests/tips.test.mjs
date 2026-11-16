import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, symlink, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { tipSchema, assertTipConditional, assertTipPairing } from '../src/lib/content-schema.mjs';
import { readInventory } from '../src/lib/inventory.mjs';
import { routeLastmod } from '../src/lib/lastmod.mjs';
import { inspectHtml, assertIndexedPageSeo, assertTipsSeo, assertHreflangReciprocal } from '../src/lib/validate-seo.mjs';
import { serializeJsonLd, itemListJsonLd, breadcrumbList } from '../src/lib/seo.mjs';

const site = process.cwd();

async function fixture(run) {
  const dir = await mkdtemp(path.join(tmpdir(), 'opc-tips-'));
  try {
    for (const name of ['src', 'scripts', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json'])
      await cp(path.join(site, name), path.join(dir, name), { recursive: true });
    await symlink(path.join(site, 'node_modules'), path.join(dir, 'node_modules'), 'dir');
    await run(dir);
  } finally { await rm(dir, { recursive: true, force: true }); }
}

test('published tips are paired across en/zh with matching wording and sources', async () => {
  const inventory = await readInventory();
  const listed = inventory.tips.filter((entry) => entry.data.status !== 'draft');
  const en = listed.filter((entry) => entry.data.locale === 'en');
  const zh = listed.filter((entry) => entry.data.locale === 'zh');
  assert.equal(en.length, zh.length);
  assert.ok(en.length >= 6, `expected at least 6 listed EN tips, found ${en.length}`);
  assert.doesNotThrow(() => assertTipPairing(inventory.tips));
  const slugs = new Set(en.map((entry) => entry.data.slug));
  for (const required of [
    'say-who-owns-the-code',
    'agents-md-single-source',
    'at-mentions-bypass-hooks',
    'import-codex-dry-run',
    'doctor-prompt-audit',
    'explore-subagent-haiku',
  ]) {
    assert.ok(slugs.has(required), `missing seed tip ${required}`);
  }
  assert.ok(inventory.routes.has('/en/tips/'));
  assert.ok(inventory.routes.has('/zh/tips/'));
  assert.equal(routeLastmod('/en/tips/', inventory), '2026-11-16');
  assert.equal(routeLastmod('/zh/tips/', inventory), '2026-11-16');
});

test('documentation-backed tips require official sources and reject inverted dates', async () => {
  const { tips } = await readInventory();
  const original = tips.find((entry) => entry.data.slug === 'say-who-owns-the-code' && entry.data.locale === 'en').data;
  assert.equal(original.evidence, 'documentation-backed');
  assert.ok(original.officialSource?.url.startsWith('https://platform.claude.com/'));
  assert.throws(
    () => assertTipConditional(tipSchema.parse({ ...original, dateAdded: '2026-11-17', lastVerified: '2026-11-16' }), 'fixture'),
    /dateAdded must be on or before lastVerified/,
  );
  assert.throws(
    () => assertTipConditional(tipSchema.parse({ ...original, evidence: 'tested', verification: undefined }), 'fixture'),
    /tested evidence requires verification/,
  );
});

test('inventory rejects a listed tip that is missing its zh counterpart', async () => {
  await fixture(async (dir) => {
    await rm(path.join(dir, 'src/content/tips/zh/say-who-owns-the-code.md'));
    await assert.rejects(() => readInventory(dir), /say-who-owns-the-code must have matching en and zh entries/);
  });
});

test('inventory rejects wording that drifts between locales', async () => {
  await fixture(async (dir) => {
    const file = path.join(dir, 'src/content/tips/zh/import-codex-dry-run.md');
    const raw = await readFile(file, 'utf8');
    await writeFile(file, raw.replace('wording: claude import codex --dry-run', 'wording: claude import codex'));
    await assert.rejects(() => readInventory(dir), /import-codex-dry-run wording must match across en\/zh/);
  });
});

test('tips list SEO requires ItemList and BreadcrumbList JSON-LD', () => {
  const jsonLd = serializeJsonLd([
    itemListJsonLd({
      name: 'Vibe Coding tips',
      description: 'Short prompts, settings, flags, and commands that change how coding agents behave, each with an official source and stated limits.',
      url: 'https://opcvibestack.com/en/tips/',
      items: [{ name: 'Say who owns the code', url: 'https://opcvibestack.com/en/tips/#say-who-owns-the-code' }],
    }),
    breadcrumbList([
      { name: 'Home', path: '/en/' },
      { name: 'Tips', path: '/en/tips/' },
    ]),
  ]);
  const html = `<!doctype html><html><head>
    <title>Vibe Coding tips · OPC Vibe Stack</title>
    <meta name="description" content="Short prompts, settings, flags, and commands that change how coding agents behave, each with an official source and stated limits." />
    <link rel="canonical" href="https://opcvibestack.com/en/tips/" />
    <meta property="og:image:alt" content="Tips" />
    <link rel="alternate" hreflang="en" href="https://opcvibestack.com/en/tips/" />
    <link rel="alternate" hreflang="zh-Hans" href="https://opcvibestack.com/zh/tips/" />
    <script type="application/ld+json">${jsonLd}</script>
  </head><body><h1>Vibe Coding tips</h1></body></html>`;
  const en = inspectHtml(html);
  assert.deepEqual(assertIndexedPageSeo('/en/tips/index.html', en, '/en/tips/'), []);
  assert.deepEqual(assertTipsSeo('/en/tips/index.html', en), []);
  const zh = inspectHtml(html.replaceAll('/en/tips/', '/zh/tips/').replace('hreflang="en"', 'hreflang="zh-Hans"').replace('hreflang="zh-Hans"', 'hreflang="en"'));
  // The naive replace above is messy; build a proper zh sibling instead.
  const zhHtml = html
    .replace('Vibe Coding tips · OPC Vibe Stack', 'Vibe Coding 技巧 · OPC Vibe Stack')
    .replace('Vibe Coding tips', 'Vibe Coding 技巧')
    .replaceAll('https://opcvibestack.com/en/tips/', 'https://opcvibestack.com/zh/tips/');
  // After replacing all en tips URLs, recreate reciprocal hreflang by hand via inspect of constructed pages.
  const zhPage = inspectHtml(`<!doctype html><html><head>
    <title>Vibe Coding 技巧 · OPC Vibe Stack</title>
    <meta name="description" content="可立即使用的提示词、设置、开关与命令，用来改变编程 agent 的行为。每条都注明适用工具、官方来源和限制条件。" />
    <link rel="canonical" href="https://opcvibestack.com/zh/tips/" />
    <meta property="og:image:alt" content="技巧" />
    <link rel="alternate" hreflang="en" href="https://opcvibestack.com/en/tips/" />
    <link rel="alternate" hreflang="zh-Hans" href="https://opcvibestack.com/zh/tips/" />
    <script type="application/ld+json">${jsonLd}</script>
  </head><body><h1>Vibe Coding 技巧</h1></body></html>`);
  assert.deepEqual(assertIndexedPageSeo('/zh/tips/index.html', zhPage, '/zh/tips/'), []);
  assert.deepEqual(assertTipsSeo('/zh/tips/index.html', zhPage), []);
  const pages = new Map([['/en/tips/', en], ['/zh/tips/', zhPage]]);
  assert.deepEqual(assertHreflangReciprocal(pages), []);
  const missing = inspectHtml(`<!doctype html><html><head>
    <title>Vibe Coding tips · OPC Vibe Stack</title>
    <meta name="description" content="Short prompts, settings, flags, and commands that change how coding agents behave, each with an official source and stated limits." />
    <link rel="canonical" href="https://opcvibestack.com/en/tips/" />
    <meta property="og:image:alt" content="Tips" />
  </head><body><h1>Vibe Coding tips</h1></body></html>`);
  assert.ok(assertTipsSeo('/en/tips/index.html', missing).length > 0);
  void zh; void zhHtml;
});
