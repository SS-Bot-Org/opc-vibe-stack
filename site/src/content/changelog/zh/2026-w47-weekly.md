---
slug: 2026-w47-weekly
date: "2026-11-22"
title: "第 47 周：Google Antigravity 进入主推三款工具；hook 失败即拦截；审查仓库里的 agent 配置"
summary: "新增 Google Antigravity 工具指南，在主推三款工具中替换 Grok Build；修订 hooks、安全与 Codex 指南；新增四条有官方文档依据的技巧。"
locale: zh
status: published
changes:
  - type: added
    text: "销售阶段新增 Google Antigravity 工具指南：为一处面向买家的改动做计划，让 agent 在浏览器里走查路径，再审阅 walkthrough 和截图。内容依据 2026-11-22 打开的官方文档编写，本站未实际运行。不限语言的 X 查询连续七天都有相关讨论，另行抽查的中文帖子也在讨论这款产品（见 PR #11）。本周首页将它列入主推三款工具，替换 Grok Build。Grok Build 指南继续保留并加了提示，在工具栈页的“曾经主推的工具”中列出。"
    affectedPages:
      - /en/articles/antigravity/
      - /zh/articles/antigravity/
      - /en/articles/grok-build/
      - /zh/articles/grok-build/
      - /en/stack/
      - /zh/stack/
      - /en/
      - /zh/
    evidence: documentation-backed
  - type: revised
    text: "新增一步：用 onFailure block 让策略类 hook 失败即拦截（版本要求、它不覆盖的事件，以及 2.1.329 对 Code Mode 的改动）；并说明 Claude Code 沙箱只包住 shell 命令，沙箱里的 denyRead 挡不住 Read 工具。"
    affectedPages:
      - /en/articles/rules-hooks/
      - /zh/articles/rules-hooks/
    evidence: documentation-backed
  - type: revised
    text: "新增一步：像审代码一样审 agent 配置文件——Bitdefender（2026-11-17）和 Google 威胁情报团队（2026-11-16）报告描述的手法、信任克隆仓库前要读哪些文件、2.1.329 信任对话框的 hook 提示，以及给 agent 配置路径设 CODEOWNERS 审核。事件细节来自厂商报告，本站未复现。"
    affectedPages:
      - /en/articles/security-quickcheck/
      - /zh/articles/security-quickcheck/
    evidence: documentation-backed
  - type: revised
    text: "新增升级后检查：Codex CLI 0.171.0 把 GPT-6.2 Sol 设为模型目录默认选项；本地网页搜索默认使用缓存索引（实时结果用 --search 或 web_search = \"live\"）。"
    affectedPages:
      - /en/articles/codex/
      - /zh/articles/codex/
    evidence: documentation-backed
  - type: added
    text: "新增四条技巧，均已于 2026-11-22 对照官方来源核对：拦截类 hook 的 onFailure block、沙箱不覆盖 Read 工具、Codex 实时搜索，以及用 cleanupPeriodDays 保留会话。已有的六条技巧也重新对照了来源，没有需要下线的。"
    affectedPages:
      - /en/tips/
      - /zh/tips/
      - /en/tips/#hooks-fail-closed
      - /zh/tips/#hooks-fail-closed
      - /en/tips/#sandbox-covers-shell-only
      - /zh/tips/#sandbox-covers-shell-only
      - /en/tips/#codex-live-web-search
      - /zh/tips/#codex-live-web-search
      - /en/tips/#keep-session-transcripts
      - /zh/tips/#keep-session-transcripts
    evidence: documentation-backed
internalBriefing:
  - date: "2026-11-17"
    note: "Committed .claude/settings.json used to deliver a backdoor (GTIG report)"
  - date: "2026-11-18"
    note: "Sandbox scope; Codex cached web search"
  - date: "2026-11-19"
    note: "Malicious repositories targeting agent instruction files; cleanupPeriodDays; Gemini 4 Neon in Antigravity"
  - date: "2026-11-20"
    note: "Claude Code 2.1.329 onFailure and trust dialog; Codex CLI 0.171.0; Antigravity 2.34.0"
publicSources:
  - title: "PR #11：主推工具调整所用的 X 查询"
    url: "https://github.com/SS-Bot-Org/opc-vibe-stack/pull/11"
    kind: other
  - title: "Google Antigravity docs: Browser use"
    url: "https://antigravity.google/docs/browser/"
    kind: docs
  - title: "Google Antigravity changelog"
    url: "https://antigravity.google/docs/changelog/"
    kind: docs
  - title: "Claude Code hooks reference: block the action when a hook fails"
    url: "https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails"
    kind: docs
  - title: "Claude Code changelog"
    url: "https://code.claude.com/docs/en/changelog"
    kind: docs
  - title: "Claude Code: Configure the sandboxed Bash tool"
    url: "https://code.claude.com/docs/en/sandboxing"
    kind: docs
  - title: "Bitdefender Labs: AI agents as targets in a GitHub malware campaign"
    url: "https://www.bitdefender.com/en-us/blog/labs/how-ai-agents-become-new-targets-in-github-malware-campaign"
    kind: blog
  - title: "Google Threat Intelligence Group: agentic threat activity report"
    url: "https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold"
    kind: blog
  - title: "Codex CLI 0.171.0 release notes"
    url: "https://github.com/openai/codex/releases/tag/rust-v0.171.0"
    kind: docs
  - title: "Web search (Codex)"
    url: "https://learn.chatgpt.com/docs/web-search"
    kind: docs
  - title: "Claude Code settings reference: cleanupPeriodDays"
    url: "https://code.claude.com/docs/en/settings-reference#cleanupperioddays"
    kind: docs
---

本周简报的文档核对。每条新说法都已于 2026-11-22 对照上面列出的厂商页面核实；这批内容没有在本站实际运行或测量。未收录：数字无法追溯到一手来源的社交帖子（节省 token 的百分比、小样本的 agent 对比）、Claude Code 2.1.330 已使其不再必要的网关输出上限技巧，以及未经审查的第三方工具。
