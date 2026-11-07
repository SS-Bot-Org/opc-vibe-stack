import assert from 'node:assert/strict';
import { parse } from 'parse5';
export function elements(node, predicate) {
  return [...(predicate(node) ? [node] : []), ...(node.childNodes || []).flatMap((child) => elements(child, predicate))];
}
export function attr(node, key) { return node.attrs?.find((a) => a.name === key)?.value; }
export function text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join(''); }
export function switcher(html) {
  const matches = elements(parse(html), (node) => (attr(node, 'class') || '').split(' ').includes('locale-switcher'));
  assert.equal(matches.length, 1);
  return matches[0];
}
export function assertUnavailable(html, message) {
  const control = switcher(html);
  assert.equal(elements(control, (n) => n.tagName === 'a').length, 0, 'no homepage link or misleading language action');
  assert.match(text(control), message);
  assert.equal(elements(control, (n) => attr(n, 'data-translation-unavailable') !== undefined).length, 1);
}
export function assertSwitchTarget(html, href) {
  const links = elements(switcher(html), (n) => n.tagName === 'a');
  assert.deepEqual(links.map((n) => attr(n, 'href')), [href]);
}
export function assertHeaderStructure(html) {
  const doc = parse(html);
  const menu = elements(doc, (n) => attr(n, 'data-header-menu') !== undefined)[0];
  const nav = elements(doc, (n) => attr(n, 'data-header-nav') !== undefined)[0];
  const search = elements(doc, (n) => attr(n, 'data-header-search') !== undefined)[0];
  assert.equal(menu.tagName, 'button');
  assert.equal(attr(menu, 'aria-controls'), attr(nav, 'id'));
  assert.equal(attr(menu, 'hidden'), '', 'no-JS does not show an inert menu button');
  assert.equal(attr(nav, 'hidden'), undefined, 'no-JS navigation stays reachable');
  assert.equal(search.tagName, 'details', 'search has an independent native disclosure');
  assert.ok(!elements(nav, (n) => n === search || n === menu).length, 'toolbar controls are not inside the expandable menu');
  const tools = search.parentNode;
  assert.equal(nav.parentNode, tools.parentNode, 'menu and toolbar are separate flow items');
}
