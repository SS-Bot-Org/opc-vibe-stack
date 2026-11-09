---
slug: 2026-w45-illustrations
date: "2026-11-09"
title: "第 45 周 — 规则/hooks 五层示意图 + 插图门禁"
summary: "为 rules-hooks 增加共用的亮/暗色五层控制面 SVG，完善 figure 样式，并在构建校验中要求本地 img 可解析且具备 alt 规则。"
locale: zh
status: published
changes:
  - type: added
    text: "新增主题感知的五层 Agent 控制面 SVG：英文页用英文亮/暗图，中文页用中文标注亮/暗图，并在 rules-hooks 配本地说明。"
    affectedPages:
      - /zh/articles/rules-hooks/
      - /en/articles/rules-hooks/
    evidence: tested
  - type: revised
    text: "全站微调 FLOW、callout 与表格样式；构建产物校验现要求本地 img[src] 可解析，且具备 alt 或 data-decorative。"
    affectedPages:
      - /zh/articles/rules-hooks/
      - /en/articles/rules-hooks/
    evidence: tested
internalBriefing: []
publicSources:
  - title: "How Claude remembers your project (CLAUDE.md, AGENTS.md, imports)"
    url: "https://code.claude.com/docs/en/memory"
    kind: docs
  - title: "Configure permissions (Claude Code)"
    url: "https://code.claude.com/docs/en/permissions"
    kind: docs
---

插图基建试点：仅概念示意图（无 AI 封面、无伪造界面截图）。
