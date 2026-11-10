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

## Article overview diagrams

- The nine additional guides use `overview.light.svg` / `overview.dark.svg` and matching `overview.zh.*.svg` files. Their 420-unit canvas keeps labels legible in narrow article columns.
- Regenerate these assets from `site/` with `node scripts/generate-article-illustrations.mjs`. The generator contains the English/Chinese labels, layouts, and theme palettes; it does not overwrite the original rules/hooks diagram.
- Use `article-figure article-figure--overview` with the existing theme-diagram markup, explicit image dimensions, lazy loading, a localized accessible name, and an explanatory caption. Keep the adjacent tables and steps as the detailed text equivalent.
- These are editorial summaries of existing guidance, not product screenshots or fresh validation of vendor claims. Presentation-only changes do not advance article freshness dates or evidence levels.
