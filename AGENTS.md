# Repository Guidelines

## Project Structure & Module Organization

OPC Vibe Stack is an English-first, bilingual static Astro site. Canonical requirements live in `PRD-v0.5.md` and `SDD-v0.2.md`; read `site/AGENTS.md` for additional site guidance.

- `site/src/pages/`: routes, including `en/` and `zh/` pages and feed/search endpoints.
- `site/src/components/`, `layouts/`, and `styles/`: shared UI and global CSS.
- `site/src/content/{articles,changelog}/{en,zh}/`: Markdown content; schemas live in `site/src/content.config.ts`.
- `site/src/data/` and `lib/`: site settings, translated UI strings, and content/routing helpers.
- `site/public/`: static assets; `site/scripts/validate.mjs`: content checks; `site/ops/`: deployment examples and release records.

## Build, Test, and Development Commands

Use Node.js **22.23.4 or newer**. Run commands from `site/`:

```bash
cd site
npm ci             # Install dependencies from package-lock.json
npm run dev        # Start the local development server
npm run validate   # Check content inventory and changelog targets
npm run build      # Validate content, check schemas, generate dist/
npm run preview    # Serve the generated build locally
```

CI runs `npm ci` and `npm run build` for pull requests and pushes to `main`.

## Coding Style & Naming Conventions

Match existing code: two-space indentation, single-quoted JavaScript/TypeScript strings, and semicolons. Use PascalCase for Astro components/layouts, camelCase for functions/variables, and lowercase kebab-case for content filenames and slugs. TypeScript extends Astro's strict configuration. No formatter or linter is configured; keep formatting consistent with surrounding files.

## Testing Guidelines

There is no dedicated test framework, test-file convention, or coverage threshold. Run the build before submitting changes. For UI changes, inspect affected pages at desktop/mobile widths and exercise search, theme, and locale controls as applicable. For content/routing changes, check draft exclusion, translated links/fallbacks, and changelog targets. Add focused regression checks for meaningful failures without introducing a framework for static copy.

## Commit & Pull Request Guidelines

History is brief; the recent maintenance commit uses `chore: ...`. Prefer concise, imperative messages with an appropriate prefix, such as `fix: correct locale fallback`. Keep changes focused. PRs should describe the problem and resulting behavior, link relevant issues, report validation performed, and include screenshots for visual changes.

## Content & Configuration Safety

Use truthful evidence labels and real source permalinks. Preserve matching slugs across translations. Never commit credentials, `.env` files, or generated `dist/` output. Request VPS credentials only when deployment is explicitly requested.
