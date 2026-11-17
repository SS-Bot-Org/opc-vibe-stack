---
slug: 2026-w46-weekly
date: "2026-11-15"
title: "第 46 周 — hook 拦不住 @ 引用；未信任目录；独立上下文审查"
summary: "「规则 + hooks」现在要求通过 @ 引用测试敏感文件防护；安全速查新增已提交的本地设置与未信任目录检查；规格先行流程新增只读审查子代理。"
locale: zh
status: published
changes:
  - type: revised
    text: "写明 @ 文件引用不经过工具调用就进入提示词，因此 PreToolUse hook（包括匹配 Read 的）不会触发；新增第二条练习路径、Read 拒绝规则的尽力覆盖说明，以及 CLAUDE_CODE_DISABLE_FILE_MENTIONS 选项及其版本与作用域限制。"
    affectedPages:
      - /zh/articles/rules-hooks/
      - /en/articles/rules-hooks/
    evidence: documentation-backed
  - type: revised
    text: "新增两项检查：.claude/settings.local.json（保存的批准规则所在文件）是否被跟踪，以及是否在未信任目录启动 agent，包括 claude -p 在信任前会运行什么、可限制它的参数；Codex 只在项目受信任时加载项目配置。"
    affectedPages:
      - /zh/articles/security-quickcheck/
      - /en/articles/security-quickcheck/
    evidence: documentation-backed
  - type: revised
    text: "新增「先写会失败的测试」验收步骤，以及在没写代码的上下文里对照规格审查 diff 的步骤（/code-review、只读审查子代理模板、Codex /review）。"
    affectedPages:
      - /zh/articles/spec-first-agent-loop/
      - /en/articles/spec-first-agent-loop/
    evidence: documentation-backed
internalBriefing:
  - date: "2026-11-10"
    note: "Check whether .claude/settings.local.json is committed"
  - date: "2026-11-12"
    note: "@ file references skip PreToolUse hooks"
  - date: "2026-11-13"
    note: "Tests before code; don't start agents in ~/Downloads"
  - date: "2026-11-15"
    note: "Separate writing and reviewing contexts"
publicSources:
  - title: "Hooks reference: PreToolUse and @ references (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks"
    kind: docs
  - title: "Configure permissions: Read rules, workspace trust (Claude Code)"
    url: "https://code.claude.com/docs/en/permissions"
    kind: docs
  - title: "Settings files and scopes (Claude Code)"
    url: "https://code.claude.com/docs/en/settings"
    kind: docs
  - title: "Claude Code best practices"
    url: "https://code.claude.com/docs/en/best-practices"
    kind: docs
  - title: "Codex advanced configuration"
    url: "https://developers.openai.com/codex/config-advanced"
    kind: docs
  - title: "Codex CLI slash commands"
    url: "https://developers.openai.com/codex/cli/slash-commands"
    kind: docs
---

本周按简报暴露出的三个缺口做了一轮有文档依据的修订。每条说法都已于 2026-11-15 对照上面列出的厂商文档核对；新增步骤均未在本站实测。带未验证数字的社交帖（泄露密钥数量、审查工具对比、降本比例）没有收录。首页三个主推工具保持不变。
