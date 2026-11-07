---
title: "Rules files + hooks: don’t rely on AGENTS.md alone"
slug: rules-hooks
summary: "Put conventions in AGENTS.md/CLAUDE.md, repeatable jobs in SKILL.md, hard blocks in hooks/CI, and MCP per tool."
locale: en
category: checklist
stage: build
tools: [claude-code, codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code hooks/skills/MCP; Codex config.toml & mcp_servers — confirm exact syntax for your installed CLI version"
updated: "2026-11-07"
internalBriefing:
  - date: "2026-11-02"
    note: "Hooks vs AGENTS.md alone"
  - date: "2026-11-03"
    note: "Shared SKILL.md across agents"
  - date: "2026-11-05"
    note: "One MCP server, per-tool config files"
publicSources:
  - title: "Automate actions with hooks (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks-guide"
    kind: docs
  - title: "Hooks reference (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks"
    kind: docs
  - title: "Extend Claude with skills (SKILL.md)"
    url: "https://code.claude.com/docs/en/skills"
    kind: docs
  - title: "Agent Skills open standard"
    url: "https://agentskills.io/"
    kind: docs
  - title: "Connect Claude Code to tools via MCP"
    url: "https://code.claude.com/docs/en/mcp"
    kind: docs
  - title: "Codex configuration reference (mcp_servers)"
    url: "https://developers.openai.com/codex/config-reference"
    kind: docs
  - title: "AGENTS.md instructions are not always reliable; agent hooks are"
    url: "https://x.com/twannl/status/2117204333146034342"
    kind: x
  - title: "Agent hooks in Claude Code, Cursor, and Codex explained"
    url: "https://www.avanderlee.com/ai-development/agent-hooks-claude-code-cursor-codex/"
    kind: blog
  - title: "Write a job once as SKILL.md"
    url: "https://x.com/RohanBhanotAI/status/2117624435452653720"
    kind: x
  - title: "One MCP server across Claude Code, Cursor, and Codex"
    url: "https://x.com/brandononchain/status/2118102874626433286"
    kind: x
tags: [build, hooks, skills, mcp, safety]
---

## Conclusion

Markdown rules files (`AGENTS.md`, `CLAUDE.md`) shape default habits, **but models still forget prose under long context**. Separate your agent control plane into four clean layers: always-on repo context in rules files, repeatable multi-step jobs in `SKILL.md`, deterministic enforcement in **lifecycle hooks + CI**, and per-tool configuration files when sharing an MCP server.

> [!FLOW] Four-layer agent control pipeline
>
> 1. **Rules (`AGENTS.md` / `CLAUDE.md`)** — Load compact repo map, verify command, and coding conventions every session.
> 2. **Skills (`SKILL.md`)** — Pull multi-step workflows on demand without bloating baseline context.
> 3. **Hooks (`PreToolUse` / `PostToolUse`)** — Block secret paths and auto-run formatters or lints via exit codes.
> 4. **CI Build Gate (`npm run build`)** — Enforce final schema, test, and output integrity before merge or deploy.

> [!IMPORTANT] Prose advises; exit codes enforce
> If breaking a rule would leak secrets, corrupt migrations, or ship broken links, **never** leave that rule in `AGENTS.md` alone. Pair the prose rule with a fast lifecycle hook (`PreToolUse` / `PostToolUse` / `Stop`) or a required build gate that exits nonzero.

## Four-layer agent control plane

| Layer | Enforced? | When loaded | What belongs here |
|---|---|---|---|
| **`AGENTS.md` / `CLAUDE.md`** | Advisory | Every session | Repo map, build/test commands, coding conventions, short boundary list |
| **`SKILL.md` folders** | Advisory workflow | On-demand when task matches | Repeatable SOPs (weekly content ingest, release check, schema migration checklist) |
| **Lifecycle hooks** | **Deterministic** | Fixed tool/turn events | Blocking edits to protected paths, running fast format/lint checks, gating `Stop` |
| **CI / `npm run build`** | **Deterministic** | Pre-merge & pre-deploy | Full schema, link/anchor inventory, and regression suite |

## Turning prose hopes into enforced checks

| Fragile prose-only rule | Deterministic hook / build replacement |
|---|---|
| *“Please never edit `.env` or production deploy keys”* | `PreToolUse` hook denies file reads/writes matching `.env*` or `*.pem`, plus `.gitignore` |
| *“Always run `npm run check` before saying you’re done”* | `Stop` / post-edit hook or required task script runs `npm run check` and blocks on nonzero exit |
| *“Don’t break translated slugs or changelog page links”* | `scripts/validate.mjs` + `scripts/validate-output.mjs` fail `npm run build` automatically |

## Prerequisites

- [Claude Code](/en/articles/claude-code/) and/or [Codex](/en/articles/codex/) installed per current vendor docs
- A fast verification command (ideally `<15s` for hook checks, `<60s` for full build validation)
- Explicit trust review before adding any third-party skill pack or external MCP server

## Steps

1. **Audit your `AGENTS.md` / `CLAUDE.md` and cut bloat.** Keep always-on instructions under ~80 lines: directory layout, exact commands, code style, and top boundaries.
2. **Identify your top 3 “must never happen” failures** (touching `.env*`, editing frozen migrations, skipping verification) and back each one with a hook or build-script check. In Claude Code, lifecycle hooks (`PreToolUse`, `PostToolUse`, `Stop`) run shell commands at fixed points and can block the action.
3. **Keep hook commands fast.** Run targeted lint/type/path checks inside edit hooks; leave heavy full-repo integration suites for `Stop` or pre-push/CI so you never disable hooks out of impatience.
4. **Extract recurring playbooks into `SKILL.md` folders.** Follow the [Agent Skills](https://agentskills.io/) structure (`SKILL.md` with YAML `name` + `description` + step-by-step instructions). Claude Code loads project skills from `.claude/skills/<skill-name>/SKILL.md`; verify exact skill directory paths in each tool’s current docs before symlinking across tools.
5. **Configure shared MCP servers once per tool—in each tool’s native dialect.** One MCP server can serve Claude Code, Codex, and Cursor, **but there is no single universal config file**:
   - **Claude Code:** project `.mcp.json` (or `claude mcp add --scope project ...`)
   - **Codex:** `[mcp_servers.<name>]` in `~/.codex/config.toml` (or trusted project `.codex/config.toml`)
   - **Cursor (if used):** `.cursor/mcp.json`
   Confirm connection health inside each tool’s own MCP status view, and keep API tokens in environment variables—never committed plaintext.
6. **Log agent mistakes the day they happen.** Append a one-line rule or tighten the relevant `SKILL.md` / hook immediately after any post-mortem.

## Starter templates

### 1. Reusable `SKILL.md` skeleton (`.claude/skills/weekly-refresh/SKILL.md`)

```markdown
---
name: weekly-refresh
description: Run the Sunday briefing-to-site refresh, verify sources and evidence labels, and validate the static build.
---

# Weekly Refresh SOP

1. Filter incoming notes down to reusable OPC workflows, stack changes, or security alerts.
2. Open every cited public URL; keep `unverified` disclaimers on poster-claimed metrics.
3. Update affected `en` and `zh` articles with matching `slug` and bumped `updated` date.
4. Add a changelog entry whose `affectedPages` exist in this exact build.
5. Run `cd site && npm run check && npm test && npm run build` and fix all failures before finishing.
```

### 2. Same MCP server, per-tool config dialects (no hardcoded secrets)

```json
// Claude Code — .mcp.json (project root; reference env vars, never commit raw keys)
{
  "mcpServers": {
    "docs-lookup": {
      "command": "npx",
      "args": ["-y", "@example/docs-mcp-server"],
      "env": {
        "DOCS_API_TOKEN": "${DOCS_API_TOKEN}"
      }
    }
  }
}
```

```toml
# OpenAI Codex — ~/.codex/config.toml (TOML table syntax per Codex config reference)
[mcp_servers.docs-lookup]
command = "npx"
args = ["-y", "@example/docs-mcp-server"]
env_vars = ["DOCS_API_TOKEN"]
```

### 3. Control-plane setup worksheet

```text
Hard no-gos (must fail deterministically):
Hook event + matcher (Claude Code / CLI):
Fast hook command (<15s):
Full release gate command:
Project skills path + active skill names:
Shared MCP server(s) + trust review date:
  - Claude Code config location:
  - Codex config.toml entry:
```

> [!WARNING] Treat skills and MCP servers like production dependencies
> Community `SKILL.md` scripts and MCP servers that fetch untrusted web content can introduce prompt injection or arbitrary command execution. Read every script before enabling it, and review [Security quickcheck](/en/articles/security-quickcheck/).

## Definition of done

- [ ] `AGENTS.md` / `CLAUDE.md` is concise and states exact build, check, and test commands
- [ ] Every “must never happen” rule is enforced by a lifecycle hook or nonzero build/CI check—not prose alone
- [ ] Repeated multi-step workflows are extracted into `SKILL.md` folders with clear trigger descriptions
- [ ] Each coding agent connects to any shared MCP server via its own native config file without secrets in Git
- [ ] Context is cleared between unrelated tasks so stale session overrides do not linger

## Anti-patterns

- **Treating `AGENTS.md` as a security boundary** — prose instructions reduce accidents, they cannot guarantee access control.
- **Putting a 3-minute test suite on every file-write hook** — slow hooks train you to bypass all hooks; keep per-edit hooks sub-15 seconds.
- **One catch-all `how-we-code` skill** — vague skill descriptions trigger unpredictably; scope one concrete job per skill.
- **Copy-pasting JSON into Codex’s `config.toml` (or vice versa)** — respect each CLI’s native schema and check live vendor docs after upgrades.
