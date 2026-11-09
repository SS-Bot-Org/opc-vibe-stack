import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const articlesRoot = path.join(process.cwd(), 'src/content/articles');
const fence = /^```(json|jsonc)\s*\n([\s\S]*?)^```/gm;

async function articleMarkdownFiles(dir = articlesRoot, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await articleMarkdownFiles(full, out);
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

test('every ```json fence in article content is strict JSON.parse-able', async () => {
  const files = await articleMarkdownFiles();
  assert.ok(files.length > 0, 'expected article markdown files');
  const failures = [];
  let checked = 0;
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    for (const match of text.matchAll(fence)) {
      const lang = match[1];
      const body = match[2];
      const line = text.slice(0, match.index).split('\n').length;
      // ```jsonc may intentionally include comments; skip those only.
      if (lang === 'jsonc') continue;
      checked += 1;
      try {
        JSON.parse(body);
      } catch (error) {
        failures.push(`${path.relative(process.cwd(), file)}:${line}: ${error.message}`);
      }
    }
  }
  assert.ok(checked > 0, 'expected at least one ```json fence in articles');
  assert.deepEqual(failures, [], failures.join('\n'));
});
