---
title: "Codex"
slug: codex
summary: "OpenAI 的编码 agent/CLI——适合有清晰规格的并行任务与仓库编辑。"
locale: zh
category: stack
stage: build
tools: [codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "OpenAI Codex CLI/agent；跟步骤前请确认当前产品名与版本"
updated: "2026-11-06"
internalBriefing: []
publicSources:
  - title: "OpenAI Codex documentation"
    url: "https://developers.openai.com/codex"
    kind: docs
tags: [stack, build]
toolId: codex
toolAvailability: active
bestFor: "规格驱动的编码任务、可批处理的编辑、以 CLI 为中心的流程。"
poorFit: "没有验收测试的模糊点子；跳过对安全敏感 diff 的人工审阅。"
caveats: "产品界面会演进；升级后请固定文档链接并复查命令。"
---

## 结论

当你有书面任务边界、希望编码 agent 按明确检查在仓库中执行时，使用 Codex。

## 前置条件

- 能使用当前 Codex CLI 或文档中的编码 agent 界面
- 仓库有可运行的验证步骤

## 步骤

1. 对照官方 Codex 文档确认安装与鉴权。
2. 写短任务说明：目标、范围内文件、范围外、验证命令。
3. 一次只跑一个任务；无关任务之间清上下文。
4. 合并前审阅 diff——尤其依赖、鉴权与部署文件。

## 模板字段

- 任务目标：
- 范围内 / 范围外：
- 验证命令：

## 完成定义

有范围的任务产出可审阅的 diff，且通过验证命令。

## 反模式

- 一次会话塞多个无关目标
- 不看 lockfile diff 就接受依赖变更

## 来源

见 frontmatter `publicSources`。
