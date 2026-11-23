---
title: 写明代码归谁所有
slug: say-who-owns-the-code
summary: 若希望 Claude Fable 5.2 合并重复代码，在提示词里写明这套代码库归它所有、由它长期维护。
locale: zh
tools:
  - claude-fable
appliesTo: Claude Fable 5.2，用于系统提示词或 agent 套具。这是模型侧说明，不只适用于 Claude Code。
tags:
  - prompt
  - ownership
evidence: documentation-backed
wording: You are the owner and long-term maintainer of this codebase, and its design is up to you.
wordingLang: text
effect: 在 Anthropic 对小型编码任务的测试中，若提示词不提所有权，或把代码库说成别人的，Claude Fable 5.2 往往只在现有结构上追加，哪怕会重复已有代码。当提示词写明代码库归模型自己时，它常常会合并重复代码，有时还会在未被要求的情况下做相关修复。在这些小型编码任务上，Anthropic 报告：没有这句时，合并出现在不到 10% 的运行里；有这句时，约 75% 的运行会合并。
limits: "上述数字来自 Anthropic 对小型编码任务的测试，本站未复测。使用该提示词后，输出 token 约增加 70% 到 80%，模型还会做一些未被要求的改动，其中许多是新测试和文档。在部分运行里，它还改变了已有功能的行为。限制范围的规则并不会抵消这一效果：在 Anthropic 的测试中，即使同一提示词前面写了 “No drive-by refactors, renames or cleanups”，模型仍在一半以上的运行里合并了重复代码。若代码归用户所有、且希望尽量少改，就不要加这句。请同时审查报告的 diff 和拉取请求摘要，后者常常漏掉小改动。Simon Willison 2026-11-10 的帖子是发现来源，它引用的是该节当时公布的较早措辞（“This codebase is yours: what it's for and how it's built are your call, and you'll keep building on it.”）和较早数字（有这句时约一半尝试会合并，没有时不到十分之一；该结果在较长的系统提示词中仍然成立）。上面的可复制句子和数字，以 2026-11-16 查阅的官方指南为准。"
officialSource: &a1
  title: "Anthropic, Prompting Claude Fable 5.2: Say who owns the code"
  url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2#say-who-owns-the-code
  kind: docs
discoverySource: &a2
  title: Simon Willison, 2026-11-10
  url: https://x.com/simonw/status/2120029347948220500
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-22"
status: active
internalBriefing: []
publicSources:
  - *a1
  - *a2
---
