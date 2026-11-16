---
title: 用 @ 引用文件会绕过 PreToolUse hook
slug: at-mentions-bypass-hooks
summary: 用 @ 提到的文件会在构建提示词时直接插入，不经过工具调用，因此 PreToolUse hook（包括匹配 Read 的 hook）默认不会触发；除非你关掉这种插入。
locale: zh
tools:
  - claude-code
appliesTo: Claude Code。CLAUDE_CODE_DISABLE_FILE_MENTIONS 需要 v2.1.299 或更高版本。
tags:
  - hooks
  - permissions
evidence: documentation-backed
wording: export CLAUDE_CODE_DISABLE_FILE_MENTIONS=1
wordingLang: bash
effect: PreToolUse 只在 Claude 发起工具调用时运行。默认情况下，你在提示词里用 @ 引用的文件会在 Claude Code 构建提示词时被加入，不经过任何工具调用，因此不会触发 PreToolUse hook，包括匹配 Read 的 hook。设置 CLAUDE_CODE_DISABLE_FILE_MENTIONS=1 后，这种插入会关闭：Claude 只会收到这些路径，并被提示用文件工具去读；如果它去读，匹配的 PreToolUse hook 就会运行。
limits: 官方 hooks 与环境变量文档写明：应在 shell、用户设置或托管设置里设置该变量；Claude Code 会忽略项目设置和本地设置里的该变量。若只想阻止特定路径被 @ 引用、但不关闭插入，可为这些路径添加 Read 拒绝规则。官方权限文档写明，Claude Code 会尽最大努力把 Read(path) 拒绝规则应用到提示词里的 @file 引用。EndConversation 同样不会触发 PreToolUse。本站未复测 @ 引用时 hook 是否触发。
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
