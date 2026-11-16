# Release record (private — do not ship in dist/)

| Field | Value |
|---|---|
| Release id | 2026-w47-tips |
| Source revision (git SHA) | 1a51abf705cfffeadf97511ed4b70654165101bc |
| Build timestamp (UTC) | 2026-11-16T11:54:42Z |
| Editor | OPC Vibe Stack editorial team |
| Changed slugs / paths | `/en/tips/`, `/zh/tips/`, six tip slugs, changelog `2026-w47-tips`, nav, validators, `docs/tips.md` |
| Deploy result | Not deployed |

## Full §8 gate (required for briefing-derived changes and M2 refresh)

| Field | Value |
|---|---|
| Verification date (America/Los_Angeles) | 2026-11-16 |
| Evidence basis per changed page | All six seed tips are documentation-backed. Official sources were opened on 2026-11-16. Discovery posts are cited separately. No numbers were invented or re-measured on this site. |
| Source checks performed | Anthropic Prompting Claude Fable 5.2 (live page, not only the 2026-11-10 screenshot); Claude Code memory, hooks, env-vars, permissions, CLI reference, and subagents docs. |
| Reproduction notes (if tested) | Not reproduced on this site. Anthropic’s ownership-consolidation figures are quoted with their official conditions. A third-party “40×” Explore cost claim was dropped. |
| Validation results | `npm run check`: 0 errors / 0 warnings / 0 hints (83 files). `npm test`: 50/50 pass. `npm run build` + validators: 44 HTML files, internal links/anchors, 40 images, 42 sitemap routes, SEO metadata OK. |
| Elapsed effort (minutes) | — |

Not merged and not deployed. Deployment waits for an explicit request.
