#!/usr/bin/env node
/**
 * Pre-build sanity checks (full schema runs via Astro content collections).
 */
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { readInventory } from '../src/lib/inventory.mjs';
const inventory = await readInventory();

const articlesRoot = path.resolve('src/content/articles');
const requiredTools = ['claude-code', 'codex', 'grok-build'];
const stagesNeeded = new Set(['research', 'build', 'sell']);

async function walk(dir) {
  const out = [];
  try {
    for (const ent of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) out.push(...(await walk(p)));
      else if (ent.name.endsWith('.md')) out.push(p);
    }
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  return out;
}


const files = await walk(articlesRoot);
const published = [];
for (const f of files) {
  const fm = inventory.articles.find((a) => a.file === f).data;
  fm.__file = f;
  if (fm.status === 'published' || fm.status === 'deprecated') published.push(fm);
}

const enPublished = published.filter((p) => (p.locale || 'en') === 'en');
const zhPublished = published.filter((p) => p.locale === 'zh');

const enToolCards = enPublished.filter((p) => p.category === 'stack');
for (const id of requiredTools) {
  if (!enToolCards.some((c) => c.slug === id || c.toolId === id)) {
    console.error(`Missing published EN stack card for ${id}`);
    process.exit(1);
  }
}

const zhToolCards = zhPublished.filter((p) => p.category === 'stack');
for (const id of requiredTools) {
  if (!zhToolCards.some((c) => c.slug === id || c.toolId === id)) {
    console.error(`Missing published ZH stack card for ${id}`);
    process.exit(1);
  }
  const en = enToolCards.find((c) => c.slug === id || c.toolId === id);
  const zh = zhToolCards.find((c) => c.slug === id || c.toolId === id);
  if (en?.toolAvailability && zh?.toolAvailability && en.toolAvailability !== zh.toolAvailability) {
    console.error(`toolAvailability mismatch for ${id}: en=${en.toolAvailability} zh=${zh.toolAvailability}`);
    process.exit(1);
  }
}

for (const stage of stagesNeeded) {
  const ok = enPublished.some(
    (p) => p.category !== 'stack' && (p.stage === stage || p.stage === 'cross') && p.status === 'published',
  );
  if (!ok) {
    console.error(`Missing published non-stack EN article for stage ${stage}`);
    process.exit(1);
  }
}

const playbooks = enPublished.filter((p) => p.category === 'playbook' && p.status === 'published');
if (playbooks.length < 2) {
  console.error(`Need ≥2 published EN playbooks, found ${playbooks.length}`);
  process.exit(1);
}

// Final-output link and anchor validation runs after Astro renders, not against a guessed route set.
console.log(
  `validate ok: ${published.length} public articles (${enPublished.length} en / ${zhPublished.length} zh), ${enToolCards.length} en + ${zhToolCards.length} zh stack cards, ${playbooks.length} playbooks`,
);
