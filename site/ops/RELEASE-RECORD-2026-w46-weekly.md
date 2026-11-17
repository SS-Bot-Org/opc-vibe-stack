# Release record (private — do not ship in dist/)

| Field | Value |
|---|---|
| Release id | not deployed (PR only; deployment waits for owner request) |
| Source revision (git SHA) | branch `content/2026-w46-weekly` on top of origin/main d6cc114 |
| Build timestamp (UTC) | 2026-11-16 (local 2026-11-15 America/Los_Angeles) |
| Editor | OPC Vibe Stack editorial team (AI-assisted draft; owner review pending in PR) |
| Changed slugs / paths | rules-hooks, security-quickcheck, spec-first-agent-loop (EN + ZH); changelog 2026-w46-weekly (EN + ZH) |
| Deploy result | n/a |

## Full §8 gate

| Field | Value |
|---|---|
| Verification date (America/Los_Angeles) | 2026-11-15 |
| Evidence basis per changed page | All new steps documentation-backed (Claude Code hooks, permissions, settings, security, best-practices docs; Codex config-advanced and CLI slash-commands docs). security-quickcheck keeps page-level `unverified` because of its earlier incident reports. |
| Source checks performed | Fetched each vendor page on 2026-11-15 and matched wording: PreToolUse warning on @ references and CLAUDE_CODE_DISABLE_FILE_MENTIONS (v2.1.299+, ignored in project/local settings); best-effort Read deny on @ mentions; "don't ask again" rules saved to .claude/settings.local.json; trust dialog not shown for -p/SDK and repo hooks/env/apiKeyHelper used before trust; Codex project config only for trusted projects; /code-review fresh subagent, reviewer subagent with Read/Grep/Glob; Codex /review uses session model unless review_model. |
| Reproduction notes (if tested) | Not tested on this site; no measured numbers added. |
| Validation results | npm ci OK; astro check 0 errors/0 warnings/0 hints (79 files); node --test 45/45 pass; build + validate-output: 42 HTML files, internal links/anchors, 40 images, 40 sitemap routes, SEO metadata OK (canonical/hreflang/title/description/JSON-LD/lastmod checks). |
| Featured tools | Unchanged (Claude Code, Codex, Grok Build). Cursor watched as a candidate; see PR description. |
