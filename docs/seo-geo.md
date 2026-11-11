# SEO and GEO rules for OPC Vibe Stack

Use this note on every weekly content pass. Technical crawl basics (HTTPS, robots, sitemap, 404, self-canonical, reciprocal hreflang, single H1) are already part of the build. The work that still matters is intent, section differentiation, evidence honesty, and accountable authorship.

These rules implement the 2026-11-10 site review. They are editorial standards, not a ranking promise.

## Implementation order

1. Fix evidence wording and bilingual alignment.
2. Clarify titles and differentiate Research / Build / Sell.
3. Keep author information and original, reproducible examples truthful.
4. Then improve URL normalization, structured data, and update signals.

## Evidence wording

- Separate official fact, editorial recommendation, and tested result in place (the same paragraph or table cell).
- Keep numbers with their conditions. Do not present an unmeasured illustration as a typical or average result.
- Chinese must not be more absolute than the English counterpart. Align qualifiers, scope, numbers, and evidence grade during bilingual review.
- Security and control-plane claims must match the layered model: permission rules and PreToolUse can block before execution; PostToolUse and Stop cannot reverse an action that already happened.
- Prefer one pinned, reproducible example over generic tool introductions. The broken-link release gate in the 48-hour playbook (`#broken-link-release-gate`) is the current model: a real commit, input, output, and limits.

## Titles, navigation, and sections

- `<title>` should say who the page is for and what problem it addresses. Localize naturally; do not translate word-for-word if a native phrase is clearer.
- Navigation labels stay short (`Stack`, `Research`, `Build`, `Sell`, and their Chinese equivalents).
- The Stack document title is derived from the current featured tools (`site.primaryToolIds` / stack cards), not a hardcoded vendor list.
- Tool cards may keep a short product-name heading; give them a descriptive `subtitle` and, when useful, a longer `seoTitle` for the document title.
- Research, Build, and Sell each need unique entry questions, deliverables, and a reading order. Cross-stage articles belong in the secondary “supplementary references” group, not in the primary list.

## Author, dates, and original evidence

- Do not invent a person’s name, credentials, or affiliation. Until a named public author is confirmed, the byline is “OPC Vibe Stack editorial team” (and the Chinese equivalent), linked to About.
- About must state that drafting may be AI-assisted, that a human reviews sources, evidence labels, and numerical claims before publication, and that corrections go to the public GitHub issues of this repository.
- `published` is the first-commit date of that article in git, recorded as `YYYY-MM-DD` in frontmatter. `updated` is the date of the last substantive guidance change. Presentation-only edits do not bump `updated`.
- Visible first-published and updated dates, the byline, and JSON-LD must all come from those real fields.

## Canonical URLs, structured data, and sitemap

- Canonical host is `https://opcvibestack.com` (apex, HTTPS, trailing slash, no `www`, no explicit `index.html`).
- `www` and explicit `index.html` should 301 to that canonical form, preserving path and query. The repo example lives in `site/ops/nginx/`; applying it on the VPS is an operator step, not a content deploy.
- Articles use `og:type=article` and emit `Article` plus `BreadcrumbList` JSON-LD that matches the visible title, dates, author, and breadcrumb path. Other pages stay `website`.
- Share images should be self-made typographic cards (see `site/scripts/generate-og-cards.py`). No AI covers and no UI screenshots. Every page needs `og:image:alt`.
- Sitemap `lastmod` comes from real substantive dates (`updated` for articles; latest listed content for section indexes; pinned `aboutUpdated` for About). Never stamp the build clock on every URL.

## Build guardrails

`npm run build` ends in `scripts/validate-output.mjs`, which now also checks, for indexed inventory routes:

- self-referencing canonical
- reciprocal hreflang (including self)
- a single H1
- title and description presence and length sanity (title 10–70, description 40–160)
- JSON-LD that parses; article pages must include `Article` and `BreadcrumbList`
- sitemap `lastmod` format and agreement with source dates

`noindex` pages (deprecated output, translation fallbacks, 404) are excluded from the indexing checks.

## Do not spend time on

- Word-count padding or rewriting to hit a fixed length
- Mechanical FAQ blocks added only for schema
- Keyword stuffing
- `llms.txt` or other special AI-only files

Google does not require those. FAQ rich results were discontinued in 2026; add an FAQ only when it actually answers a reader’s question.

## Weekly checklist

- [ ] Claims, numbers, and ZH/EN qualifiers still match the evidence grade
- [ ] New or revised titles stay intent-clear and within the length check
- [ ] `published` is unchanged; `updated` moves only for substantive guidance
- [ ] About / author / correction links remain accurate
- [ ] If About changes, bump `editorial.aboutUpdated` and `editorial-meta.mjs` together
- [ ] `npm run check`, tests, and `npm run build` (with validators) pass
