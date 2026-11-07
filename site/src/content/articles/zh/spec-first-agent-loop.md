---
title: "先写规格，再让 agent 改代码"
slug: spec-first-agent-loop
summary: "在任何 agent 改仓库前先写清结果与验收——用 Spec Kit 或手写短切片均可。"
locale: zh
category: guide
stage: research
tools: [claude-code, codex, grok-build]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code、Codex 或 Grok Build 任一；已安装时可用 Spec Kit skills；配合仓库验证命令"
updated: "2026-11-06"
internalBriefing:
  - date: "2026-11-01"
    note: "Spec Kit / specify-before-code brief"
  - date: "2026-11-03"
    note: "Spec Kit reinforcement"
  - date: "2026-11-04"
    note: "Voice→tech-spec and clear task framing"
  - date: "2026-11-05"
    note: "Boundary → stories → acceptance before code"
publicSources:
  - title: "Spec Kit quickstart (GitHub)"
    url: "https://github.github.com/spec-kit/quickstart.html"
    kind: docs
  - title: "github/spec-kit repository"
    url: "https://github.com/github/spec-kit"
    kind: docs
  - title: "Spec Kit: define the plan before the AI writes code"
    url: "https://x.com/Arindam_1729/status/2116733735613956579"
    kind: x
  - title: "Voice-dump idea → technical spec → coding agent"
    url: "https://x.com/DeepStarts/status/2117851814129451496"
    kind: x
  - title: "Clear task / outcome / done / don’t (practice tip)"
    url: "https://x.com/DDXG_99/status/2117853995985441174"
    kind: x
tags: [research, spec, workflow]
---

## 结论

多数 agent 失败来自目标欠规格。先写结果、约束与验证步骤，再让 agent 改。优先结构化的 specify → plan → tasks → implement（GitHub Spec Kit 或等价短切片），而不是含糊的「弄好一点」。

## 前置条件

- 有版本控制的仓库（或新建文件夹）
- 一条能证明「现阶段够好」的命令
- 可选：为编码 agent 安装 Spec Kit（按当前文档 `specify init` / agent skills）

## 步骤

1. **五句话抓住问题：** 用户、痛点、成功信号、非目标、截止日期。
2. **写验收检查：** 陌生人能勾的子弹（UI 路径、CLI 输出或测试名）。
3. **冻结本切片接口：** 不得漂移的路由、文件边界或 API 形状。
4. **优先先规格后代码。** 用 Spec Kit（或同样逻辑手写）：每项目做一次 constitution / 边界，再 specify → clarify → plan → tasks → implement → converge。没有验收标准就不开实现。Spec Kit 的星标与社交热度是发帖人主张——用官方 quickstart，不要用数字。
5. **可选：先语音或聊天倾倒。** 想法半熟时，把功能、栈与逻辑倒进推理聊天，再请它产出无歧义技术规格（架构、目录、数据流、边界情况、实现步骤），再把文档交给 Claude Code / Codex / Grok Build。此步是社区实践提示——在你自己 dogfood 前标为**未验证**。
6. **用四个字段提示，不要注水。** 优先：完成什么任务；成品长什么样；如何知道完成；绝对不能做什么。跳过空洞的「仔细想 / 一步步」。社区引用 Claude Code 提示实践——作为性能主张仍**未验证**。
7. **只把本切片交给 agent。** 在提示/规则里禁止顺手大重构。
8. **验证后再提交。** 验证失败就修或回滚——不要叠新功能。

## 模板字段

```text
用户：
问题：
成功信号：
非目标 / 绝对不做：
验证命令：
范围内文件：
禁止文件：
规格产物路径（spec.md / plan.md / tasks.md 或等价）：
```

## 完成定义

你能指着书面规格（或 Spec Kit 产物）以及 agent 动过切片的绿色验证命令。

## 反模式

- 「弄好一点」却没有验收检查
- 让 agent 在飞行中发明架构却不更新规格
- 把半成品想法直接塞进编码 agent 然后永远调试
- 把社交星标数当成工作流适合你 OPC 的证明

## 来源

frontmatter 列出 Spec Kit 文档（先规格后代码流程的主要依据）以及促使本周修订的 X 帖。语音倾倒与四字段提示仍是实践报告，除非你亲自复现。
