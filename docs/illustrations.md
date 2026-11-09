# Illustration conventions

## Layout

- Static assets served from `site/public/illustrations/<article-slug>/`.
- Prefer shared concept SVGs reused by EN and ZH pages.
- Theme-aware diagrams ship as `*.light.svg` + `*.dark.svg` pairs, shown via `.theme-diagram` in article HTML.

## Authoring

- Informative figures need a non-empty `alt` **or** a `<figcaption>` with `img alt=""` and an accessible name on the figure/`role="img"` wrapper.
- Decorative images use `alt=""` and `data-decorative="true"`.
- No external hotlinked images. No fabricated UI screenshots.

## Soft size budgets (Fan 2026-11-09)

- New illustration bytes added for one article: about **≤ 500 KB** total.
- Single screenshot source: **≤ 400 KB**.
- Concept SVG: about **≤ 60 KB** each.

Validators: `site/scripts/validate-output.mjs` (built `img[src]` resolve + alt rules) and `site/tests/illustrations.test.mjs`.
