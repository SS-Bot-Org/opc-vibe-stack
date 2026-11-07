# Release record — M2 weekly refresh 2026-w45 (private — do not ship in dist/)

| Field | Value |
|---|---|
| Release id | m2-2026-w45-20261106 |
| Source revision (git SHA) | local workspace (no git remote SHA available at build time) |
| Build timestamp (UTC) | 2026-11-06T14:33:18Z |
| Editor | VibeCode (executor subagent for Fan) |
| Changed slugs / paths | articles: `spec-first-agent-loop`, `rules-hooks`, `security-quickcheck`, `ship-demo-checklist`; changelog: `2026-w45`; home/changelog UI now show real entry |
| Deploy result | **Deployed** 20261106T143357Z-m2-w45 → /srv/opcvibestack/current on 23.94.44.18 |

## Full §8 gate (M2 briefing-derived refresh)

| Field | Value |
|---|---|
| Verification date (America/Los_Angeles) | 2026-11-06 |
| Evidence basis per changed page | **spec-first-agent-loop**: `documentation-backed` (Spec Kit official quickstart + repo); voice→spec and four-field tips labeled unverified in body. **rules-hooks**: `documentation-backed` (Claude Code hooks/skills/MCP docs, Agent Skills, Codex config reference); cross-tool social tips cited. **security-quickcheck**: `unverified` (X incident reports only; defensive checklist). **ship-demo-checklist**: `documentation-backed` (agent-screenplay README + Astro docs). Changelog entry mixes labels per change item. |
| Source checks performed | Opened Spec Kit quickstart + github/spec-kit; Claude Code hooks-guide, hooks reference, skills, MCP docs; agentskills.io; Codex config-reference (mcp_servers); agent-screenplay README; avanderlee hooks blog; X posts via `get_posts_by_ids` / `get_posts_by_id` for Arindam Spec Kit, neuralnotions marketplace report, twannl hooks, RohanBhanotAI skills, DeepStarts voice→spec, DDXG_99 prompt framing, RoundtableSpace demos, brandononchain MCP, OmniFrontier stealers, Addy Osmani game-policy (assessed, **deferred** from this batch). No fabricated permalinks. |
| Reproduction notes (if tested) | No `tested` labels this week. Site build itself validates schema/routes; agent workflows were not re-run end-to-end on a sample repo. |
| Validation results | `npm run validate`: 7 public articles, 3 stack cards. `npm run build` (Node **v22.23.4**): **16 pages**, success. Changelog `#2026-w45` present; home “Latest update” links to it. Empty-state removed when collection non-empty. `ops/` not in `dist/`. |
| Elapsed effort (minutes) | ~95 (filter + source opens + rewrites + changelog + validate/build + release record) |

## Filter notes

Ingested: Spec Kit / specify-before-code; hooks > AGENTS.md; shared SKILL.md; per-tool MCP configs; marketplace extension + token-stealer alerts; agent-filmed demo tool. Rejected: AI image / short-drama items; pure news; GitReverse / T3 Code / game-policy stack-card update (deferred—Addy Osmani post assessed but left for a later small revision).

## Build environment note

Previous M1 soft launch ran under Node 20 with an engines warning. This M2 package was built with Node **22.23.4** (matches `package.json` engines `>=22.23.4`). Parent should deploy this `dist/` (or rebuild on ≥22.23.4) and keep Node pinned for future releases.

## Gaps / next briefing focus

- Optional light `claude-code` card caveat for game-original vs clone policy (Addy Osmani 2026-11-04).
- Strengthen security page if a vendor advisory appears (upgrade evidence).
- Consider validating changelog `affectedPages` in `scripts/validate.mjs` (currently schema + manual check).
