import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'public/illustrations');
const MAX_SVG = 60 * 1024;
const MAX_SCREENSHOT = 400 * 1024;
const MAX_ARTICLE_BUNDLE = 500 * 1024;

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch (error) {
    if (error && error.code === 'ENOENT') return out;
    throw error;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

test('illustration assets respect soft size budgets and live under public/illustrations', async () => {
  const files = await walk(root);
  assert.ok(files.length > 0, 'expected illustration files for the pilot');
  const byArticle = new Map();
  for (const file of files) {
    const rel = path.relative(root, file);
    const article = rel.split(path.sep)[0];
    const bytes = (await stat(file)).size;
    byArticle.set(article, (byArticle.get(article) || 0) + bytes);
    if (/\.svg$/i.test(file)) {
      assert.ok(bytes <= MAX_SVG, `${rel} is ${bytes} bytes (SVG budget ${MAX_SVG})`);
      const text = await readFile(file, 'utf8');
      assert.match(text, /<svg\b/, `${rel} should be SVG`);
      assert.doesNotMatch(text, /\b(?:href|xlink:href|src)=["']https?:\/\//i, `${rel} should not hotlink remote assets`);
    } else if (/\.(png|jpe?g|webp|gif)$/i.test(file)) {
      assert.ok(bytes <= MAX_SCREENSHOT, `${rel} is ${bytes} bytes (screenshot budget ${MAX_SCREENSHOT})`);
    }
  }
  for (const [article, total] of byArticle) {
    assert.ok(total <= MAX_ARTICLE_BUNDLE, `${article} illustrations total ${total} bytes (budget ${MAX_ARTICLE_BUNDLE})`);
  }
});
