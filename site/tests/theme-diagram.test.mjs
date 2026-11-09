import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import {
  specificity,
  specificityGreaterOrEqual,
} from '../src/lib/validate-output-lib.mjs';

const cssPath = path.resolve('src/styles/global.css');
const chromeBin = process.env.CHROME_BIN
  || ['/usr/bin/google-chrome-stable', '/usr/bin/google-chrome', '/usr/bin/chromium']
    .find((p) => {
      try { return spawnSync(p, ['--version'], { encoding: 'utf8' }).status === 0; }
      catch { return false; }
    });

function dumpCascade(htmlPath) {
  const result = spawnSync(chromeBin, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--dump-dom',
    `file://${htmlPath}`,
  ], { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024, timeout: 30000 });
  assert.equal(result.status, 0, result.stderr || 'chrome failed');
  const match = /data-cascade="([^"]+)"/.exec(result.stdout);
  assert.ok(match, 'expected data-cascade attribute from headless Chrome dump-dom');
  return JSON.parse(match[1].replace(/&quot;/g, '"'));
}

test('theme-diagram hide selectors beat .article-figure img on specificity', async () => {
  const css = await readFile(cssPath, 'utf8');
  const base = '.article-figure img';
  const required = [
    '.article-figure img.theme-diagram__dark',
    "html[data-theme='dark'] .article-figure img.theme-diagram__light",
    "html[data-theme='dark'] .article-figure img.theme-diagram__dark",
  ];
  for (const sel of required) {
    assert.ok(css.includes(sel), `expected selector present: ${sel}`);
    assert.ok(
      specificityGreaterOrEqual(specificity(sel), specificity(base)),
      `${sel} (${specificity(sel)}) must beat ${base} (${specificity(base)})`,
    );
  }
  // The original bug was a low-specificity display:none rule.
  assert.equal(
    /^\.theme-diagram__dark\s*\{\s*display:\s*none/m.test(css),
    false,
    'standalone .theme-diagram__dark { display:none } would lose to .article-figure img',
  );
});

test('Chrome computed styles: light hides dark variant and dark hides light', async (t) => {
  if (!chromeBin) {
    t.skip('no Chromium/Chrome binary on PATH for computed-style check');
    return;
  }
  const css = await readFile(cssPath, 'utf8');
  const dir = await mkdtemp(path.join(tmpdir(), 'opc-theme-diagram-'));
  const htmlPath = path.join(dir, 'fixture.html');
  try {
    await writeFile(htmlPath, `<!doctype html>
<html data-theme="light">
<head><meta charset="utf-8"><style>${css}</style></head>
<body>
<figure class="article-figure">
  <div class="theme-diagram" role="img" aria-label="fixture">
    <img class="theme-diagram__light" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" width="20" height="10" />
    <img class="theme-diagram__dark" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" width="20" height="10" />
  </div>
</figure>
<script>
function snap(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  return {
    theme,
    light: getComputedStyle(document.querySelector('.theme-diagram__light')).display,
    dark: getComputedStyle(document.querySelector('.theme-diagram__dark')).display,
  };
}
document.body.setAttribute('data-cascade', JSON.stringify({
  lightMode: snap('light'),
  darkMode: snap('dark'),
}));
</script>
</body></html>`);

    const cascade = dumpCascade(htmlPath);
    assert.deepEqual(cascade.lightMode, { theme: 'light', light: 'block', dark: 'none' });
    assert.deepEqual(cascade.darkMode, { theme: 'dark', light: 'none', dark: 'block' });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('Chrome proves the old low-specificity hide rules lose to .article-figure img', async (t) => {
  if (!chromeBin) {
    t.skip('no Chromium/Chrome binary on PATH');
    return;
  }
  const dir = await mkdtemp(path.join(tmpdir(), 'opc-theme-diagram-bug-'));
  const htmlPath = path.join(dir, 'fixture.html');
  try {
    await writeFile(htmlPath, `<!doctype html>
<html data-theme="light">
<head><style>
.article-figure img { display: block; width: 100%; }
/* Original PR bug: (0,1,0) loses to .article-figure img (0,1,1) */
.theme-diagram__dark { display: none; }
html[data-theme='dark'] .theme-diagram__light { display: none; }
html[data-theme='dark'] .theme-diagram__dark { display: block; }
</style></head>
<body>
<figure class="article-figure"><div class="theme-diagram">
<img class="theme-diagram__light" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="10" height="10" />
<img class="theme-diagram__dark" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="10" height="10" />
</div></figure>
<script>
function snap(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  return {
    theme,
    light: getComputedStyle(document.querySelector('.theme-diagram__light')).display,
    dark: getComputedStyle(document.querySelector('.theme-diagram__dark')).display,
  };
}
document.body.setAttribute('data-cascade', JSON.stringify({ lightMode: snap('light'), darkMode: snap('dark') }));
</script>
</body></html>`);
    const cascade = dumpCascade(htmlPath);
    assert.equal(cascade.lightMode.light, 'block');
    assert.equal(cascade.lightMode.dark, 'block', 'old selectors incorrectly leave dark variant visible in light mode');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
