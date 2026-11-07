---
title: "Rules files + hooks: don’t rely on AGENTS.md alone"
slug: rules-hooks
summary: "Encode hard constraints in hooks and verify commands; share jobs as SKILL.md; configure MCP once per tool."
locale: en
category: checklist
stage: build
tools: [claude-code, codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code hooks/skills/MCP; Codex hooks/MCP in config.toml — confirm vendor docs for your installed version"
updated: "2026-11-06"
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

Prose rules help; **hooks and verify commands enforce**. Treat AGENTS.md / CLAUDE.md as always-on guidance. Put repeatable jobs in skills (`SKILL.md`). Put must-not-fail checks in hooks or CI. When sharing one MCP server across tools, configure **each tool’s own file**—do not invent a single shared config that every CLI magically reads.

## Prerequisites

- Agent CLI that supports project rules and/or lifecycle hooks
- A fast lint/test/smoke command
- Optional: skills folders and an MCP server you actually trust

## Steps

1. List **hard no-gos** (e.g. never edit migrations, never commit secrets, never disable auth tests).
2. Put no-gos in the rules file **and** in a hook or CI step that fails the change. Claude Code hooks run at fixed lifecycle points (for example `PreToolUse` / `PostToolUse`) and can deny a tool call—do not rely on the model “remembering” a paragraph.
3. Require the agent to run the verify command before claiming done; prefer a `Stop` or post-edit hook that runs the same command when practical.
4. **Extract repeated jobs into skills.** A skill is a folder with `SKILL.md` (name + description + steps). Claude Code documents project skills under `.claude/skills/`; the Agent Skills open standard is the shared `SKILL.md` shape. Keep one job per skill; put always-on notes in AGENTS.md / CLAUDE.md. Cross-tool folder layouts differ—re-read each vendor’s docs before assuming one path works everywhere.
5. **Configure MCP once per tool.** Same server, different files: Claude Code commonly uses project `.mcp.json` (`claude mcp add` / `--scope project`); Codex uses `[mcp_servers.*]` in `~/.codex/config.toml` or a trusted project config; Cursor uses its own MCP JSON (often under `.cursor/`). Add the server in each tool, fix the one dialect field that differs, then confirm with that tool’s MCP status UI. Never commit raw API keys. Servers that fetch outside content can carry prompt-injection risk—verify trust first.
6. After any agent mistake, append the lesson to the rules file or the relevant skill the same day.
7. Clear or reset context between unrelated tasks to avoid polluted instructions.

## Template fields

```text
Hard no-gos:
Hook event + matcher (or CI check):
Verify command:
Skills directory / skill names:
MCP server name:
Claude Code config path (.mcp.json or settings):
Codex mcp_servers entry (config.toml):
Cursor MCP config path:
Lesson log location:
```

## Definition of done

A forbidden change fails automatically (hook/CI), not only because the model “remembered” a paragraph. Repeated jobs live in skills you can invoke by name. Each agent you use can list the shared MCP server as connected without copying secrets into the repo.

## Anti-patterns

- Rules file as the only control plane
- Hooks that are too slow, so people skip them
- One giant “how we work” skill that matches every task loosely
- Pasting the same MCP JSON into the wrong tool’s file format and declaring victory
- Enabling marketplace skills/scripts you have not read (treat them like code you run)

## Sources

Frontmatter lists Claude Code hooks/skills/MCP docs, Codex MCP config reference, Agent Skills, and the briefing-linked posts/blog that motivated this revision. Exact Cursor/Codex hook filenames change—always re-read current vendor docs before copying social snippets.
