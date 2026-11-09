# Release record — weekly refresh 2026-w45 (private — do not ship in dist/)

| Field | Value |
|---|---|
| Release id | 20261109T051219Z-content-7fd013e |
| Source revision (git SHA) | 7fd013eb95a980e0d00fb928b6b867eebfe910dd (branch `content/2026-w45-rules-single-source`) |
| Build timestamp (UTC) | 2026-11-09T05:11Z (packaged by `ops/package-release.mjs`) |
| Editor | VibeCode (scheduled weekly routine for Fan) |
| Changed slugs / paths | articles: `/en/articles/rules-hooks/`, `/en/articles/claude-code/`; changelog: `2026-w45-weekly` (en) |
| Deploy result | **Deployed** to /srv/opcvibestack/current; previous `20261108T115239Z-content-8323f8c` retained. First attempt `20261109T051207Z-content-7fd013e` auto-rolled back by the activation helper because the smoke script wrongly expected the English-only entry on `/zh/changelog/`; script fixed, second attempt passed. |

## Full §8 gate

| Field | Value |
|---|---|
| Verification date (America/Los_Angeles) | 2026-11-08 |
| Evidence basis per changed page | **rules-hooks**: `documentation-backed` (Claude Code memory, permissions, skills docs). **claude-code**: `documentation-backed` (memory + permissions docs). Changelog items all `documentation-backed`. |
| Source checks performed | Opened code.claude.com/docs/en/memory (AGENTS.md section, `@AGENTS.md` import, symlink/Windows caveat, under-200-lines target, imports don't reduce context, v2.1.277 note); /permissions ("enforced by Claude Code, not by the model", deny→ask→allow order, Bash rules match command text, `Read(./.env)`); /skills (`disable-model-invocation`, `context: fork`). X posts from the 11-07/11-08 briefings were used only as leads, not cited. |
| Reproduction notes (if tested) | Not reproduced in a live Claude Code session; no `tested` labels. |
| Validation results | Node v22.23.4. `npm run check` 0 errors/warnings; `npm test` 23/23; `npm run build` 42 pages, links/anchors OK, 40 sitemap routes. Origin probes 31 routes with exact artifact bytes; public HTTPS checks of /en/, /en/changelog/ (anchor `#2026-w45-weekly`), both changed articles and /release.json matched artifact bytes. No browser visual QA. |
| Elapsed effort (minutes) | ~25 |

## Filter notes

Briefings 2026-11-02 to 11-08 plus `weekly-2026-11-08.html` digest. Kept: single AGENTS.md source with CLAUDE.md import; permission rules vs prompt text; lean CLAUDE.md; manual-only side-effect skills. Rejected or deferred: image and short-drama items; third-party tools (vibe-testing, Floorplan, unslop, Cloudflare security-audit skill, skill packs) as unvetted popularity claims; model-tier split (Opus/Haiku/Sonnet) pending a primary source; Karpathy TristanTube as anecdote.

## Gaps

- zh `rules-hooks` / `claude-code` not yet updated with these additions (zh pages still show the 2026-11-07 version).
- Consider a vetted "verify the UI actually works" step (browser-driven acceptance) for ship-demo-checklist once a tool is tested locally.
