---
slug: 2026-w45-weekly
date: "2026-11-08"
title: "第 45 周 — 共用一份规则源，权限规则真正强制"
summary: "「规则 + hooks」与 Claude Code 卡片现已说明如何以 AGENTS.md 为唯一规则源、用权限规则兜底禁区，以及有副作用的 skill 仅允许手动触发。"
locale: zh
status: published
changes:
  - type: revised
    text: "新增「全工具共用一份规则源」步骤与模板：CLAUDE.md 首行用 @AGENTS.md 导入（或不保留 CLAUDE.md，因 Claude Code 可直接读 AGENTS.md），并说明符号链接选项及其 Windows 注意点。"
    affectedPages:
      - /zh/articles/rules-hooks/
      - /en/articles/rules-hooks/
      - /zh/articles/claude-code/
      - /en/articles/claude-code/
    evidence: documentation-backed
  - type: revised
    text: "在规则文件与 hooks 之间新增强制层：权限规则（permissions.deny / ask），并写明 Bash 规则只匹配命令文本、不是沙箱这一官方限制。"
    affectedPages:
      - /zh/articles/rules-hooks/
      - /en/articles/rules-hooks/
      - /zh/articles/claude-code/
      - /en/articles/claude-code/
    evidence: documentation-backed
  - type: revised
    text: "引用 Anthropic「CLAUDE.md 200 行以内」目标，以及 import 不降低上下文占用；有副作用的 SKILL.md 模板现使用 disable-model-invocation: true，并补充 context: fork 说明。"
    affectedPages:
      - /zh/articles/rules-hooks/
      - /en/articles/rules-hooks/
    evidence: documentation-backed
internalBriefing:
  - date: "2026-11-07"
    note: "Layered Claude Code runtime; lean CLAUDE.md; manual-only side-effect skills"
  - date: "2026-11-08"
    note: "One AGENTS.md source with CLAUDE.md import; prompts don't enforce permissions"
publicSources:
  - title: "How Claude remembers your project (CLAUDE.md, AGENTS.md, imports)"
    url: "https://code.claude.com/docs/en/memory"
    kind: docs
  - title: "Configure permissions (Claude Code)"
    url: "https://code.claude.com/docs/en/permissions"
    kind: docs
  - title: "Extend Claude with skills (SKILL.md)"
    url: "https://code.claude.com/docs/en/skills"
    kind: docs
---

基于官方文档的修订：明确 agent 规则放在哪一层、哪一层真正强制执行。本周无新增页面；简报中的生图与短剧条目不在本次范围内。
