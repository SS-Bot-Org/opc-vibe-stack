---
title: "用 Claude Code、Codex 与 Grok Build 做 48 小时 MVP"
slug: 48h-mvp-agent-stack
summary: "两日时限闭环：规格 → agent 构建 → 验证 → 公开演示，覆盖三工具栈。"
locale: zh
category: playbook
stage: cross
tools: [claude-code, codex, grok-build]
priority: P1
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code + Codex + Grok Build / xAI 文档截至 2026-11；计时开跑前请再核对 CLI 名称"
updated: "2026-11-07"
internalBriefing: []
publicSources:
  - title: "Claude Code overview"
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
    kind: docs
  - title: "OpenAI Codex documentation"
    url: "https://developers.openai.com/codex"
    kind: docs
  - title: "xAI documentation"
    url: "https://docs.x.ai/build/overview"
    kind: docs
  - title: "Spec Kit quickstart"
    url: "https://github.github.com/spec-kit/quickstart.html"
    kind: docs
tags: [playbook, mvp, toolchain, timebox]
---

## 结论

在 **48 小时**内交付一个薄但可公开的 MVP：写清验收标准、一条 agent 完成的垂直切片、一条通过的验证命令，以及陌生人能打开的演示 URL。仓库循环用 Claude Code / Codex；最后一公里演示路径用 Grok Build（或你已文档化的上线 agent）。

## 时限

| 区块 | 小时 | 产出 |
|---|---|---|
| 规格与范围 | 0–4 | 一页纸：用户、问题、非目标、完成定义 |
| 垂直切片 | 4–28 | 代码 + 验证命令变绿 |
| 上线与演示 | 28–40 | 公开 URL + CTA 冒烟 |
| 缓冲 / 修复 | 40–48 | 一轮回归；冻结范围 |

硬规则：时钟碰到区块边界就砍范围——不要延长日历。

## 前置条件

- 按当前厂商文档可访问 Claude Code 和/或 Codex
- 可访问 Grok Build / xAI 构建面（或已文档化的上线替代）
- 空仓库或接近空的仓库，且有单一验证命令（测试、lint 或冒烟脚本）
- 能托管静态或最小应用的公开 URL

## 工具链（谁做什么）

1. **规格（调研）：** 你写一页纸；可选 Spec Kit 的 specify→plan→tasks。
2. **构建（Claude Code / Codex）：** agent 按验证命令实现一条垂直切片；规则/hooks 编码禁区。
3. **上线（Grok Build 或等价）：** 产出落地/演示路径；声明保持诚实。
4. **人类：** 审阅鉴权/依赖/部署相关 diff；公开冒烟。

## 步骤

1. **第 0–1 小时：** 写一页纸（用户、问题、非目标、完成定义）。密钥勿粘进 agent。
2. **第 1–4 小时：** 把完成定义拆成 ≤5 个任务。只选 **一条** 快乐路径演示，其余进 backlog。
3. **第 4–8 小时：** 脚手架仓库；加规则文件与验证命令；确认 agent 能独立跑通验证（见工具卡）。
4. **第 8–28 小时：** **一次只做一个任务** 开 agent。每任务后：验证绿、提交、更新一页纸「已完成」列表。
5. **第 28–36 小时：** 接公开路径（首页 → CTA）。产品允许则优先静态。
6. **第 36–40 小时：** 录制或脚本 ≤90 秒演示路径；冒烟首页、定价/联系与 CTA。
7. **第 40–48 小时：** 只修阻塞项。冻结功能。发布 URL。

## 模板字段

- 一页纸链接 / 路径：
- 验证命令：
- 演示 URL：
- 非目标（砍掉清单）：
- 区块结束时间（本地）：

## 完成定义

冷访客能打开演示 URL、理解卖点、完成主 CTA，无需你旁白。主分支验证命令为绿。密钥从未进入 agent 聊天。

## 反模式

- 一页纸未完成就开 agent
- 第 28 小时后还扩范围
- 跳过依赖与鉴权 diff 的人工审阅
- 没有证据标签就写营销数字

## 来源

见 frontmatter `publicSources`。工具分工：[Claude Code](/zh/articles/claude-code/)、[Codex](/zh/articles/codex/)、[Grok Build](/zh/articles/grok-build/)。规格先行配套：[先写规格](/zh/articles/spec-first-agent-loop/)。


## 实例：让带坏链接的内容版本构建失败

使用 [OPC Vibe Stack 仓库](https://github.com/SS-Bot-Org/opc-vibe-stack) 作为小型内容 MVP 演示。可运行的用例位于 `site/tests/content.test.mjs`：复制临时站点、修改带引号的 YAML 链接、执行**完整构建**，并断言非零退出。不会修改真实文章，也不会发布。

可复制给 coding agent 的任务模板：

```text
目标：阻止包含不存在的更新日志目标的版本发布。
范围：YAML 解析、共享内容契约、最终产物校验、回归测试。
非目标：新增文章、部署、抓取外部链接、改变证据标签。
复现：在临时副本中，把已发布更新日志 affectedPages 中的
/en/playbooks/ 改为带引号的 "/en/does-not-exist/"。
验收：完整 npm run build 非零退出，并报告 "missing output"；
回归测试因为预期这个失败而零退出。
安全边界：不动真实源码；不部署、不探测生产环境。
```

检出仓库后，使用 Node.js ≥22.23.4 运行：

```bash
cd site
npm ci
node --test --test-name-pattern='quoted nonexistent changelog link' tests/content.test.mjs
```

预期：选中的 `FULL npm run build rejects quoted nonexistent changelog link` 测试通过。内部构建应故意失败，测试运行器自身退出码为 **0**。完整本地门禁为 `npm run check && npm test && npm run build`。

本地复现记录：2026-11-07，Linux，Node 22.23.4。这里只验证内容发布的失败用例，不代表 agent 质量、收入、浏览器布局或生产部署已经验证。不会抓取外部链接。全文证据标签仍为 documentation-backed；一个本地测试实例不把其余建议自动升级为 tested。
