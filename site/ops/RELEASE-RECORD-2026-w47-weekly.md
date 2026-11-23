# Release record (private — do not ship in dist/)

| Field | Value |
|---|---|
| Release id | not deployed (PR only; deployment waits for owner request) |
| Source revision (git SHA) | branch `content/2026-w47-weekly` on top of origin/main 3e8e80f |
| Build timestamp (UTC) | 2026-11-23 (local 2026-11-22 America/Los_Angeles) |
| Editor | OPC Vibe Stack editorial team (AI-assisted draft; owner review pending in PR) |
| Changed slugs / paths | New: antigravity (EN + ZH tool card, light/dark EN/ZH overview SVGs, OG cards). Revised: codex, rules-hooks, security-quickcheck (EN + ZH). Notice only (no date change): grok-build (EN + ZH). Tips added: hooks-fail-closed, sandbox-covers-shell-only, codex-live-web-search, keep-session-transcripts (EN + ZH). Changelog 2026-w47-weekly (EN + ZH). Site: featured three `claude-code, codex, antigravity`; `formerToolIds: grok-build` listed on /stack/ as Previously featured; homepage/about/README copy. |
| Deploy result | n/a |

## Full §8 gate

| Field | Value |
|---|---|
| Verification date (America/Los_Angeles) | 2026-11-22 |
| Evidence basis per changed page | All new claims documentation-backed. Antigravity: official docs (getting-started, browser, commands/browser, implementation-plan, walkthrough, permissions, rules, models, changelog v2.34.0). Claude Code: hooks reference (onFailure), changelog 2.1.328–2.1.330, sandboxing, permissions, settings reference (cleanupPeriodDays). Codex: rust-v0.171.0 release notes, web search docs. Security incidents: Bitdefender Labs (2026-11-17) and GTIG (2026-11-16) reports, labelled as vendor reports, not reproduced. GitHub CODEOWNERS docs. |
| Source checks performed | Fetched every vendor page on 2026-11-22 and matched wording, versions, and conditions. Discovery X posts for two tips (leocx66 2122879897559302525, Voxyz_ai 2123431117634367675) opened via the X API. Existing six tips re-checked against their official sources; none retired. Excluded: CLAUDE_CODE_MAX_OUTPUT_TOKENS tip (reverted by 2.1.330), token-saving percentages and small-sample agent comparisons without primary sources, unvetted third-party tools (safeagents, Shotkit, hook starter repos, Vercel Board). |
| Reproduction notes (if tested) | Not tested on this site; no measured numbers added. |
| Validation results | npm ci OK; astro check 0 errors/0 warnings/0 hints (83 files); node --test 52/52 pass (tips lastmod test now derives the expected date from listed tips); build + validate-output: 46 HTML files, internal links/anchors, 44 images, 44 sitemap routes, SEO metadata OK (canonical/hreflang/title/description/JSON-LD/lastmod). Local preview screenshots (EN/ZH Antigravity desktop + 390px, EN/ZH Stack, homepage) checked by eye. |
| Featured tools | Changed: Grok Build → Google Antigravity. X recent counts (2026-11-16..22, non-retweets): "Claude Code" ≈69.7k EN-any / 11.5k zh; Codex ≈23.4k (codex + openai/gpt/cli/agent/coding) / 20.1k zh; Google Antigravity ≈11.2k (exact product phrases) / 10.9k zh; Cursor ≈7.2k (cursor + agent/coding/composer/ide/vibe) / 4.7k zh; "Grok Build" ≈2.4k / 325 zh. Antigravity daily volume stayed 855–2,074 (EN) and 824–1,989 (zh) on all seven days; a 2026-11-11 sample returned 25 product posts within ~35 minutes, so discussion predates this week. Briefings 11/16–22 mention Antigravity on 3 days with official releases (v2.30 import, Gemini 4 Neon/Orchestrator, v2.34.0), Grok Build on none (also none 11/09–15). |
