# Illustration conventions

## Layout

- Static assets served from `site/public/illustrations/<article-slug>/`.
- Prefer shared structure; use locale-specific SVGs when labels must be translated (`*.zh.light.svg` / `*.zh.dark.svg`).
- Theme-aware diagrams ship as light/dark pairs, shown via `.theme-diagram` in article HTML.
- **No UI screenshots for now** (Fan 2026-11-09).

## Authoring

- Informative figures need a non-empty `alt` **or** a `<figcaption>` with `img alt=""` and an accessible name on the figure/`role="img"` wrapper.
- Decorative images use `alt=""` and `data-decorative="true"`.
- No external hotlinked images. No UI screenshots in this phase.

## Soft size budgets (Fan 2026-11-09)

- New illustration bytes added for one article: about **≤ 500 KB** total.
- Single screenshot source (if ever re-enabled): **≤ 400 KB**.
- Concept SVG: about **≤ 60 KB** each.

Validators: `site/scripts/validate-output.mjs` (built `img[src]` resolve + alt rules) and `site/tests/illustrations.test.mjs`.
