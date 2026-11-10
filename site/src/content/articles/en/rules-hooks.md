---
title: "Rules files + hooks: don’t rely on AGENTS.md alone"
slug: rules-hooks
summary: "Put conventions in AGENTS.md/CLAUDE.md, repeatable jobs in SKILL.md, no-gos in permissions.deny/ask and hooks/CI, and MCP per tool."
locale: en
category: checklist
stage: build
tools: [claude-code, codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code hooks/skills/MCP; Codex config.toml & mcp_servers — confirm exact syntax for your installed CLI version"
updated: "2026-11-10"
internalBriefing:
  - date: "2026-11-02"
    note: "Hooks vs AGENTS.md alone"
  - date: "2026-11-03"
    note: "Shared SKILL.md across agents"
  - date: "2026-11-05"
    note: "One MCP server, per-tool config files"
  - date: "2026-11-07"
    note: "Lean CLAUDE.md; manual-only side-effect skills"
  - date: "2026-11-08"
    note: "One shared rules file; permissions enforce, prompts don't"
publicSources:
  - title: "Automate actions with hooks (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks-guide"
    kind: docs
  - title: "Hooks reference (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks"
    kind: docs
  - title: "How Claude remembers your project (CLAUDE.md, AGENTS.md, imports)"
    url: "https://code.claude.com/docs/en/memory"
    kind: docs
  - title: "Configure permissions (Claude Code)"
    url: "https://code.claude.com/docs/en/permissions"
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

Markdown rules files (`AGENTS.md`, `CLAUDE.md`) shape default habits, **but models still forget prose under long context**. Separate your agent control plane into five clean layers: always-on repo context in rules files, repeatable multi-step jobs in `SKILL.md`, tool-enforced **permission rules** (`permissions.deny` / `ask`) between prose rules and hooks — not a sandbox — then deterministic **lifecycle hooks**, and **CI** build gates. Configure shared MCP servers in each tool's native config file.

## First exercise: prove one rule with fake data

Use a disposable test repository with no real secrets. Create an `AGENTS.md` containing one recognizable instruction and a `CLAUDE.md` containing `@AGENTS.md`. Add a fake `.env.guardrail-demo` file containing only `DEMO_VALUE=not-a-secret`.

1. Merge the permission entries below into existing settings; do not replace the whole file or delete existing rules.
2. Start a new Claude Code session. Use `/context all` to inspect loaded memory files and `/permissions` to inspect active rules.
3. Ask it to read the fake file with the **Read tool**. Pass only when the tool is denied before the contents reach the model. A polite refusal in prose alone is not evidence of enforcement.
4. If the call succeeds, stop and inspect rule paths, configuration scope, and installed version. Do not test with production credentials. Record the tool, rule, version, and observed result.

This tests one access path. [Read/Edit deny rules do not cover every subprocess](https://code.claude.com/docs/en/permissions#what-read-and-edit-rules-cover). A script can open files indirectly; `.gitignore` also does not restrict reads. For actual secret isolation, use an appropriately configured sandbox or OS permissions and keep credentials outside the agent's accessible environment. CI cannot undo a disclosure.

> [!FLOW] Five-layer agent control pipeline
>
> 1. **Rules (`AGENTS.md` / `CLAUDE.md`)** — Load compact repo map, verify command, and coding conventions every session.
> 2. **Skills (`SKILL.md`)** — Pull multi-step workflows on demand without bloating baseline context.
> 3. **Permission rules (`permissions.deny` / `ask`)** — Enforced by the tool on every call (deny `.env*` reads, ask before `git push`); not a sandbox.
> 4. **Hooks (`PreToolUse` / `PostToolUse`)** — Use `PreToolUse` to reject a matched call before execution; use `PostToolUse` for checks after it has already run.
> 5. **CI gates (`npm run check && npm test && npm run build`)** — Run typecheck, regression tests, schema and output checks before merge or deploy.

> [!IMPORTANT] Prose advises; permissions, hooks, and exit codes enforce
> If breaking a rule would leak secrets, corrupt migrations, or ship broken links, **never** leave that rule in `AGENTS.md` alone. Pair the prose rule with a permission rule (`permissions.deny` / `ask`), a fast lifecycle hook (`PreToolUse` / `PostToolUse` / `Stop`), or a required build gate that exits nonzero.

## Five-layer agent control plane

<figure class="article-figure">
  <div class="theme-diagram" role="img" aria-label="Five-layer agent control plane: Rules, Skills, Permissions, Hooks, and CI gates from advisory to enforced.">
    <img class="theme-diagram__light" src="/illustrations/rules-hooks/five-layer-control.light.svg" alt="" data-decorative="true" width="720" height="420" />
    <img class="theme-diagram__dark" src="/illustrations/rules-hooks/five-layer-control.dark.svg" alt="" data-decorative="true" width="720" height="420" />
  </div>
  <figcaption>Five layers from advisory rules and skills, through tool-enforced permissions (not a sandbox), to deterministic hooks and CI gates. Labels match the table below.</figcaption>
</figure>


| Layer | Enforced? | When loaded | What belongs here |
|---|---|---|---|
| **`AGENTS.md` / `CLAUDE.md`** | Advisory | Every session | Repo map, build/test commands, coding conventions, short boundary list |
| **`SKILL.md` folders** | Advisory workflow | On-demand when task matches | Repeatable SOPs (weekly content ingest, release check, schema migration checklist) |
| **Permission rules (`permissions.deny` / `ask`)** | **Enforced by the tool** | Every tool call | Deny reads of `.env*`, prompt before `git push`; not a sandbox |
| **Lifecycle hooks** | **Deterministic** | Fixed tool/turn events | Blocking edits to protected paths, running fast format/lint checks, gating `Stop` |
| **CI / `npm run build`** | **Deterministic** | Pre-merge & pre-deploy | Build checks schema and links/anchors; CI separately runs typecheck and regression tests |

## Turning prose hopes into enforced checks

| Fragile prose-only rule | Deterministic hook / build replacement |
|---|---|
| *“Please never edit `.env` or production deploy keys”* | `permissions.deny` rules such as `Read(./.env)` / `Edit(./.env)`, a `PreToolUse` hook for patterns the rules can't express, plus `.gitignore` |
| *“Never touch production”* in `CLAUDE.md` | `deny` or `ask` rules for the deploy commands you actually use (for example `Bash(git push *)`), and keep production credentials off the agent's machine |
| *“Always run `npm run check` before saying you’re done”* | `Stop` hook runs `npm run check`, maps failures to exit `2`, and guards `stop_hook_active`; post-edit checks cannot undo an edit |
| *“Don’t break translated slugs or changelog page links”* | `scripts/validate.mjs` + `scripts/validate-output.mjs` fail `npm run build` automatically |

## Prerequisites

- [Claude Code](/en/articles/claude-code/) and/or [Codex](/en/articles/codex/) installed per current vendor docs
- A fast verification command (ideally `<15s` for hook checks, `<60s` for full build validation)
- Explicit trust review before adding any third-party skill pack or external MCP server

## Steps

1. **Audit your `AGENTS.md` / `CLAUDE.md` and cut bloat.** Anthropic's [memory docs](https://code.claude.com/docs/en/memory) target under 200 lines per `CLAUDE.md` and note that `@path` imports organize a file but don't reduce its context cost. We aim for ~80 lines: directory layout, exact commands, code style, and top boundaries. Move instructions for one part of the codebase into path-scoped rules or a skill.
2. **Keep one rules file for every tool.** Codex and most other agents read `AGENTS.md`; Claude Code reads `CLAUDE.md` and, can also read `AGENTS.md` directly in supported sessions. The default fallback depends on the absence of `CLAUDE.md` and `CLAUDE.local.md` in the working directory and its ancestors; versions and instruction settings matter. If you also keep a `CLAUDE.md`, make its first line `@AGENTS.md` and put only Claude-specific notes below it, so the two files never drift. A `CLAUDE.md` → `AGENTS.md` symlink also works, but the docs recommend the import if anyone clones on Windows. Run `/context all` and confirm the file appears under **Memory files**.
3. **Identify your top 3 “must never happen” failures** (touching `.env*`, editing frozen migrations, skipping verification) and back each one with a permission rule, hook, or build-script check. The [permissions docs](https://code.claude.com/docs/en/permissions) are explicit: rules are enforced by Claude Code, not the model, and instructions in `CLAUDE.md` don't change what it allows. Deny rules win over allow rules. Bash rules match the command text Claude writes, so a push written another way (`git -C . push`) slips past `Bash(git push *)`; use an appropriately configured sandbox or OS access control for a filesystem boundary; a `PreToolUse` hook only covers the calls it actually inspects. In Claude Code, `PreToolUse` can reject a tool call before it executes; `PostToolUse` runs after success and cannot prevent or undo it; `Stop` can prevent finishing, not reverse prior actions.
4. **Keep hook commands fast.** Run targeted lint/type/path checks inside edit hooks; leave heavy full-repo integration suites for `Stop` or pre-push/CI so you never disable hooks out of impatience.
5. **Extract recurring playbooks into `SKILL.md` folders.** Follow the [Agent Skills](https://agentskills.io/) structure (`SKILL.md` with YAML `name` + `description` + step-by-step instructions). Claude Code loads project skills from `.claude/skills/<skill-name>/SKILL.md`; verify exact skill directory paths in each tool’s current docs before symlinking across tools. For skills with side effects (deploy, publish, send), add `disable-model-invocation: true` so the skill runs only when you type `/skill-name`; `context: fork` runs a skill in its own subagent context, which suits heavy search jobs.
6. **Configure shared MCP servers once per tool—in each tool’s native dialect.** One MCP server can serve Claude Code, Codex, and Cursor, **but there is no single universal config file**:
   - **Claude Code:** project `.mcp.json` (or `claude mcp add --scope project ...`)
   - **Codex:** `[mcp_servers.<name>]` in `~/.codex/config.toml` (or trusted project `.codex/config.toml`)
   - **Cursor (if used):** `.cursor/mcp.json`
   Confirm connection health inside each tool’s own MCP status view, and keep API tokens in environment variables—never committed plaintext.
7. **Log agent mistakes the day they happen.** Append a one-line rule or tighten the relevant `SKILL.md` / hook immediately after any post-mortem.

> [!NOTE] Adapt repository-specific examples
> `site/`, the `npm run check` script, and the `ops/` paths below belong to OPC Vibe Stack. In another project, inspect its README and available scripts before replacing them. For this repository’s full test suite, use its Linux CI environment; the deployment example requires GNU tools and `flock`. A skipped platform test is not a deployment pass.

## Starter templates

### 1. Reusable `SKILL.md` skeleton (`.claude/skills/weekly-refresh/SKILL.md`)

```markdown
---
name: weekly-refresh
description: Run the Sunday briefing-to-site refresh, verify sources and evidence labels, and validate the static build.
disable-model-invocation: true  # edits content and may publish; run only via /weekly-refresh
---

# Weekly Refresh SOP

1. Filter incoming notes down to reusable OPC workflows, stack changes, or security alerts.
2. Open every cited public URL; keep `unverified` disclaimers on poster-claimed metrics.
3. Update affected `en` and `zh` articles with matching `slug` and bumped `updated` date.
4. Add a changelog entry whose `affectedPages` exist in this exact build.
5. Run `cd site && npm run check && npm test && npm run build` and fix all failures before finishing.
```

### 2. One shared rules file plus enforced permissions

```markdown
<!-- CLAUDE.md — AGENTS.md stays the single source for every tool -->
@AGENTS.md

## Claude Code only
Use plan mode for changes under `site/src/lib/`.
```

Merge into `.claude/settings.json` — these rules govern matching tool calls, not every possible way to access a file:

```json
{
  "permissions": {
    "deny": ["Read(./.env)", "Read(./.env.*)", "Edit(./.env)", "Edit(./.env.*)"],
    "ask": ["Bash(git push *)"]
  }
}
```

### 3. Same MCP server, per-tool config dialects (configuration skeletons)

`@example/docs-mcp-server` and `DOCS_API_TOKEN` below are placeholders, not an install recommendation. Do not run these snippets unchanged. First select and audit a real server, pin its package/version, and replace the command, arguments, and token name with its documented values. If you do not need an external data source, skip MCP entirely.

Claude Code — project root `.mcp.json` (reference env vars, never commit raw keys):

```json
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

### 4. Control-plane setup worksheet

```text
Single rules source (AGENTS.md) + CLAUDE.md import confirmed via /context:
Hard no-gos (must fail deterministically):
Permission deny/ask rules:
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

### 5. A Stop check that translates npm failure into a blocking exit

Claude Code command hooks do **not** treat every nonzero exit as a block: exit `2` is the blocking signal on supported events; ordinary exit `1` without a valid JSON decision is generally a non-blocking error. Alternatively, return the event-specific JSON decision with exit `0` (for example, `PreToolUse` uses `hookSpecificOutput.permissionDecision: "deny"`; `Stop` uses top-level `decision: "block"` plus `reason`). See the [exit-code/event reference](https://code.claude.com/docs/en/hooks#exit-code-2-behavior-per-event).

For this repository's POSIX layout, save the following as `.claude/hooks/stop-check.cjs` at the repository root (create the directories first). It requires Node and npm on PATH and dependencies installed in `site/`. Other projects must substitute their actual check command/directory; `npm run check` is not universal.

```javascript
// stop-check.cjs — POSIX Node/npm example for this repository layout
const { readFileSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  if (input.hook_event_name !== 'Stop') throw new Error('Expected a Stop event');
  if (input.stop_hook_active === true) process.exit(0);
  const root = process.env.CLAUDE_PROJECT_DIR;
  if (!root) throw new Error('CLAUDE_PROJECT_DIR is required');
  const result = spawnSync('npm', ['--prefix', 'site', 'run', 'check'], {
    cwd: root, stdio: ['ignore', 2, 2], timeout: 45000,
  });
  if (result.error || result.status !== 0) {
    console.error('Typecheck failed or could not run. Inspect the output, fix it, and rerun verification.');
    process.exit(2);
  }
} catch {
  console.error('Stop check could not validate its input or run; inspect the hook configuration.');
  process.exit(2);
}
```

The child process writes both stdout and stderr to the hook's **stderr** (`stdio: ['ignore', 2, 2]`): on exit `2`, Claude Code feeds only stderr back to the model, so typecheck diagnostics printed to stdout would otherwise be invisible to it.

Merge this `Stop` entry into the existing `.claude/settings.json` `hooks` object; do not overwrite other hooks:

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "node",
        "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/stop-check.cjs"],
        "timeout": 60
      }]
    }]
  }
}
```

The stdin `stop_hook_active` guard follows the [official loop-prevention guidance](https://code.claude.com/docs/en/hooks-guide#stop-hook-hits-the-block-cap): it allows a subsequent stop rather than looping forever. Consequently this is feedback, **not** proof that all checks passed or a security boundary. Keep independent required CI typecheck/tests/build and process/file permissions. `PostToolUse` cannot undo a leaked secret; path matchers also need coverage for shell, MCP and other access routes. Test your actual tool/event configuration before relying on a hook. The local regression tests exercise this wrapper with isolated npm fixtures, not a live Claude session.

## Definition of done

- [ ] `AGENTS.md` / `CLAUDE.md` is concise and states exact build, check, and test commands
- [ ] Confirmed the intended instructions actually load in each tool; use the explicit import when sharing files
- [ ] Every “must never happen” rule is enforced by a permission rule, lifecycle hook, or nonzero build/CI check—not prose alone
- [ ] Repeated multi-step workflows are extracted into `SKILL.md` folders with clear trigger descriptions
- [ ] Each coding agent connects to any shared MCP server via its own native config file without secrets in Git
- [ ] Context is cleared between unrelated tasks so stale session overrides do not linger

## Anti-patterns

- **Maintaining `AGENTS.md` and `CLAUDE.md` as two hand-edited copies** — they drift; import one from the other.
- **Treating `AGENTS.md` as a security boundary** — prose instructions reduce accidents, they cannot guarantee access control.
- **Putting a 3-minute test suite on every file-write hook** — slow hooks train you to bypass all hooks; keep per-edit hooks sub-15 seconds.
- **One catch-all `how-we-code` skill** — vague skill descriptions trigger unpredictably; scope one concrete job per skill.
- **Copy-pasting JSON into Codex’s `config.toml` (or vice versa)** — respect each CLI’s native schema and check live vendor docs after upgrades.
