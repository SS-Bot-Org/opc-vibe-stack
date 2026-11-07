---
title: "Claude Code"
slug: claude-code
summary: "Strong for interactive coding loops, plans, and repo-aware agent sessions."
locale: en
category: stack
stage: build
tools: [claude-code]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code (Anthropic CLI/agent); confirm current version before following steps"
updated: "2026-11-06"
internalBriefing: []
publicSources:
  - title: "Claude Code overview"
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
    kind: docs
tags: [stack, build]
toolId: claude-code
toolAvailability: active
bestFor: "Repo-local agent loops, plan-then-implement sessions, and rules/hooks enforcement."
poorFit: "Blind one-shot generation without a verification command; treating chat memory as policy."
caveats: "Keep secrets out of prompts; encode hard no-gos in rules files and hooks, not hopes."
---

## Conclusion

Use Claude Code when you want an agent that lives in the repo, can plan, edit, and re-check against a command you define.

## Prerequisites

- Official Claude Code install for your OS
- A project that can run with one clear verify command (tests, lint, or smoke script)

## Steps

1. Install and authenticate per Anthropic’s current docs.
2. Add a short project rules file that states goals, forbidden paths, and the verify command.
3. Prefer plan mode for multi-file work; only implement after the plan matches your acceptance criteria.
4. After mistakes, write the correction into the rules file so the next session inherits it.

## Template fields

- Verify command:
- Forbidden paths:
- Definition of done:

## Definition of done

You can start a session, state a scoped task, and the agent can run your verify command without you pasting secrets.

## Anti-patterns

- Pasting API keys or `.env` contents into the chat
- Asking for “just rewrite everything” without a spec or verify loop

## Sources

See frontmatter `publicSources`.
