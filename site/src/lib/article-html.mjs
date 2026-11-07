import { parseFragment, serialize } from 'parse5';

/** Wrap rendered article tables at build time so narrow screens also work without JS. */
export function wrapArticleTables(html, label) {
  const fragment = parseFragment(html);
  function visit(node) {
    if (!node.childNodes) return;
    node.childNodes = node.childNodes.map((child) => {
      visit(child);
      if (child.tagName !== 'table') return child;
      const wrapper = parseFragment('<div class="table-scroll" tabindex="0" role="region"></div>').childNodes[0];
      wrapper.attrs.push({ name: 'aria-label', value: label });
      wrapper.parentNode = node;
      wrapper.childNodes = [child];
      child.parentNode = wrapper;
      return wrapper;
    });
  }
  visit(fragment);
  return serialize(fragment);
}
