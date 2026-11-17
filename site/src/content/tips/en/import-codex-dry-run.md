---
title: Preview a Codex import before applying it
slug: import-codex-dry-run
summary: Run claude import codex --dry-run to preview what a Codex-to-Claude Code import would change before you apply it.
locale: en
tools:
  - claude-code
  - codex
appliesTo: Claude Code v2.1.213 or later. The command imports from Codex into Claude Code.
tags:
  - migration
  - cli
evidence: documentation-backed
wording: claude import codex --dry-run
wordingLang: bash
effect: claude import [source] starts an interactive session that runs /import to bring configuration from other coding agents into Claude Code. The same --dry-run and --yes options as the in-session command are accepted. The documented example is claude import codex --dry-run.
limits: Official CLI docs say this is not available on Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, or Claude Platform on AWS, and is also unavailable when feature-flag fetching is turned off. This site did not independently list every file the import copies, and does not claim that the result stays in sync with later Codex changes. Review the dry-run output before adding --yes.
officialSource: &a1
  title: "Claude Code CLI reference: claude import"
  url: https://code.claude.com/docs/en/cli-reference
  kind: docs
discoverySource: &a2
  title: linklin63793, 2026-11-13
  url: https://x.com/linklin63793/status/2121212612172288493
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-16"
status: active
internalBriefing:
  - date: "2026-11-13"
    note: "Vibe Coding briefing: preview Codex imports with --dry-run"
publicSources:
  - *a1
  - *a2
---
