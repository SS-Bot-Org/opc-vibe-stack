---
title: 负责拦截的 hook 要设成失败即拦截
slug: hooks-fail-closed
summary: 让同步 PreToolUse 拦截 hook 在脚本缺失、超时或崩溃时拒绝本次工具调用。
locale: zh
tools:
  - claude-code
appliesTo: Claude Code。command 与 HTTP hook 需要 v2.1.295 或更高版本；mcp_tool hook 需要 v2.1.328 或更高版本。
tags:
  - hooks
  - security
evidence: documentation-backed
wording: '"onFailure": "block"'
wordingLang: text
effect: 对同步 command、http 或 mcp_tool 拦截 hook 设置 onFailure 为 block 后，PreToolUse 上的故障会拒绝工具调用。在 PermissionRequest 上，启用该字段后发生故障会直接拒绝权限请求；仅返回退出码 2 则继续原有权限流程。
limits: 对 Stop、SubagentStop、TaskCompleted、TeammateIdle 和后台（async / asyncRewake）hook 不起作用。2.1.329 changelog（2026-11-19）改了 Code Mode：PreToolUse hook 出错时，除非设置了这个字段，否则不再拒绝脚本发起的工具调用。只给负责拦截必须拒绝之事的 hook 设置；hook 服务不稳定时，它也会拦住日常操作。官方的测试方法是把匹配 Bash 的同步 PreToolUse 命令 hook 指向一个不存在的脚本，再让 Claude 跑 ls；本站未跑过这个测试。
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
