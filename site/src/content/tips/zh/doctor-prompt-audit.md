---
title: 用 /doctor prompt-audit 检查规则文件
slug: doctor-prompt-audit
summary: 在会话里运行 /doctor prompt-audit，可得到过时、失效或互相矛盾的规则文件报告；未经你要求，它不会改文件。
locale: zh
tools:
  - claude-code
appliesTo: Claude Code v2.1.283 或更高版本，需在会话内运行。
tags:
  - memory
  - audit
evidence: documentation-backed
wording: /doctor prompt-audit
wordingLang: text
effect: 在会话中运行 /doctor prompt-audit，会检查规则文件是否存在为旧模型写的说明、指向已不存在的文件或命令的引用，以及互相矛盾的文件。你会拿到一份带修改建议的报告；在你要求应用之前，它不会改任何文件。默认覆盖 CLAUDE.md、CLAUDE.local.md 和 AGENTS.md，以及 .claude/ 与 ~/.claude/ 下的 rules、skills、commands、子代理和输出样式。加上路径可只检查一处，例如 /doctor prompt-audit .claude/skills/deploy。
limits: 该检查通过捆绑的 /claude-api skill 运行。若该 skill 在 skillOverrides 中被关闭，或使用了 disableBundledSkills，则不可用。它与 /doctor（会话内的安装与配置体检）以及终端里的 claude doctor（只读安装诊断）不是同一条命令。本站未衡量这些修改建议有多经常是正确的。
officialSource: &a1
  title: "Claude Code docs: Audit your instruction files"
  url: https://code.claude.com/docs/en/memory#audit-your-instruction-files
  kind: docs
discoverySource: &a2
  title: The_Tradesman1, 2026-11-14
  url: https://x.com/The_Tradesman1/status/2121439449343234121
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-16"
status: active
internalBriefing:
  - date: "2026-11-14"
    note: "Vibe Coding briefing: /doctor prompt-audit for instruction files"
publicSources:
  - *a1
  - *a2
---
