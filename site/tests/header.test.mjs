import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';
import { configureHeader } from '../src/lib/header.mjs';
class Control extends EventTarget {
  hidden = false; open = false; attrs = new Map();
  setAttribute(key, value) { this.attrs.set(key, value); }
  querySelector() { return this.summary; }
}
function setup(matches) {
  const menu = new Control(), nav = new Control(), search = new Control(), media = new EventTarget();
  media.matches = matches; search.summary = new Control();
  configureHeader(menu, nav, search, media);
  return { menu, nav, search, media };
}
test('mobile Menu and Search expand independently and preserve control state', () => {
  const { menu, nav, search } = setup(true);
  assert.equal(menu.hidden, false); assert.equal(nav.hidden, true); assert.equal(search.open, false);
  menu.dispatchEvent(new Event('click'));
  assert.equal(nav.hidden, false); assert.equal(menu.attrs.get('aria-expanded'), 'true');
  search.open = true; search.dispatchEvent(new Event('toggle'));
  assert.equal(nav.hidden, false); assert.equal(search.summary.attrs.get('aria-expanded'), 'true');
  menu.dispatchEvent(new Event('click'));
  assert.equal(nav.hidden, true); assert.equal(search.open, true);
  assert.equal(menu.attrs.get('aria-expanded'), 'false');
});
test('desktop and responsive changes restore navigation and disclosure accessibility', () => {
  const { menu, nav, search, media } = setup(false);
  assert.equal(menu.hidden, true); assert.equal(nav.hidden, false); assert.equal(search.open, true);
  media.matches = true; media.dispatchEvent(new Event('change'));
  assert.equal(menu.hidden, false); assert.equal(nav.hidden, true); assert.equal(search.open, false);
  media.matches = false; media.dispatchEvent(new Event('change'));
  assert.equal(menu.hidden, true); assert.equal(nav.hidden, false); assert.equal(search.open, true);
});
test('mobile layout contract places full-width menu after entire toolbar, with no overlay panels', async () => {
  const sheet = postcss.parse(await readFile('src/styles/global.css', 'utf8'));
  const mobile = sheet.nodes.find((n) => n.type === 'atrule' && n.name === 'media' && n.params === '(max-width: 799px)');
  function declarations(selector) {
    const result = {};
    mobile.walkRules(selector, (rule) => rule.walkDecls((decl) => { result[decl.prop] = decl.value; }));
    return result;
  }
  const nav = declarations('.header-nav'), tools = declarations('.header-tools');
  assert.equal(nav.position, 'static'); assert.equal(nav['flex-basis'], '100%');
  assert.ok(Number(nav.order) > Number(tools.order));
  for (const selector of ['.header-search > .search', '.header-search .search__results'])
    assert.equal(declarations(selector).position, 'static');
  assert.equal(declarations('.header-search > .search')['min-width'], '0');
});
