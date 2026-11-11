import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  documentTitle, stackDocumentTitle, toolListPhrase,
  isLastmodFormat, parseJsonLdBlocks, jsonLdTypes,
} from '../src/lib/seo.mjs';
import { routeLastmod } from '../src/lib/lastmod.mjs';
import { inspectHtml, assertIndexedPageSeo, assertArticleSeo, assertHreflangReciprocal } from '../src/lib/validate-seo.mjs';
import { readInventory } from '../src/lib/inventory.mjs';

test('document titles do not double the brand', () => {
  assert.equal(documentTitle('OPC Vibe Stack'), 'OPC Vibe Stack');
  assert.equal(documentTitle('About · OPC Vibe Stack'), 'About · OPC Vibe Stack');
  assert.equal(documentTitle('Research'), 'Research · OPC Vibe Stack');
});

test('stack titles derive from the current featured tool names', () => {
  const names = ['Claude Code', 'Codex', 'Grok Build'];
  assert.equal(stackDocumentTitle(names, 'en'), 'Claude Code, Codex & Grok Build: Workflow Comparison');
  assert.equal(stackDocumentTitle(names, 'zh'), 'Claude Code、Codex与Grok Build工作流对照');
  assert.equal(toolListPhrase(['Codex'], 'en'), 'Codex');
  assert.match(stackDocumentTitle(['New Tool', 'Codex'], 'en'), /^New Tool & Codex:/);
});

test('lastmod uses source dates, never the build clock', async () => {
  const inventory = await readInventory();
  const todayStamp = new Date().toISOString();
  for (const route of inventory.routes) {
    const lastmod = routeLastmod(route, inventory);
    assert.ok(lastmod, `missing lastmod for ${route}`);
    assert.ok(isLastmodFormat(lastmod), lastmod);
    assert.notEqual(lastmod, todayStamp);
    assert.doesNotMatch(lastmod, /T\d{2}:\d{2}:\d{2}/);
  }
  const article = inventory.articles.find((e) => e.data.slug === 'codex' && e.data.locale === 'en');
  assert.equal(routeLastmod('/en/articles/codex/', inventory), article.data.updated);
  assert.equal(article.data.published, '2026-11-06');
  assert.ok(article.data.published <= article.data.updated);
});

test('SEO inspect validates canonical, hreflang reciprocity, JSON-LD and article type', () => {
  const en = inspectHtml(`<!doctype html><html><head>
    <title>Codex: From Task Specs to Verifiable Code Changes · OPC Vibe Stack</title>
    <meta name="description" content="OpenAI’s spec-driven coding agent and CLI for scoped repository slices, batchable edits, and clean diffs." />
    <link rel="canonical" href="https://opcvibestack.com/en/articles/codex/" />
    <meta property="og:type" content="article" />
    <meta property="og:image:alt" content="Codex guide" />
    <link rel="alternate" hreflang="en" href="https://opcvibestack.com/en/articles/codex/" />
    <link rel="alternate" hreflang="zh-Hans" href="https://opcvibestack.com/zh/articles/codex/" />
    <script type="application/ld+json">{"@graph":[{"@type":"Article","headline":"Codex"},{"@type":"BreadcrumbList"}]}</script>
  </head><body><h1>Codex</h1></body></html>`);
  const zh = inspectHtml(`<!doctype html><html><head>
    <title>Codex 实战：从任务规格到可验证的代码改动 · OPC Vibe Stack</title>
    <meta name="description" content="OpenAI 面向规格驱动任务的编码 agent 与 CLI，擅长边界清晰的单切片执行、批处理修改与干净 diff。" />
    <link rel="canonical" href="https://opcvibestack.com/zh/articles/codex/" />
    <meta property="og:type" content="article" />
    <meta property="og:image:alt" content="Codex 指南" />
    <link rel="alternate" hreflang="en" href="https://opcvibestack.com/en/articles/codex/" />
    <link rel="alternate" hreflang="zh-Hans" href="https://opcvibestack.com/zh/articles/codex/" />
    <script type="application/ld+json">{"@type":"Article"}</script>
    <script type="application/ld+json">{"@type":"BreadcrumbList"}</script>
  </head><body><h1>Codex</h1></body></html>`);
  assert.deepEqual(assertIndexedPageSeo('/en/articles/codex/index.html', en, '/en/articles/codex/'), []);
  assert.deepEqual(assertArticleSeo('/en/articles/codex/index.html', en), []);
  assert.ok(en.jsonLdTypes.has('Article') && en.jsonLdTypes.has('BreadcrumbList'));
  const pages = new Map([['/en/articles/codex/', en], ['/zh/articles/codex/', zh]]);
  assert.deepEqual(assertHreflangReciprocal(pages), []);
  const broken = inspectHtml(`<!doctype html><html><head>
    <title>Short</title><meta name="description" content="too short" />
    <link rel="canonical" href="https://example.com/wrong" />
    <meta property="og:type" content="website" />
  </head><body><h1>A</h1><h1>B</h1></body></html>`);
  assert.ok(assertIndexedPageSeo('/en/articles/codex/index.html', broken, '/en/articles/codex/').length > 0);
  assert.ok(assertArticleSeo('/x', broken).length > 0);
});

test('malformed JSON-LD is rejected', () => {
  assert.throws(() => parseJsonLdBlocks('<script type="application/ld+json">{not json}</script>'));
  assert.deepEqual([...jsonLdTypes(parseJsonLdBlocks('<script type="application/ld+json">{"@type":["Article","NewsArticle"]}</script>'))].sort(), ['Article', 'NewsArticle']);
});

test('nginx example 301s www and explicit index.html, preserving path and query', async () => {
  const conf = await readFile(path.resolve('ops/nginx/opcvibestack.conf.example'), 'utf8');
  assert.match(conf, /server_name www\.opcvibestack\.com;/);
  assert.match(conf, /return 301 https:\/\/opcvibestack\.com\$request_uri;/);
  assert.match(conf, /location = \/index\.html/);
  assert.match(conf, /location ~\* \^\(\.\+\)\/index\\.html\$/);
  assert.match(conf, /return 301 \$1\/\$is_args\$args;/);
  const readme = await readFile(path.resolve('ops/nginx/README.md'), 'utf8');
  assert.match(readme, /Do \*\*not\*\* apply this file from a content pull request/i);
});
