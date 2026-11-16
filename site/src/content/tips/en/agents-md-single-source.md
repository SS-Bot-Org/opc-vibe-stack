---
title: Keep one instruction file and import it
slug: agents-md-single-source
summary: Put shared rules in AGENTS.md. If you also have a CLAUDE.md, import that file with @AGENTS.md so Claude Code does not skip it.
locale: en
tools:
  - claude-code
appliesTo: Claude Code. Direct AGENTS.md loading requires v2.1.277 or later; the import works as documented on the memory page opened 2026-11-16.
tags:
  - memory
  - agents-md
evidence: documentation-backed
wording: "@AGENTS.md"
wordingLang: markdown
effect: "If a repository has both AGENTS.md and a CLAUDE.md or CLAUDE.local.md in the working directory or above it, Claude Code reads the CLAUDE.md files only. A CLAUDE.md that imports AGENTS.md loads both: the CLAUDE.md plus the imported AGENTS.md. Other agents that read AGENTS.md can then share the same source file. Put the import line in CLAUDE.md; a one-line file that only contains @AGENTS.md is the pattern the discovery post described."
limits: Official docs say reading AGENTS.md directly, with no CLAUDE.md, requires Claude Code v2.1.277 or later, and that in some sessions Claude cannot read AGENTS.md, so you should import it from a CLAUDE.md there instead. A CLAUDE.local.md also counts as a CLAUDE.md for this check, so adding one in a project that relies on AGENTS.md stops Claude from reading AGENTS.md unless you import it or change the Project instructions setting (for example to claude-md-and-agents-md). Imports use @path/to/import syntax; wrap a path in backticks if you want to mention it without importing it. Relative import paths resolve relative to the file that contains the import. This site did not measure how often a one-line CLAUDE.md is sufficient in practice.
officialSource: &a1
  title: "Claude Code docs: How Claude remembers your project (AGENTS.md)"
  url: https://code.claude.com/docs/en/memory#agentsmd
  kind: docs
discoverySource: &a2
  title: Tcheav_, 2026-11-13
  url: https://x.com/Tcheav_/status/2120912148411072758
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-16"
status: active
internalBriefing:
  - date: "2026-11-13"
    note: "Vibe Coding briefing: keep one rules file and import it from CLAUDE.md"
publicSources:
  - *a1
  - *a2
---
