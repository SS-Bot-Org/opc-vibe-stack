---
title: 需要最新网页时，再让 Codex 实时搜索
slug: codex-live-web-search
summary: 本地 Codex 默认搜索缓存索引。答案取决于之后才发布的页面时，单次运行加 --search。
locale: zh
tools:
  - codex
appliesTo: Codex CLI 本地会话，按 2026-11-22 打开的网页搜索文档。
tags:
  - search
  - config
evidence: documentation-backed
wording: codex --search "Summarize the latest release notes for this dependency"
wordingLang: bash
effect: 官方网页搜索文档写明：本地 Codex 默认使用缓存搜索，结果来自 OpenAI 维护的索引，而不是实时抓取网页；这能降低提示注入风险，但不能消除。传入 --search 后，本次运行会实时抓取结果。想改默认值，在 config.toml 里设 web_search = "live"；"disabled" 关闭该工具，"indexed" 只在搜索索引放行请求时才允许外部访问。
limits: 实时结果会增加提示注入风险，每条结果都要当作不可信输入。以完全访问权限运行时，搜索默认就是实时的。网页搜索是托管工具：沙箱网络代理和域名白名单对它不起作用，关掉命令的网络访问后它也可能仍然可用。本站未测量。
officialSource: &a1
  title: "Web search (Codex CLI and local search modes)"
  url: https://learn.chatgpt.com/docs/web-search
  kind: docs
dateAdded: "2026-11-22"
lastVerified: "2026-11-22"
status: active
internalBriefing:
  - date: "2026-11-18"
    note: "Vibe Coding briefing tip: Codex searches a cache by default; use --search for live results"
publicSources:
  - *a1
---
