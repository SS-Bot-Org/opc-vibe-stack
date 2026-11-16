# Adding Tips

Use this note when the weekly Vibe Coding pass finds a small, immediately usable tip: one prompt sentence, setting, flag, command, or habit that changes agent behavior.

The public list is a bilingual collection at `/en/tips/` and `/zh/tips/` (this site’s URL convention; English pages live under `/en/`, not at the domain root). Tips are rendered on that list page with stable anchors `/en/tips/#slug` and `/zh/tips/#slug`. They do not get their own article routes. Follow [seo-geo.md](seo-geo.md) for evidence wording, dates, bylines, and title/description length.

## Schema

Markdown files live in `site/src/content/tips/{en,zh}/<slug>.md`. Required frontmatter:

| Field | Notes |
| --- | --- |
| `title` | Intent-clear, localized. Not a keyword list. |
| `slug` | Lowercase kebab-case. Must match across `en` and `zh`, and should match the filename. |
| `summary` | 1–160 characters. Used in search and ItemList JSON-LD. |
| `locale` | `en` or `zh`, and it must match the directory. |
| `tools` | IDs such as `claude-code`, `codex`, `grok-build`, `claude-fable`. Same list in both locales, same order. |
| `appliesTo` | Localized tool, version, or model scope. |
| `tags` | Optional extra search terms. |
| `evidence` | `tested`, `documentation-backed`, or `unverified` — the same labels as articles. |
| `wording` | The exact prompt, flag, or command to copy. Must be identical in `en` and `zh`. Do not put a line that is only `---` inside frontmatter; it would end the YAML block. |
| `wordingLang` | `text`, `bash`, `yaml`, or `markdown`. |
| `effect` | What the tip changes. |
| `limits` | Conditions, version floors, exceptions, and what this site has not measured. |
| `officialSource` | `{ title, url, kind }` for the official doc or vendor source. Required for listed tips. |
| `discoverySource` | Optional `{ title, url, kind }` for the briefing or post that surfaced the tip. |
| `dateAdded` | First-commit date, `YYYY-MM-DD`. Do not invent it. |
| `lastVerified` | Optional date the official source was re-opened. |
| `status` | `draft` (unpublished), `active`, or `retired`. |
| `internalBriefing` / `publicSources` | Same shape as articles. Include the official and discovery links in `publicSources` too. |

`documentation-backed` tips need an official source. `tested` tips need a `verification` object with date, environment, and outcome. Numbers stay in the same paragraph as their conditions. Chinese must not be more absolute than English: `evidence`, `tools`, `wording`, `status`, `dateAdded`, `lastVerified`, and official/discovery URLs are enforced to match across locales.

## Weekly routine

1. Pick only tips that are small and immediately usable.
2. Open the official source yourself. If you cannot confirm the wording, version, or behavior, drop the tip. A social post is a discovery source, not official fact.
3. Add `en` and `zh` files together. Do not ship a listed tip in one locale only.
4. Add or update a changelog entry that points at `/en/tips/` and `/zh/tips/` (and `#slug` anchors when a specific tip is new or retired).
5. Run `npm run check`, `npm test`, and `npm run build` from `site/`.

The list page already has a CSS-only tool filter, ItemList and BreadcrumbList JSON-LD, sitemap, hreflang, and search-index entries. Individual tips are not RSS items; the changelog feed announces the change.

Tip markdown is editorial content under the same CC BY 4.0 terms as other files in `site/src/content/`.
