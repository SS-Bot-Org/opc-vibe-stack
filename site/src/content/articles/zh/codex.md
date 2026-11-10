---
title: "Codex"
slug: codex
summary: "OpenAI 面向规格驱动任务的编码 agent 与 CLI，擅长边界清晰的单切片执行、批处理修改与干净 diff。"
locale: zh
category: stack
stage: build
tools: [codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "OpenAI Codex CLI/agent；具体 CLI 参数与 config.toml 键名请以 OpenAI 最新官方文档为准"
updated: "2026-11-10"
internalBriefing: []
publicSources:
  - title: "OpenAI Codex documentation"
    url: "https://developers.openai.com/codex"
    kind: docs
  - title: "Codex configuration reference (config.toml & mcp_servers)"
    url: "https://developers.openai.com/codex/config-reference"
    kind: docs
  - title: "Codex CLI setup"
    url: "https://learn.chatgpt.com/docs/codex/cli"
    kind: docs
tags: [stack, build, cli, workflow]
toolId: codex
toolAvailability: active
bestFor: "规格驱动的编码任务、可批处理的编辑、以 CLI 为中心的流程。"
poorFit: "没有验收测试的模糊点子；跳过对安全敏感 diff 的人工审阅。"
caveats: "产品界面会演进；升级后请固定文档链接并复查命令。"
---

## 结论

当你手里已经有书面任务边界——输入输出、允许触碰的文件、验收条件与验证命令——希望编码 agent 干脆利落地交出一份可审阅的聚焦 diff 时，优先使用 **Codex**。

## 第一次实践：交付一个能明确验收的任务

**准备：** 已有仓库、一个可复现的问题，以及能区分成功与失败的检查。这个练习不需要多个 agent，也不需要先配置 MCP。

1. 按[官方 Codex CLI 指引](https://learn.chatgpt.com/docs/codex/cli)完成设置，或在桌面应用中选择此仓库。使用 CLI 时，安装登录后在仓库目录运行 `codex`。
2. 先让 Codex 找出项目说明、相关文件和已有测试，暂不修改；确认它打开的是目标仓库。
3. 提供下方四字段任务单，先记录失败行为。例如搜索泄露草稿时，新增“结果不能包含草稿”的回归检查。
4. 审阅 diff，重新执行同一检查；再用原始输入和一个空输入或非法输入各测一次，记录预期与实际结果。

**验收条件：** 原始问题通过验证、无关行为保持正常、改动路径符合任务单。若必须修改依赖、数据结构或权限，先重新确认范围。并行任务使用独立分支或 worktree；“适合并行”不代表让两个 agent 同时修改同一份工作区。

> [!FLOW] 规格到 Diff 的执行闭环
> 1. **写清任务单** — 锁定目标行为、允许修改的文件列表与验证命令。
> 2. **单切片执行** — 在干净 Git 工作区上每次只跑一个有边界的任务。
> 3. **验证门卡点** — 本地测试、类型检查与构建校验必须全绿通过。
> 4. **人工审敏感行** — 合并前逐行核查 lockfile、鉴权、schema 与部署脚本。

## 并行切片 vs 串行人工门禁

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="任务边界分工图">
    <img class="theme-diagram__light" src="/illustrations/codex/overview.zh.light.svg" alt="" data-decorative="true" width="420" height="586" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/codex/overview.zh.dark.svg" alt="" data-decorative="true" width="420" height="586" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>任务边界分工图</strong> 独立缺陷修复和内容切片，只有在文件不重叠时才适合并行；共享数据结构与依赖变更应串行进行。无论哪条路径，都要验证结果并审阅敏感改动。</figcaption>
</figure>

对一人公司来说，Codex 最大的效率杠杆是按规格批量推进独立切片——但前提是**各切片不会踩同一批共享文件**。

| 切片类型 | 推荐执行方式 | 原因 |
|---|---|---|
| 单一模块内的缺陷修复 + 回归测试 | **可安全并行** | 文件边界闭合，测试红绿信号明确 |
| 双语文章同步补全或独立新文草稿 | **可安全并行** | 内容路径互不重叠，由 `npm run validate` 自动兜底 |
| 共享数据契约（`content-schema.mjs`）或路由辅助函数 | **必须串行** | 牵一发动全身，下游页面全部依赖同一契约 |
| 依赖升级（`package.json` / `package-lock.json`） | **串行 + 人工门禁** | lockfile 极易冲突，且涉及供应链安全 |
| 登录鉴权、计费、SSH 或部署脚本（`ops/`） | **串行 + 逐行精审** | 爆炸半径高，绝不允许无人值守合并 |

## 前置条件

- 已按 OpenAI 官方文档安装并登录当前版本的 Codex CLI 或编码 agent 界面
- 仓库根目录（或子工程目录）配有 `AGENTS.md`，写明构建、测试与代码风格约定
- 有一条回归失败时会返回非零退出码的验证命令

## 步骤

1. **对照官方文档核实 CLI 与 `config.toml`。** Codex 的命令参数与沙箱审批模式迭代很快；升级后先核对 [Codex 配置参考文档](https://developers.openai.com/codex/config-reference) 中的权限模式与 `[mcp_servers.*]` 语法。
2. **让 `AGENTS.md` 写满操作事实，而非空洞口号。** 把工作目录、Node 版本、验证命令与禁止触碰的目录放在最顶部。
3. **每次投喂「四要素任务单」**（目标、范围内文件、范围外禁区、验证命令）。如果连验收怎么测都还没想好，先退回[先写规格，再让 agent 改代码](/zh/articles/spec-first-agent-loop/)。
4. **一会话只干一件事。** 切换到无关问题前先清空上下文或重开会话，避免上一次的文件假设污染新 diff。
5. **提交前跑 `git diff --stat` 并精读敏感改动**——重点看依赖项、环境变量处理与构建门禁脚本。

> [!NOTE] 先替换项目专属配置
> 下方 `site/`、`npm run check` 与 `ops/` 路径属于 OPC Vibe Stack。用于其他项目时，先查 README 和已有脚本再替换。本站完整测试使用 Linux CI 环境；部署示例依赖 GNU 工具和 `flock`。跳过平台测试不等于部署通过。

## 可直接复制的起步模板

### Codex 聚焦任务单（空白模板 + 填好实例）

```text
# 空白模板
目标：
范围内文件：
范围外 / 绝对不做：
验证命令：

# 一人公司真实填写示例
目标：拦截更新日志（changelog）中 affectedPages 指向草稿状态译文的发布包。
范围内文件：site/scripts/validate-output.mjs、site/tests/content.test.mjs。
范围外 / 绝对不做：不修改已发布文章、不改 astro.config.mjs、不改动 package.json 依赖。
验证命令：cd site && npm run check && npm test && npm run build
```

### 高信噪比 `AGENTS.md` 命令头示例

```markdown
# Repository Guidelines

## 常用命令（在 `site/` 目录执行，要求 Node >= 22.23.4）
- `npm run validate` — 快速校验内容清单、工具卡完整性与双语状态
- `npm run check`    — Astro 与 TypeScript 严格类型检查
- `npm test`         — 运行回归测试套件（`tests/*.test.mjs`）
- `npm run build`    — 完整预检 + 静态构建 + 产物内部链接与锚点校验

## 硬约束
- 英文（`en`）与中文（`zh`）译文必须保持完全一致的稳定 slug
- 严禁编造公开来源 URL，严禁提交 `.env` 或构建产物 `dist/`
- 核心阅读与导航路径必须在无 JavaScript 时依然可用
```

> [!IMPORTANT] Lockfile 与 MCP 配置永远由人拍板
> 在 Codex 中接入共享 MCP 服务器时，请按 TOML 语法写入 `~/.codex/config.toml`（或受信任项目配置）的 `[mcp_servers.<name>]` 段——不要直接把其他编辑器的 JSON 粘进去，也绝不要把 API 令牌提交进仓库。详见[规则文件 + hooks](/zh/articles/rules-hooks/)。

## 完成定义

- [ ] 任务单明确列出了范围内文件、非目标与可运行的验证命令
- [ ] Codex 跑完后，`npm run check`、`npm test` 与 `npm run build`（或项目等价门禁）退出码均为 `0`
- [ ] 已审阅已跟踪与未跟踪路径，只暂存预期文件，排除秘密与生成产物，同时保留用户原有工作
- [ ] 凡涉及依赖、schema、鉴权或部署脚本的变更，均已由你本人逐行审完

## 反模式

- **一次会话塞进三个毫不相关的需求** —— 一旦某处单测挂掉，agent 会把三处逻辑搅在一起胡改；务必按原子提交拆分。
- **看都不看就放行 `package-lock.json` 改动** —— agent 有时会为了消掉一个类型报错擅自装新包；非必要依赖一律驳回。
- **照抄社交帖里的过期 CLI 参数** —— 升级后先跑 `codex --help` 或查官方文档，别盲信半年前的截图。
