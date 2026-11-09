import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SITE_ORIGIN,
  assertSameOriginAsset,
  validateImageRef,
  parseSrcset,
  resolveLocalPath,
} from '../src/lib/validate-output-lib.mjs';

const page = '/en/guides/rules-hooks/index.html';
const files = new Map([
  ['/illustrations/rules-hooks/five-layer-control.light.svg', '/tmp/x'],
  ['/illustrations/rules-hooks/five-layer-control.dark.svg', '/tmp/y'],
  ['/en/guides/rules-hooks/local.png', '/tmp/z'],
]);

function okImg(src, extra = {}) {
  return { from: page, src, alt: '', decorative: true, ...extra };
}

test('rejects protocol-relative, http, and https external image origins', () => {
  for (const src of [
    '//example.com/missing.svg',
    'https://example.com/x.svg',
    'http://example.com/x.svg',
    'https://evil.opcvibestack.com/x.svg',
  ]) {
    assert.throws(
      () => assertSameOriginAsset(src, page),
      /external image hotlink forbidden/,
      src,
    );
    assert.throws(
      () => validateImageRef(okImg(src), files),
      /external image hotlink forbidden/,
      src,
    );
  }
});

test('rejects data: and blob: image URLs (deliberate policy)', () => {
  assert.throws(() => assertSameOriginAsset('data:image/svg+xml,<svg></svg>', page), /data:/);
  assert.throws(() => assertSameOriginAsset('blob:https://opcvibestack.com/abc', page), /blob:/);
});

test('accepts same-origin absolute, root-relative, and page-relative paths that exist', () => {
  const cases = [
    '/illustrations/rules-hooks/five-layer-control.light.svg',
    'https://opcvibestack.com/illustrations/rules-hooks/five-layer-control.dark.svg',
    'local.png',
  ];
  for (const src of cases) {
    const url = assertSameOriginAsset(src, page);
    assert.equal(url.origin, SITE_ORIGIN);
    assert.ok(validateImageRef(okImg(src), files));
  }
});

test('missing same-origin assets still fail', () => {
  assert.throws(
    () => validateImageRef(okImg('/illustrations/missing.svg'), files),
    /missing image/,
  );
});

test('srcset candidates are parsed and validated the same way', () => {
  assert.deepEqual(parseSrcset('/a.svg 1x, //example.com/b.svg 2x'), ['/a.svg', '//example.com/b.svg']);
  assert.throws(
    () => validateImageRef(okImg('//cdn.example/x.svg', { fromSrcset: true }), files),
    /external image hotlink forbidden/,
  );
  assert.ok(validateImageRef(okImg('/illustrations/rules-hooks/five-layer-control.light.svg', { fromSrcset: true }), files));
});

test('resolveLocalPath maps trailing-slash indexes', () => {
  const map = new Map([['/en/index.html', 'f']]);
  assert.equal(resolveLocalPath('/en/', map), '/en/index.html');
  assert.equal(resolveLocalPath('/nope', map), null);
});
