---
title: Claude Code 的沙箱管不到 Read 工具
slug: sandbox-covers-shell-only
summary: 沙箱只包住 shell 命令。要挡住文件工具读取，用 Read 拒绝规则；沙箱里的 denyRead 挡不住 Read 工具。
locale: zh
tools:
  - claude-code
appliesTo: Claude Code 内置沙箱（沙箱化的 Bash 工具）与权限规则，按 2026-11-22 的官方文档。
tags:
  - sandbox
  - permissions
  - security
evidence: documentation-backed
wording: '"permissions": { "deny": ["Read(./.env)", "Read(./secrets/**)"] }'
wordingLang: text
effect: 官方沙箱文档写明：沙箱包住的是 Claude 运行的 shell 命令及其启动的进程。Read、Edit、Write、WebFetch、WebSearch 改由权限规则管理：沙箱里的 denyRead 挡不住 Read 工具，allowedDomains 也限制不了 WebFetch。要阻止 Claude 的文件工具读取某个路径，靠的是设置里的 Read 拒绝规则。
limits: command hook、本地 MCP server、状态栏命令和 apiKeyHelper 都在沙箱之外、以你的完整权限运行。默认情况下，沙箱内的命令仍能读到机器上的大部分文件，包括 ~/.ssh 和 ~/.aws/credentials，除非你另加 denyRead 或 credentials 条目。沙箱默认关闭（用 /sandbox 或 sandbox.enabled 开启）。Read 拒绝规则作用于文件工具，不覆盖所有子进程。本站未复测这些边界。
officialSource: &a1
  title: "Claude Code docs: Configure the sandboxed Bash tool (what runs outside the sandbox)"
  url: https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox
  kind: docs
discoverySource: &a2
  title: leocx66, 2026-11-18
  url: https://x.com/leocx66/status/2122879897559302525
  kind: x
dateAdded: "2026-11-22"
lastVerified: "2026-11-22"
status: active
internalBriefing:
  - date: "2026-11-18"
    note: "Vibe Coding briefing tip: Claude Code sandbox covers shell commands only"
publicSources:
  - *a1
  - title: "Claude Code docs: Configure permissions (Read deny rules)"
    url: https://code.claude.com/docs/en/permissions
    kind: docs
  - *a2
---
