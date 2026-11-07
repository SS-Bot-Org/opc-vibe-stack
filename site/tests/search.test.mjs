import test from 'node:test';
import assert from 'node:assert/strict';
import { createSearch } from '../src/lib/search.mjs';
const items = [{ title: 'Codex', summary: '', tags: [], url: '/en/articles/codex/' }, { title: 'Claude', summary: '', tags: [], url: '/en/articles/claude-code/' }];
function deferred() { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; }
test('c then codex shares one fetch and only newer query renders', async () => {
  const request = deferred(), shown = []; let calls = 0;
  const search = createSearch(() => { calls++; return request.promise; }, (items, query) => shown.push({items, query}), assert.fail);
  const first = search.update('c'), second = search.update('codex');
  request.resolve(items); await Promise.all([first, second]);
  assert.equal(calls, 1);
  assert.deepEqual(shown.filter((s) => s.query).map((s) => s.query), ['codex']);
  assert.equal(shown.at(-1).items.length, 1);
});
for (const action of ['clear', 'Escape/outside dismissal']) test(`${action} invalidates in-flight callbacks`, async () => {
  const request = deferred(), shown = [];
  const search = createSearch(() => request.promise, (_items, query) => shown.push(query), assert.fail);
  const pending = search.update('c');
  if (action === 'clear') await search.update(''); else search.dismiss();
  request.resolve(items); await pending;
  assert.equal(shown.at(-1), '');
  assert.ok(!shown.includes('c'));
});
test('failed requests retry, stale failures never override newer state', async () => {
  let calls = 0, failures = 0; const shown = [];
  const search = createSearch(() => { if (!calls++) throw new Error('offline'); return items; }, (_items, query) => shown.push(query), () => failures++);
  await search.update('c'); assert.equal(failures, 1);
  await search.update('codex'); assert.equal(calls, 2); assert.equal(shown.at(-1), 'codex');
});

test('a dismissed stale request failure is not announced', async () => {
  const request = deferred(); let failures = 0;
  const search = createSearch(() => request.promise, () => {}, () => failures++);
  const pending = search.update('c');
  search.dismiss(); request.reject(new Error('offline'));
  await pending; assert.equal(failures, 0);
});
