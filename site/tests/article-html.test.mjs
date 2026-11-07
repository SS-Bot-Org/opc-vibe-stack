import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFragment } from 'parse5';
import { wrapArticleTables, transformArticleHtml } from '../src/lib/article-html.mjs';
import { elements, attr, text } from './rendered.mjs';

test('article tables scroll without JS while headings, links, th scopes and escaped code remain intact', () => {
  const source = '<h2 id="table-example">Example</h2><pre data-language="html"><code>&lt;table&gt; &amp; &lt;/table&gt;</code></pre><table><thead><tr><th>Tool</th></tr></thead><tbody><tr><td><a href="/en/articles/codex/">Codex &amp; CLI</a></td></tr></tbody></table>';
  const doc = parseFragment(wrapArticleTables(source, '数据表格，可横向滚动'));
  const wrappers = elements(doc, (n) => attr(n, 'class') === 'table-scroll');
  assert.equal(wrappers.length, 1);
  assert.equal(attr(wrappers[0], 'tabindex'), '0');
  assert.equal(attr(wrappers[0], 'aria-label'), '数据表格，可横向滚动');
  assert.equal(elements(wrappers[0], (n) => n.tagName === 'table').length, 1);
  assert.equal(attr(elements(wrappers[0], (n) => n.tagName === 'th')[0], 'scope'), 'col');
  assert.equal(text(elements(doc, (n) => n.tagName === 'code')[0]), '<table> & </table>');
  assert.equal(attr(elements(doc, (n) => n.tagName === 'h2')[0], 'id'), 'table-example');
  assert.equal(attr(elements(doc, (n) => n.tagName === 'a')[0], 'href'), '/en/articles/codex/');
  assert.equal(text(elements(doc, (n) => n.tagName === 'td')[0]), 'Codex & CLI');
});

test('GFM alert blockquotes and flow pipelines render semantic callouts and diagrams', () => {
  const source = [
    '<blockquote><p>[!WARNING] Evidence boundary\nClaims from social posts remain unverified.</p></blockquote>',
    '<blockquote><p>[!FLOW] 48h handoff</p><ol><li><strong>Spec</strong> — Freeze DoD</li><li><strong>Build</strong> — Green verify</li></ol></blockquote>',
  ].join('');
  const enDoc = parseFragment(transformArticleHtml(source, { locale: 'en' }));
  const callout = elements(enDoc, (n) => (attr(n, 'class') || '').includes('callout--warning'))[0];
  assert.ok(callout);
  assert.equal(attr(callout, 'role'), 'note');
  assert.match(text(callout), /Warning · Evidence boundary/);
  assert.match(text(callout), /Claims from social posts remain unverified\./);

  const flow = elements(enDoc, (n) => attr(n, 'class') === 'flow-diagram')[0];
  assert.ok(flow);
  assert.equal(text(elements(flow, (n) => n.tagName === 'figcaption')[0]), '48h handoff');
  const ol = elements(flow, (n) => n.tagName === 'ol')[0];
  assert.equal(attr(ol, 'role'), 'list');
  assert.match(attr(ol, 'class') || '', /flow-diagram__steps/);

  const zhDoc = parseFragment(
    transformArticleHtml('<blockquote><p>[!TIP]\n先跑验证命令。</p></blockquote>', { locale: 'zh' }),
  );
  assert.match(text(zhDoc), /提示/);
});

test('GFM task lists become interactive accessible checklists without nesting links in labels', () => {
  const source = [
    '<ul class="contains-task-list">',
    '<li class="task-list-item"><input type="checkbox" disabled=""> Run verify command</li>',
    '<li class="task-list-item"><input type="checkbox" disabled="" checked=""> Open <a href="/en/stack/">Stack</a></li>',
    '</ul>',
  ].join('');
  const doc = parseFragment(transformArticleHtml(source, { locale: 'en' }));
  const group = elements(doc, (n) => attr(n, 'class') === 'checklist')[0];
  assert.ok(group);
  assert.equal(attr(group, 'role'), 'group');
  const inputs = elements(group, (n) => n.tagName === 'input');
  assert.equal(inputs.length, 2);
  assert.equal(attr(inputs[0], 'disabled'), undefined, 'checkboxes are interactive without JS');
  assert.equal(attr(inputs[0], 'id'), 'opc-check-1');
  const labels = elements(group, (n) => n.tagName === 'label');
  assert.equal(labels.length, 1, 'only link-free items use <label>; link items use aria-labelledby');
  assert.equal(attr(labels[0], 'for'), 'opc-check-1');
  assert.equal(attr(inputs[1], 'aria-labelledby'), 'opc-check-2-label');
});


test('mixed task/plain lists retain native list order, nested prose, formatting and links', () => {
  for (const locale of ['en', 'zh']) {
    const source = '<ul class="contains-task-list"><li>Before <em>all</em> tasks</li><li class="task-list-item"><p><input type="checkbox" disabled> Verify <strong>artifact</strong></p><p>Keep this explanation.</p></li><li>Keep <a href="/en/stack/">previous release</a><ul><li>Nested recovery details</li></ul></li><li class="task-list-item"><input type="checkbox" disabled checked> Confirm manifest</li></ul>';
    const doc = parseFragment(transformArticleHtml(source, { locale }));
    const list = elements(doc, (n) => n.tagName === 'ul')[0];
    assert.ok(list, 'a mixed list keeps its native list semantics');
    const items = list.childNodes.filter((n) => n.tagName === 'li');
    assert.deepEqual(items.map((item) => text(item).trim()), ['Before all tasks', 'Verify artifactKeep this explanation.', 'Keep previous releaseNested recovery details', 'Confirm manifest']);
    assert.equal(elements(doc, (n) => n.tagName === 'strong').length, 1);
    assert.equal(elements(doc, (n) => n.tagName === 'em').length, 1);
    assert.equal(attr(elements(doc, (n) => n.tagName === 'a')[0], 'href'), '/en/stack/');
    assert.equal(elements(doc, (n) => n.tagName === 'input').length, 2);
    assert.equal(elements(doc, (n) => attr(n, 'data-checklist') !== undefined).length, 0);
    assert.equal(elements(doc, (n) => n.tagName === 'label').length, 0);
    assert.equal(text(doc).split('Nested recovery details').length - 1, 1);
  }
});
