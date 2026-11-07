import { parseFragment, serialize } from 'parse5';

const CALLOUT_LABELS = {
  en: { note: 'Note', tip: 'Tip', important: 'Important', warning: 'Warning', flow: 'Workflow pipeline' },
  zh: { note: '说明', tip: '提示', important: '重要', warning: '注意', flow: '工作流管线' },
};

const CALLOUT_ICONS = {
  note: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></svg>',
  tip: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2l4 -4"/><circle cx="12" cy="12" r="9"/></svg>',
  important: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5v9l-8 4.5l-8 -4.5v-9l8 -4.5"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z"/><path d="M12 16h.01"/></svg>',
};

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getAttr(node, name) {
  return node.attrs?.find((a) => a.name === name)?.value;
}

function setAttr(node, name, value) {
  node.attrs ||= [];
  const existing = node.attrs.find((a) => a.name === name);
  if (existing) existing.value = value;
  else node.attrs.push({ name, value });
}

function hasClass(node, cls) {
  return (getAttr(node, 'class') || '').split(/\s+/).includes(cls);
}

function addClass(node, cls) {
  const current = (getAttr(node, 'class') || '').split(/\s+/).filter(Boolean);
  if (!current.includes(cls)) current.push(cls);
  setAttr(node, 'class', current.join(' '));
}

function hasInteractiveElement(nodes) {
  for (const node of nodes || []) {
    if (['a', 'button', 'input', 'select', 'textarea', 'details'].includes(node.tagName)) return true;
    if (hasInteractiveElement(node.childNodes)) return true;
  }
  return false;
}

function isEmptyParagraph(node) {
  if (node.tagName !== 'p') return false;
  return (node.childNodes || []).every(
    (c) => c.nodeName === '#text' && !c.value.trim(),
  );
}

function ensureTheadScopes(tableNode) {
  for (const child of tableNode.childNodes || []) {
    if (child.tagName !== 'thead') continue;
    for (const row of child.childNodes || []) {
      if (row.tagName !== 'tr') continue;
      for (const cell of row.childNodes || []) {
        if (cell.tagName === 'th' && !getAttr(cell, 'scope')) {
          setAttr(cell, 'scope', 'col');
        }
      }
    }
  }
}

function transformBlockquote(node, locale) {
  const firstEl = (node.childNodes || []).find((c) => c.tagName);
  if (!firstEl || firstEl.tagName !== 'p') return null;
  const firstChild = firstEl.childNodes?.[0];
  if (!firstChild || firstChild.nodeName !== '#text') return null;
  const match = firstChild.value.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|FLOW)\](?:[ \t]+([^\n]*))?(?:\n|$)/i);
  if (!match) return null;

  const kind = match[1].toLowerCase();
  const customTitle = (match[2] || '').trim();
  firstChild.value = firstChild.value.slice(match[0].length);

  const bodyChildren = (node.childNodes || []).filter((c) => !(c === firstEl && isEmptyParagraph(firstEl)));
  const dict = locale === 'zh' ? CALLOUT_LABELS.zh : CALLOUT_LABELS.en;

  if (kind === 'flow') {
    const captionText = customTitle || dict.flow;
    const figure = parseFragment(
      `<figure class="flow-diagram"><figcaption class="flow-diagram__title">${escapeHtml(captionText)}</figcaption></figure>`,
    ).childNodes[0];
    for (const child of bodyChildren) {
      if (child.tagName === 'ol' || child.tagName === 'ul') {
        addClass(child, 'flow-diagram__steps');
        setAttr(child, 'role', 'list');
      }
      child.parentNode = figure;
      figure.childNodes.push(child);
    }
    figure.parentNode = node.parentNode;
    return figure;
  }

  const baseLabel = dict[kind];
  const fullTitle = customTitle ? `${baseLabel} · ${customTitle}` : baseLabel;
  const aside = parseFragment(
    `<aside class="callout callout--${kind}" role="note"><p class="callout__title"><span class="icon callout__icon" aria-hidden="true">${CALLOUT_ICONS[kind]}</span><span>${escapeHtml(fullTitle)}</span></p><div class="callout__body"></div></aside>`,
  ).childNodes[0];
  const bodyWrap = aside.childNodes[1];
  for (const child of bodyChildren) {
    child.parentNode = bodyWrap;
    bodyWrap.childNodes.push(child);
  }
  aside.parentNode = node.parentNode;
  return aside;
}

function extractTaskItemParts(liNode) {
  const children = liNode.childNodes || [];
  const directInputIdx = children.findIndex((c) => c.tagName === 'input' && getAttr(c, 'type') === 'checkbox');
  if (directInputIdx !== -1) {
    const input = children[directInputIdx];
    const rest = children.slice(directInputIdx + 1);
    return { input, contentNodes: rest };
  }
  const firstP = children.find((c) => c.tagName === 'p');
  if (firstP) {
    const pChildren = firstP.childNodes || [];
    const pInputIdx = pChildren.findIndex((c) => c.tagName === 'input' && getAttr(c, 'type') === 'checkbox');
    if (pInputIdx !== -1) {
      const input = pChildren[pInputIdx];
      const pRest = pChildren.slice(pInputIdx + 1);
      const otherBlocks = children.filter((c) => c !== firstP);
      return { input, contentNodes: [...pRest, ...otherBlocks] };
    }
  }
  return null;
}

function transformTaskList(ulNode, locale, nextCheckId) {
  // A GFM task list may also contain ordinary items. Keep that native list
  // intact rather than dropping its prose or changing the order/semantics.
  const items = (ulNode.childNodes || []).filter((child) => child.tagName === 'li');
  const itemParts = items.map(extractTaskItemParts);
  if (!items.length || itemParts.some((parts) => !parts)) return null;

  const groupLabel = locale === 'zh' ? '可执行核对清单' : 'Actionable checklist';
  const group = parseFragment(
    `<div class="checklist" role="group" aria-label="${escapeHtml(groupLabel)}" data-checklist></div>`,
  ).childNodes[0];

  for (const parts of itemParts) {
    if (parts.contentNodes[0]?.nodeName === '#text') {
      parts.contentNodes[0].value = parts.contentNodes[0].value.replace(/^\s+/, '');
    }
    const id = `opc-check-${nextCheckId()}`;
    const isChecked = (parts.input.attrs || []).some((a) => a.name === 'checked');
    const interactive = hasInteractiveElement(parts.contentNodes);

    const itemFrag = interactive
      ? parseFragment(
          `<div class="checklist__item"><input class="checklist__input" type="checkbox" id="${id}" aria-labelledby="${id}-label"${isChecked ? ' checked' : ''}><div class="checklist__label" id="${id}-label"></div></div>`,
        )
      : parseFragment(
          `<div class="checklist__item"><input class="checklist__input" type="checkbox" id="${id}"${isChecked ? ' checked' : ''}><label class="checklist__label" for="${id}"></label></div>`,
        );

    const item = itemFrag.childNodes[0];
    const labelEl = item.childNodes[1];
    for (const contentNode of parts.contentNodes) {
      contentNode.parentNode = labelEl;
      labelEl.childNodes.push(contentNode);
    }
    item.parentNode = group;
    group.childNodes.push(item);
  }

  if (!group.childNodes.length) return null;
  group.parentNode = ulNode.parentNode;
  return group;
}

/**
 * Transform rendered Markdown HTML at build time so tables, callouts, flow diagrams,
 * and interactive checklists work cleanly both with and without client JS.
 */
export function transformArticleHtml(html, options = {}) {
  const locale = options.locale || 'en';
  const tableLabel =
    options.tableLabel ||
    (locale === 'zh' ? '数据表格，可横向滚动' : 'Data table, scroll horizontally if needed');
  let checkCounter = 0;
  const nextCheckId = () => ++checkCounter;

  const fragment = parseFragment(html);
  function visit(node) {
    if (!node.childNodes) return;
    node.childNodes = node.childNodes.map((child) => {
      if (child.tagName === 'blockquote') {
        const transformed = transformBlockquote(child, locale);
        if (transformed) {
          visit(transformed);
          return transformed;
        }
      }
      if (child.tagName === 'ul' && hasClass(child, 'contains-task-list')) {
        const checklist = transformTaskList(child, locale, nextCheckId);
        if (checklist) {
          visit(checklist);
          return checklist;
        }
      }
      visit(child);
      if (child.tagName === 'table') {
        ensureTheadScopes(child);
        const wrapper = parseFragment('<div class="table-scroll" tabindex="0" role="region"></div>').childNodes[0];
        wrapper.attrs.push({ name: 'aria-label', value: tableLabel });
        wrapper.parentNode = node;
        wrapper.childNodes = [child];
        child.parentNode = wrapper;
        return wrapper;
      }
      return child;
    });
  }
  visit(fragment);
  return serialize(fragment);
}

/** Wrap rendered article tables at build time so narrow screens also work without JS. */
export function wrapArticleTables(html, label) {
  return transformArticleHtml(html, { tableLabel: label });
}
