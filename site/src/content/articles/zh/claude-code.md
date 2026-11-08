---
title: "Claude Code"
slug: claude-code
summary: "擅长仓库内交互式探索、先计划后改码、验证闭环与 hooks 强制约束的主力编码 agent。"
locale: zh
category: stack
stage: build
tools: [claude-code]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code CLI/agent（Anthropic）；命令与 hooks 配置结构请以最新官方文档为准"
updated: "2026-11-07"
internalBriefing: []
publicSources:
  - title: "Claude Code overview"
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
    kind: docs
  - title: "Automate actions with hooks (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks-guide"
    kind: docs
  - title: "Extend Claude with skills (SKILL.md)"
    url: "https://code.claude.com/docs/en/skills"
    kind: docs
tags: [stack, build, hooks, workflow]
toolId: claude-code
toolAvailability: active
bestFor: "仓库内 agent 循环、先计划再实现、用规则/hooks 强制约束。"
poorFit: "没有验证命令的盲目一次生成；把聊天记忆当成策略。"
caveats: "密钥勿进提示词；硬性禁区写进规则与 hooks，而不是指望。"
---

## 结论

当改动跨越多个文件、需要先摸清仓库耦合关系再落笔，或需要用 `PreToolUse` 在调用执行前守住边界、`PostToolUse` 做事后检查、`Stop` 检查收工条件时，把 **Claude Code** 作为你的仓库主力交互式 agent。

> [!FLOW] 仓库内会话闭环
> 1. **框定与计划** — 给出切片目标、文件边界与验证命令，要求先出计划。
> 2. **收敛范围** — 在改任何文件前砍掉顺手重构与超范围改动。
> 3. **实现与自检** — 让 agent 修改并反复跑验证命令，直到退出码为 `0`。
> 4. **沉淀护栏** — 把重复踩坑当天写进 `CLAUDE.md`、`SKILL.md` 或阻断式 hook。

## 何时选 Claude Code、何时交接

| 场景 | 最佳负责工具 | 原因 |
|---|---|---|
| 多文件新功能或耦合不清的重构 | **Claude Code** | 交互式读库能力强，适合「先审计划、再动代码」 |
| 已有明确规格、可拆成多条独立切片并行推进 | [Codex](/zh/articles/codex/) | 边界和测试清晰时，CLI 批处理与单切片产出更干脆 |
| 功能已通，准备打磨落地页、卖点与公开演示路径 | [Grok Build](/zh/articles/grok-build/) | 聚焦买家视角与主 CTA 冒烟，不把销售页写成技术日志 |
| 严禁改动数据库迁移、`.env` 或部署核心脚本 | [规则 + hooks](/zh/articles/rules-hooks/) | 自然语言提示会漂移，唯有 hooks 与 CI 能确定性拦截 |

## 前置条件

- 按 Anthropic 官方文档完成 Claude Code 安装与登录鉴权
- Git 工作区干净，便于单任务结束后直接用 `git diff` 审阅变更
- 至少一条快速、无副作用的本地验证命令（如 `npm test`、`npm run check` 或冒烟脚本）

## 步骤

1. **按官方文档完成安装与登录**——严禁把原始 API 密钥写进仓库文件或直接粘进会话提示词。
2. **建立精简的项目规则文件**（如同时用 Codex，可让 `CLAUDE.md` 与 `AGENTS.md` 保持一致），控制在 80 行以内：写明产品定位、唯一验证命令、以及硬禁区路径。
3. **多文件任务默认「先计划、后落盘」。** 先让 agent 检查相关文件并列出修改清单；在动代码前砍掉多余改动，返工成本最低。
4. **以验证命令作为唯一完工门槛。** 要求 agent 亲自执行测试/类型检查/构建并汇报真实退出码，不接受口头「应该没问题」。
5. **把失误当天转成硬护栏。** 一旦 agent 误碰禁区目录或重复犯错，立即补一行清晰规则，或直接升级为生命周期 hook（见[规则文件 + hooks](/zh/articles/rules-hooks/)）。
6. **不同任务之间主动清空上下文。** 切新切片时开新会话，防止上一任务的临时假设污染后续代码。

## 可直接复制的起步模板

### 极简 `CLAUDE.md` 起步模板

```markdown
# Project Rules

## 当前产品切片
基于 Astro 与受校验内容集合的静态知识站。所有命令均在 `site/` 目录执行。

## 验证门槛（宣称完成前必须全绿）
- 类型检查与单测：`npm run check && npm test`
- 完整构建与产物链接校验：`npm run build`

## 硬性禁区（未经明确批准严禁触碰）
- 严禁读取、打印或提交 `.env*`、SSH 私钥或部署凭证
- 严禁修改 `ops/` 生产主机目标或削弱 `scripts/validate*.mjs` 校验规则
- 严禁为静态文案或简单样式问题引入新的运行时依赖

## 协作约定
- 涉及超过 2 个文件的改动，先给出按文件列出的简短计划，获批后再编辑
- 保持 diff 聚焦当前切片；顺手发现的优化记入待办，不要同批混改
```

### 先计划后实现的会话提示词

```text
任务：新增 / 修复 [填写一个具体、可观察的用户侧功能或问题]。
范围内文件：[填写精确路径，例如 site/src/components/SearchControl.astro、site/tests/search.test.mjs]。
范围外 / 绝对不做：不新增第三方依赖、不改现有路由 URL、不动无关样式。
完成标准：[填写可勾选的行为结果]，且 `npm run check && npm test && npm run build` 退出码为 0。
第一步：请先阅读范围内文件，给出不超过 4 条的实现计划，等我确认后再修改文件。
```

> [!WARNING] 提示词与密钥卫生
> 把每一次提示词输入与每一台外部 MCP 服务器都视作不可信边界。`.env` 必须加入 `.gitignore`，部署密钥与日常编码终端隔离；安装市场扩展或第三方 skill 包前请先对照[安全速查](/zh/articles/security-quickcheck/)。

## 完成定义

- [ ] Claude Code 已完成官方登录，仓库与终端历史中无硬编码密钥
- [ ] `CLAUDE.md` / `AGENTS.md` 中写明了可在 1 分钟内跑完的验证命令
- [ ] 禁改路径与密钥边界不仅写在文档里，还由 hooks 或 CI 兜底拦截
- [ ] 多文件任务养成「先看计划、再改代码」习惯
- [ ] 提交前人工审阅 `git status` 与 `git diff`（重点核查 lockfile、鉴权与部署配置）

## 反模式

- **图省事把 `.env` 或线上令牌粘进对话框** —— 一旦暴露请立即轮换，本地一律通过被忽略的环境变量注入。
- **一句「帮我把整个模块重构干净」** —— 无边界指令只会产出难以审阅的大面积 diff；按单条可验证行为切分（见[先写规格](/zh/articles/spec-first-agent-loop/)）。
- **往 `CLAUDE.md` 塞上千行操作手册** —— 常驻上下文越臃肿，核心禁令越容易被稀释；特定流程应拆成按需调用的 `SKILL.md`。
