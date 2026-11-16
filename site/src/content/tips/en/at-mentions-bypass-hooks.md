---
title: "@ file mentions skip PreToolUse hooks"
slug: at-mentions-bypass-hooks
summary: Files you @-mention are inserted without a tool call, so PreToolUse hooks, including Read matchers, do not run unless you turn insertion off.
locale: en
tools:
  - claude-code
appliesTo: Claude Code. CLAUDE_CODE_DISABLE_FILE_MENTIONS requires v2.1.299 or later.
tags:
  - hooks
  - permissions
evidence: documentation-backed
wording: export CLAUDE_CODE_DISABLE_FILE_MENTIONS=1
wordingLang: bash
effect: "PreToolUse runs only when Claude calls a tool. By default, files you reference with @ in your prompt are added while Claude Code builds the prompt, without any tool call, so no PreToolUse hook fires for them, including hooks that match Read. Setting CLAUDE_CODE_DISABLE_FILE_MENTIONS=1 stops that insertion: Claude gets the mentioned paths with a note to read them using its file tools, and matching PreToolUse hooks then run if it does."
limits: Official hooks and environment-variable docs say to set the variable in your shell, user settings, or managed settings; Claude Code ignores it in project and local settings. To block specific paths from @ references without turning insertion off, add a Read deny rule for them. Official permissions docs say Claude Code makes a best-effort attempt to apply Read(path) deny rules to @file mentions. PreToolUse also does not fire for EndConversation. This site did not re-test hook firing around @ mentions.
officialSource: &a1
  title: "Claude Code hooks reference: PreToolUse and @ references"
  url: https://code.claude.com/docs/en/hooks#pretooluse
  kind: docs
discoverySource: &a2
  title: linklin63793, 2026-11-12
  url: https://x.com/linklin63793/status/2120894677679571312
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-16"
status: active
internalBriefing:
  - date: "2026-11-12"
    note: "Vibe Coding briefing: @ file references bypass PreToolUse hooks"
publicSources:
  - *a1
  - *a2
---
