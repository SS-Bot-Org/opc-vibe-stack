/** Progressive enhancement: unenhanced navigation remains visible, menu button hidden. */
export function configureHeader(menu, nav, search, media) {
  function sync() {
    menu.hidden = !media.matches;
    nav.hidden = media.matches;
    menu.setAttribute('aria-expanded', String(!nav.hidden));
    search.open = !media.matches;
    search.querySelector('summary')?.setAttribute('aria-expanded', String(search.open));
  }
  sync();
  media.addEventListener('change', sync);
  menu.addEventListener('click', () => {
    if (!media.matches) return;
    nav.hidden = !nav.hidden;
    menu.setAttribute('aria-expanded', String(!nav.hidden));
  });
  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && media.matches && !nav.hidden) {
      nav.hidden = true;
      menu.setAttribute('aria-expanded', 'false');
      menu.focus();
    }
  });
  search.addEventListener('toggle', () => {
    search.querySelector('summary')?.setAttribute('aria-expanded', String(search.open));
  });
}
