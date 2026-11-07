/** Reading enhancements keep the full article and anchor links usable without JS. */
export function enhanceArticle() {
  const article = document.querySelector<HTMLElement>('[data-article]');
  if (!article) return;
  const zh = article.dataset.locale === 'zh';
  const template = article.querySelector<HTMLTemplateElement>('[data-code-toolbar]');
  const status = article.querySelector<HTMLElement>('[data-copy-status]');
  article.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
    pre.tabIndex = 0;
    if (!template) return;
    const code = pre.querySelector('code');
    if (!code) return;
    const block = document.createElement('div');
    block.className = 'code-block';
    const toolbar = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    toolbar.querySelector('.code-language')!.textContent = pre.dataset.language ?? 'code';
    const button = toolbar.querySelector<HTMLButtonElement>('button')!;
    const label = button.querySelector('span:last-child')!;
    button.hidden = !navigator.clipboard?.writeText;
    let reset: ReturnType<typeof setTimeout>;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent ?? '');
        label.textContent = zh ? '已复制' : 'Copied';
        if (status) status.textContent = zh ? '代码已复制到剪贴板。' : 'Code copied to clipboard.';
      } catch {
        label.textContent = zh ? '请手动复制' : 'Select to copy';
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        if (status) status.textContent = zh ? '无法访问剪贴板。代码已选中，请手动复制。' : 'Clipboard unavailable. Code selected for manual copying.';
      }
      clearTimeout(reset);
      reset = setTimeout(() => { label.textContent = zh ? '复制' : 'Copy'; }, 2500);
    });
    pre.before(block);
    block.append(toolbar, pre);
  });
  const toc = document.querySelector<HTMLDetailsElement>('[data-toc]');
  if (!toc) return;
  const media = window.matchMedia('(max-width: 1199px)');
  const sync = () => { toc.open = !media.matches; };
  sync();
  media.addEventListener('change', sync);
  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
  const targets = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  links.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      const target = targets[index];
      if (!target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (media.matches) toc.open = false;
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      target.setAttribute('tabindex', '-1');
      // Wait for the mobile disclosure to collapse before measuring the destination.
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
        target.focus({ preventScroll: true });
        update();
      });
    });
  });
  let scheduled = false;
  function update() {
    let active = 0;
    const offset = (document.querySelector('header.site-header')?.getBoundingClientRect().height ?? 96) + 48;
    targets.forEach((target, index) => {
      if (target && target.getBoundingClientRect().top <= offset) active = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) active = links.length - 1;
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
}
