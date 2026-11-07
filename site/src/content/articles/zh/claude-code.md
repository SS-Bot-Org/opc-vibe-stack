---
title: "Claude Code"
slug: claude-code
summary: "擅长交互式编码循环、计划与仓库感知的 agent 会话。"
locale: zh
category: stack
stage: build
tools: [claude-code]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code（Anthropic CLI/agent）；跟步骤前请确认当前版本"
updated: "2026-11-06"
internalBriefing: []
publicSources:
  - title: "Claude Code overview"
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
    kind: docs
tags: [stack, build]
toolId: claude-code
toolAvailability: active
bestFor: "仓库内 agent 循环、先计划再实现、用规则/hooks 强制约束。"
poorFit: "没有验证命令的盲目一次生成；把聊天记忆当成策略。"
caveats: "密钥勿进提示词；硬性禁区写进规则与 hooks，而不是指望。"
---

## 结论

当你需要一个常驻仓库、能规划、编辑并用你定义的命令复查的 agent 时，使用 Claude Code。

## 前置条件

- 按官方文档安装 Claude Code
- 项目有一条清晰的验证命令（测试、lint 或冒烟脚本）

## 步骤

1. 按 Anthropic 当前文档安装并登录。
2. 添加简短项目规则：目标、禁止路径、验证命令。
3. 多文件改动优先用计划模式；计划符合验收后再实现。
4. 出错后把纠正写进规则文件，让下次会话继承。

## 模板字段

- 验证命令：
- 禁止路径：
- 完成定义：

## 完成定义

你能开启会话、给出有范围的任务，且 agent 能在你不粘贴密钥的情况下运行验证命令。

## 反模式

- 把 API 密钥或 `.env` 粘进聊天
- 没有规格或验证环就要求「整库重写」

## 来源

见 frontmatter `publicSources`。
