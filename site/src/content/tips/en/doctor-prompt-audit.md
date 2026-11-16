---
title: Audit instruction files with /doctor prompt-audit
slug: doctor-prompt-audit
summary: Run /doctor prompt-audit to get a report of outdated, missing, or conflicting instruction files. Nothing is edited until you ask.
locale: en
tools:
  - claude-code
appliesTo: Claude Code v2.1.283 or later, inside a session.
tags:
  - memory
  - audit
evidence: documentation-backed
wording: /doctor prompt-audit
wordingLang: text
effect: In a session, /doctor prompt-audit checks instruction files for problems such as instructions written for older models, references to files or commands that do not exist, and files that contradict each other. You get a report of findings with proposed edits, and nothing in your files changes until you ask Claude to apply them. By default it covers CLAUDE.md, CLAUDE.local.md, and AGENTS.md, plus the rules, skills, commands, subagents, and output styles under .claude/ and ~/.claude/. Pass a path to limit the audit, for example /doctor prompt-audit .claude/skills/deploy.
limits: The audit runs through the bundled /claude-api skill. It is unavailable while that skill is turned off in skillOverrides or with disableBundledSkills. This is not the same as /doctor (the in-session setup checkup) or claude doctor (read-only installation diagnostics from the terminal). This site did not measure how often the audit's proposed edits are correct.
officialSource: &a1
  title: "Claude Code docs: Audit your instruction files"
  url: https://code.claude.com/docs/en/memory#audit-your-instruction-files
  kind: docs
discoverySource: &a2
  title: The_Tradesman1, 2026-11-14
  url: https://x.com/The_Tradesman1/status/2121439449343234121
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-16"
status: active
internalBriefing:
  - date: "2026-11-14"
    note: "Vibe Coding briefing: /doctor prompt-audit for instruction files"
publicSources:
  - *a1
  - *a2
---
