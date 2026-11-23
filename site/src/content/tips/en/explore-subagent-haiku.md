---
title: Override the Explore subagent's model
slug: explore-subagent-haiku
summary: "A user or project subagent named Explore overrides the built-in one, so you can set model: haiku when you want lower-cost repository search."
locale: en
tools:
  - claude-code
appliesTo: Claude Code custom subagents. The built-in Explore model depends on the parent model and how you connect, as documented below.
tags:
  - subagents
  - cost
evidence: documentation-backed
wording: |-
  name: Explore
  description: Fast, read-only search and analysis of the codebase.
  tools: Read, Grep, Glob
  model: haiku
wordingLang: yaml
effect: "The built-in Explore subagent is a read-only agent for searching and analyzing codebases. Its model follows the parent conversation, except when the parent runs Fable: with a Claude subscription, an Anthropic Console account, or an LLM gateway reached through ANTHROPIC_BASE_URL, Explore runs on the Opus model that the opus alias resolves to; on Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, Claude Platform on AWS, or a Claude apps gateway, Explore stays on Fable. Official docs state that a user or project subagent named Explore overrides the built-in and keeps its own model field, so defining one with model: haiku runs exploration on a lower-cost model. Save the YAML above as frontmatter (wrapped in ---) in a subagent file; only name and description are required fields, and model selects Haiku."
limits: Keep the explicit tools allowlist (Read, Grep, Glob). A custom Explore replaces the built-in definition; without tools it inherits available tools, including write-capable ones. Calling it read-only in the description does not enforce that restriction. Put the file in ~/.claude/agents/ for all your projects, or in the project's .claude/agents/ directory. Identity comes from the name field, not the file path. A file with a name but no description is skipped. Setting CLAUDE_CODE_SUBAGENT_MODEL alone does not change the built-in Explore and Plan models; official docs describe a separate force flag if you want one model on every subagent. Cost savings depend on your workload and were not measured on this site. Third-party claims of a fixed cost multiple are not official figures and are not repeated here as results.
officialSource: &a1
  title: "Claude Code docs: Create custom subagents (Explore)"
  url: https://code.claude.com/docs/en/sub-agents
  kind: docs
discoverySource: &a2
  title: qyq5201314, 2026-11-12
  url: https://x.com/qyq5201314/status/2120751731034259714
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-22"
status: active
internalBriefing:
  - date: "2026-11-12"
    note: "Vibe Coding briefing: override the Explore subagent model"
publicSources:
  - *a1
  - *a2
---
