---
title: "用 Claude Code、Codex 与 Grok Build 做 48 小时 MVP"
slug: 48h-mvp-agent-stack
summary: "两日时限闭环：规格约束 → agent 垂直切片 → 验证门禁 → 陌生人可打开的公开演示路径，串联三工具栈。"
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

在 **48 小时**内交付一个足够薄、但陌生人可直接试用的 MVP：写清验收标准、跑通一条由 agent 实现的垂直切片、守住一条稳定退出 `0` 的验证命令，并发布一个无需你在旁解释就能走完的公开演示 URL。仓库内编码交给 [Claude Code](/zh/articles/claude-code/) 或 [Codex](/zh/articles/codex/)，最后一公里演示与落地页交给 [Grok Build](/zh/articles/grok-build/)（或你已文档化的上线方案），一旦时钟触达区块边界就果断砍范围。

> [!FLOW] 48 小时三工具 MVP 流水线
>
> 1. **第 0–4 小时：规格与冻结** — 打开任何 agent 之前先写一页纸，锁定用户痛点、非目标与 ≤5 个任务。
> 2. **第 4–28 小时：垂直切片** — 用 Claude Code 或 Codex 一次只推一个任务，每次以验证命令变绿为准。
> 3. **第 28–40 小时：公开演示路径** — 接通落地页卖点、诚实证据与主 CTA，完成桌面与移动端冒烟。
> 4. **第 40–48 小时：缓冲与封版** — 只修阻塞缺陷，人工审阅鉴权与依赖 diff，正式发出公开链接。

## 48 小时时限与砍范围门禁

| 时间区块 | 小时 | 主责角色 | 必须交付物 | 到点砍范围触发器 |
|---|---|---|---|---|
| **1. 规格与范围** | `0–4` | 人类（[先写规格](/zh/articles/spec-first-agent-loop/)） | 含完成定义与 ≤5 个任务的 `mvp-48h.md` | 砍掉次要人群、设置中心与后台管理页 |
| **2. 垂直切片** | `4–28` | [Claude Code](/zh/articles/claude-code/) / [Codex](/zh/articles/codex/) | 核心快乐路径已提交；验证命令退出 `0` | 把未完成的异步队列或外部集成替换成静态夹具或人工兜底 |
| **3. 上线与演示** | `28–40` | [Grok Build](/zh/articles/grok-build/) + 人类 | 线上 URL + ≤90 秒可复现演示路径（[上线清单](/zh/articles/ship-demo-checklist/)） | 把多页漏斗压缩成单页说明 + 一个直达 CTA |
| **4. 缓冲与修复** | `40–48` | 人类审阅者 | 回归测试 + 敏感 diff 人工复核（[安全速查](/zh/articles/security-quickcheck/)） | 严禁加新功能；任何修不稳的晚间改动直接回退 |

> [!IMPORTANT] 硬时钟纪律
> 当墙上时钟碰到区块边界时，**只准砍功能，不准拖日历**。第 48 小时能跑通单点价值的极简产品，永远胜过下个月才接上一半的宏大架构。

## 前置条件

- 已按当前官方文档开通并验证 [Claude Code](/zh/articles/claude-code/) 和/或 [Codex](/zh/articles/codex/)
- 可访问 [Grok Build](/zh/articles/grok-build/) / xAI 构建界面（或已固定下来的静态部署管线）
- 已初始化 Git 的干净仓库，配好仓库级规则（[规则文件 + hooks](/zh/articles/rules-hooks/)）及**唯一一条**确定性验证命令（`npm test`、`npm run build` 或冒烟脚本）
- 能直接提供公开 HTTPS URL 的静态托管或最小运行环境

## 工具链分工（谁负责哪一段）

1. **规格与边界（人类）：** 编写 `mvp-48h.md`（也可借用 Spec Kit 的 `specify → plan → tasks` 结构），在第一行代码诞生前写明禁改目录。
2. **仓库垂直切片（[Claude Code](/zh/articles/claude-code/) / [Codex](/zh/articles/codex/)）：** 每次会话只推进一个任务，在本地或云端任务沙箱跑验证命令，把每次 diff 控制在 5 分钟内可人工读完的规模。
3. **最后一公里演示面（[Grok Build](/zh/articles/grok-build/) 或同类上线工具）：** 产出落地页结构、演示路径与上线素材，所有指标与来源保持诚实限定。
4. **发布拍板权（人类）：** 逐行审阅鉴权、计费、依赖与部署 diff；执行冷访客无痕冒烟；所有生产密钥全程留在 agent 会话之外。

## 分时段执行步骤

1. **第 0–1 小时（写作战一页纸）：** 在 `mvp-48h.md` 中写清目标用户、单一痛点、可观测成功信号和硬性砍单列表。严禁把 API Key 或 `.env` 粘进提示词。
2. **第 1–4 小时（拆解 ≤5 个任务）：** 只挑**一条**快乐路径。把第三方登录、深色模式装饰、埋点大盘和多角色权限全部塞进上线后 backlog。
3. **第 4–8 小时（搭脚手架 + 接通门禁）：** 初始化最小目录结构，提交 `CLAUDE.md` / `AGENTS.md`，确认 agent 无需人工干预就能独立跑通那条验证命令。
4. **第 8–28 小时（单任务串行推进）：** 每次只把一个任务交给 Claude Code 或 Codex。验证变绿并 `git commit` 后，再开下一项并勾选 `mvp-48h.md`。
5. **第 28–36 小时（打通公开路径）：** 把「首页价值主张 → 真实演示证明 → 主 CTA」部署到真实 URL。只要产品形态允许，优先采用纯静态或免登录预览。
6. **第 36–40 小时（固化 90 秒演示）：** 参照[上线 / 演示清单](/zh/articles/ship-demo-checklist/)，在桌面与手机无痕窗口完整走通一遍线上 URL。
7. **第 40–48 小时（封版与加固）：** 只修坏链、含糊文案或阻塞级 bug。对外发链接前跑一遍[安全速查](/zh/articles/security-quickcheck/)核查依赖与密钥边界。

## 可直接复制的 48 小时作战单模板（`mvp-48h.md`）

按下计时器前，先把这份文件放到仓库根目录：

```markdown
# 48h MVP 作战单：[项目名称]

- **启动 / 截止时间（本地时区）：** [YYYY-MM-DD HH:MM] → [YYYY-MM-DD HH:MM]
- **目标用户与单一痛点：**
- **核心快乐路径结果：**
- **唯一验证命令：**
- **公开演示 URL：**

## 硬性非目标（一旦手痒立刻砍掉）
- v0 不做多租户团队、复杂权限或自助账单后台
- 不做未要求的 UI 重构，不乱加新依赖
- [本项目专属砍单条目]

## 切片构建任务（最多 5 项）
- [ ] T1（第 4–8 小时）：仓库脚手架 + 规则文件 + 验证命令跑绿
- [ ] T2（第 8–14 小时）：[核心输入 / 数据契约]
- [ ] T3（第 14–22 小时）：[核心处理逻辑 / 垂直切片行为]
- [ ] T4（第 22–28 小时）：[错误兜底 + 边界回归测试]
- [ ] T5（第 28–40 小时）：[公开落地页 + 主 CTA 冒烟测试]

## 区块硬截止时间点
- **区块 1 规格冻结（第 4 小时）：**
- **区块 2 代码封口（第 28 小时）：**
- **区块 3 演示就绪（第 40 小时）：**
- **区块 4 正式发布（第 48 小时）：**

---
# 已填微缩示例：坏链发布门禁演示
- **目标用户与单一痛点：** 独立维护双语 Markdown 实践站的作者，怕周更 changelog 误填不存在的页面路由。
- **核心快乐路径结果：** 只要已发布 changelog 引用了缺失路由，`npm run build` 就确定性报错拦截。
- **唯一验证命令：** `cd site && npm run check && npm test && npm run build`
- **公开演示 URL：** `https://opc.example.com/zh/changelog/`
```

## 实例：让带坏链接的内容版本构建失败

你可以直接用 [OPC Vibe Stack 仓库](https://github.com/SS-Bot-Org/opc-vibe-stack) 体验一个最小内容 MVP 切片。可运行夹具位于 `site/tests/content.test.mjs`：它会复制一份临时站点、修改带引号的 YAML 路由链接、执行**完整构建**并断言非零退出，全程不会改动你的工作区源码，也不会触发任何线上发布。

可直接复制给 coding agent 的任务简报：

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

检出仓库后，使用 Node.js ≥22.23.4 执行：

```bash
cd site
npm ci
node --test --test-name-pattern='quoted nonexistent changelog link' tests/content.test.mjs
```

预期结果：选中的 `FULL npm run build rejects quoted nonexistent changelog link` 用例通过——内部构建按预期因 `missing output` 失败，外层测试运行器退出码为 **0**。完整本地门禁可运行 `npm run check && npm test && npm run build`。

> [!NOTE] 本地复现范围说明
> 本地复现记录：2026-11-07，Linux，Node 22.23.4。该夹具仅验证「内容发布坏链拦截」这一确定性失败门禁，不代表 agent 代码质量、商业收入、浏览器视觉布局或生产部署已获验证；构建过程也不会抓取外部链接。本文整体 `evidence` 标签仍保持 `documentation-backed`——单个本地测试实例不会把全文所有流程建议自动升级为 `tested`。

## 完成定义

- [ ] 冷访客打开公开演示 URL 后，无需你旁白就能在一屏内看懂产品并走完主 CTA
- [ ] `main` 分支上的唯一验证命令退出码为 `0`
- [ ] 所有涉及鉴权、依赖变更与部署配置的 diff 均由人工逐行审阅
- [ ] 生产环境密钥、`.env` 与私钥从未进入任何 agent 聊天上下文
- [ ] 第 40 小时已冻结功能范围，非阻塞想法全部移入后续 backlog

## 反模式

- **第 0 小时还没写 `mvp-48h.md` 就直接开 agent 写代码** — 在精力最好的前几小时堆出一堆方向打架的脚手架，到第 12 小时只能推倒重来。
- **第 28 小时后还顺手「再塞一个小功能」** — 直接挤占部署排障、移动端冒烟和落地页文案打磨的救命时间。
- **盲目合并 agent 新装的依赖包或鉴权中间件** — 在最输不起的安全与供应链路径上埋下隐雷。
- **在落地页编造用户量、收入或未经核实的社媒战绩** — 对一人公司信任度的杀伤力远大于坦诚发布一个克制的 `v0.1`。
