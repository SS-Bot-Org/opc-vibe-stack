import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFragment } from 'parse5';
import { wrapArticleTables } from '../src/lib/article-html.mjs';
import { elements, attr, text } from './rendered.mjs';

test('article tables scroll without JS while headings, links and escaped code remain intact', () => {
  const source = '<h2 id="table-example">Example</h2><pre data-language="html"><code>&lt;table&gt; &amp; &lt;/table&gt;</code></pre><table><thead><tr><th>Tool</th></tr></thead><tbody><tr><td><a href="/en/articles/codex/">Codex &amp; CLI</a></td></tr></tbody></table>';
  const doc = parseFragment(wrapArticleTables(source, '数据表格，可横向滚动'));
  const wrappers = elements(doc, (n) => attr(n, 'class') === 'table-scroll');
  assert.equal(wrappers.length, 1);
  assert.equal(attr(wrappers[0], 'tabindex'), '0');
  assert.equal(attr(wrappers[0], 'aria-label'), '数据表格，可横向滚动');
  assert.equal(elements(wrappers[0], (n) => n.tagName === 'table').length, 1);
  assert.equal(text(elements(doc, (n) => n.tagName === 'code')[0]), '<table> & </table>');
  assert.equal(attr(elements(doc, (n) => n.tagName === 'h2')[0], 'id'), 'table-example');
  assert.equal(attr(elements(doc, (n) => n.tagName === 'a')[0], 'href'), '/en/articles/codex/');
  assert.equal(text(elements(doc, (n) => n.tagName === 'td')[0]), 'Codex & CLI');
});
