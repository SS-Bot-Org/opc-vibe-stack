---
slug: 2026-w45-weekly
date: "2026-11-08"
title: "Week 45 — One shared rules file, permissions that actually enforce"
summary: "Rules + hooks and the Claude Code card now show how to keep AGENTS.md as the single rules source, back no-gos with permission rules, and keep side-effect skills manual-only."
locale: en
status: published
changes:
  - type: revised
    text: "Added a step and template for keeping AGENTS.md as the one rules file: CLAUDE.md starts with an @AGENTS.md import (or is omitted, since Claude Code can read AGENTS.md directly), with the symlink option and its Windows caveat."
    affectedPages:
      - /en/articles/rules-hooks/
      - /zh/articles/rules-hooks/
      - /en/articles/claude-code/
      - /zh/articles/claude-code/
    evidence: documentation-backed
  - type: revised
    text: "Added permission rules (permissions.deny / ask) as an enforced layer between rules files and hooks, including the documented limit that Bash rules match command text and are not a sandbox."
    affectedPages:
      - /en/articles/rules-hooks/
      - /zh/articles/rules-hooks/
      - /en/articles/claude-code/
      - /zh/articles/claude-code/
    evidence: documentation-backed
  - type: revised
    text: "Cited Anthropic's under-200-lines CLAUDE.md target and that imports don't cut context cost; the SKILL.md template now uses disable-model-invocation: true for a skill with side effects, with a note on context: fork."
    affectedPages:
      - /en/articles/rules-hooks/
      - /zh/articles/rules-hooks/
    evidence: documentation-backed
internalBriefing:
  - date: "2026-11-07"
    note: "Layered Claude Code runtime; lean CLAUDE.md; manual-only side-effect skills"
  - date: "2026-11-08"
    note: "One AGENTS.md source with CLAUDE.md import; prompts don't enforce permissions"
publicSources:
  - title: "How Claude remembers your project (CLAUDE.md, AGENTS.md, imports)"
    url: "https://code.claude.com/docs/en/memory"
    kind: docs
  - title: "Configure permissions (Claude Code)"
    url: "https://code.claude.com/docs/en/permissions"
    kind: docs
  - title: "Extend Claude with skills (SKILL.md)"
    url: "https://code.claude.com/docs/en/skills"
    kind: docs
---

Documentation-backed pass on where agent rules live and which layer actually enforces them. No new pages this week; image and short-drama items from the briefings were out of scope.
