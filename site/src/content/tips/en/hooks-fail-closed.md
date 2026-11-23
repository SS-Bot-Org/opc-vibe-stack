---
title: Make guard hooks block when they fail
slug: hooks-fail-closed
summary: Add onFailure block to a hook that must refuse an action, so a missing script, timeout, or crash blocks the call instead of letting it run.
locale: en
tools:
  - claude-code
appliesTo: Claude Code v2.1.295 or later for command and HTTP hooks; v2.1.328 or later for mcp_tool hooks.
tags:
  - hooks
  - security
evidence: documentation-backed
wording: '"onFailure": "block"'
wordingLang: text
effect: "Official hooks docs say that on most events a hook that fails or times out still lets the action go ahead, so a guard with a wrong path or a crashing script lets everything through. With onFailure set to block on a command, http, or mcp_tool hook, a failure (can't start, timeout, exit code other than 0 or 2, invalid output) does what exit 2 does on that event; on PreToolUse, the tool call is refused."
limits: "No effect on Stop, SubagentStop, TaskCompleted, TeammateIdle, or background (async / asyncRewake) hooks. The 2.1.329 changelog (2026-11-19) changed Code Mode so an erroring PreToolUse hook no longer refuses a script's tool call unless this field is set. Use it only on hooks that guard something you must refuse; on a flaky hook service it will also block routine work. The docs' test is to point the hook at a missing script and ask for ls; this site has not run that test."
officialSource: &a1
  title: "Claude Code hooks reference: Block the action when a hook fails"
  url: https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails
  kind: docs
dateAdded: "2026-11-22"
lastVerified: "2026-11-22"
status: active
internalBriefing:
  - date: "2026-11-20"
    note: "Vibe Coding briefing tip: security hooks should set onFailure block (2.1.329)"
publicSources:
  - *a1
  - title: "Claude Code changelog (2.1.328, 2.1.329)"
    url: https://code.claude.com/docs/en/changelog
    kind: docs
---
