---
title: 导入 Codex 配置前先做 dry-run
slug: import-codex-dry-run
summary: 先运行 claude import codex --dry-run，预览从 Codex 导入到 Claude Code 会改什么，确认后再真正导入。
locale: zh
tools:
  - claude-code
  - codex
appliesTo: Claude Code v2.1.213 或更高版本。该命令把 Codex 的配置导入 Claude Code。
tags:
  - migration
  - cli
evidence: documentation-backed
wording: claude import codex --dry-run
wordingLang: bash
effect: claude import [source] 会启动一个交互会话，并运行 /import，把其他编程 agent 的配置带进 Claude Code。它接受与会话内命令相同的 --dry-run 和 --yes 选项。官方示例就是 claude import codex --dry-run。
limits: 官方 CLI 文档写明：该命令在 Amazon Bedrock、Google Cloud 的 Agent Platform、Microsoft Foundry 或 Claude Platform on AWS 上不可用；关闭 feature-flag 获取时也不可用。本站未独立核对它会复制哪些文件，也不声称导入结果会与之后的 Codex 变更保持同步。查看 dry-run 输出后，再考虑是否加上 --yes。
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
