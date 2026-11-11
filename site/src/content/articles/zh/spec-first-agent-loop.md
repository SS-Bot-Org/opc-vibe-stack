---
title: "先写规格，再让 agent 改代码"
slug: spec-first-agent-loop
summary: "在任何编码 agent 动仓库前，先用 Spec Kit 或 5 行切片规格写清目标、边界与验收命令。"
locale: zh
category: guide
stage: research
tools: [claude-code, codex, grok-build]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code、Codex 或 Grok Build 任一；可选安装 GitHub Spec Kit；配合仓库本地验证命令"
published: "2026-11-06"
updated: "2026-11-10"
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

目标含糊时，agent 改动很难限定范围，也难以验收。在让任何编码 agent 打开文件之前，先把目标结果、文件边界、非目标与验证命令落成白纸黑字。无论你采用 GitHub **Spec Kit**（`specify → plan → tasks → implement`）还是手写 15 行 Markdown 短切片，都应**先写清验收标准再动代码**，让结果可以与书面目标核对。

## 第一个练习：先写检查，再写提示词

先用普通 Markdown 即可，Spec Kit 是可选项。在 `specs/001-slice.md` 中只描述产品里的**一个**行为。例如：“搜索不存在的词时，显示空状态提示，并提供可用的清空操作。”

| 输入 / 操作 | 预期结果 | 检查方法 |
|---|---|---|
| 搜索已知标题 | 出现相关结果 | 指定测试或浏览器操作 |
| 搜索不存在的词 | 出现明确空状态 | 记录文案或截图 |
| 清空搜索 | 结果消失，输入框仍可用 | 浏览器操作与键盘检查 |

填入真实路由、范围内文件和已有验证命令，改动前先执行一次。缺少测试意味着需要补测试，而不是编造通过结果。只交接第一项任务；如果结果仍有歧义，先完善规格，不要立即进入实现。

**交付物：** 一份规格、小任务清单和可复现的通过/失败记录。下文 `specify → plan → tasks` 是阶段名称，不是终端命令。使用 Spec Kit 时遵循[当前快速开始](https://github.github.com/spec-kit/quickstart.html)，在 agent 对话中调用已安装技能，逐个审阅产物，而非把技能名称粘到终端。

> [!FLOW] 先规格、后改码的四步切片环
>
> 1. **项目宪章与边界** — 每项目定一次技术栈红线、禁改目录与非目标。
> 2. **写规格与消歧** — 落笔前写清用户结果与外人可逐项打勾的验收条件。
> 3. **拆计划与任务** — 按文件边界与验证节点拆成小颗粒有序任务。
> 4. **单步实现与收敛** — 每次只交一个任务，验证命令全绿后再提交。

## 模糊「凭感觉提示」vs 规格先行闭环

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="从规格走向可验证结果">
    <img class="theme-diagram__light" src="/illustrations/spec-first-agent-loop/overview.zh.light.svg" alt="" data-decorative="true" width="420" height="630" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/spec-first-agent-loop/overview.zh.dark.svg" alt="" data-decorative="true" width="420" height="630" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>从规格走向可验证结果</strong> 先明确结果、边界与验收条件，再实现单个任务。验证通过后审阅并提交；失败时回到当前任务，修复缺陷或完善规格。</figcaption>
</figure>

| 对比维度       | 模糊「凭感觉」提示                 | 规格先行切片闭环                                |
| -------------- | ---------------------------------- | ----------------------------------------------- |
| 起始输入       | _「加个搜索，顺便把界面弄好看点」_ | 书面用户结果 + 允许改动的文件/路由 + 明确不做项 |
| 架构决策时机   | 模型边改代码边临场发挥             | 改码前在 `spec.md` / `plan.md` 中提前审定       |
| 任务拆分示例（不是实测平均值） | 像「加个搜索，顺便把界面弄好看点」这样的模糊提示，可能一次改到很多文件（此处的 20+ 只是示例，不是测得的典型结果） | 边界清楚的单任务让 diff 更易审阅——例如一次只改 1–4 个文件 |
| 失败恢复成本   | 在长对话里反复打补丁越修越乱       | 直接 `git checkout` 回退单任务或收紧规格        |
| 完成信号       | 对话框里说「已经改好了」           | 本地确定性验证命令返回退出码 `0`                |

## 前置条件

- 已纳入 Git 版本控制的仓库（或新建项目目录）
- 一条能证明当前切片「达到可用标准」的本地命令（如 `npm test`、`npm run build` 或冒烟脚本）
- 可选：按官方文档为编码 agent 安装 [GitHub Spec Kit](https://github.github.com/spec-kit/quickstart.html)（`specify init` 及对应 skills）

## 步骤

1. **五句话框住本切片：** 目标用户、具体痛点、可观察的成功信号、明确非目标、时间上限。
2. **写出「陌生人也能打勾」的验收项：** 明确到 URL 行为、CLI 输出或测试名——禁用「更优雅」「更现代」之类无法检验的形容词。
3. **冻结本轮接口边界：** 标出本切片绝不允许漂移的路由、schema 字段与禁改目录。
4. **跑通 specify → plan → tasks 流程。** 用 Spec Kit（或 `specs/` 目录下的精简文档）先澄清歧义、生成计划并拆出任务列表，再交给 [Claude Code](/zh/articles/claude-code/)、[Codex](/zh/articles/codex/) 或 [Grok Build](/zh/articles/grok-build/)。
5. **可选脑暴预整理（社区未验证技巧）：** 想法还很散时，可先把语音或杂乱思路倒进推理聊天，让它整理成无歧义技术规格草稿（数据流、目录边界、异常情况、验收项）——**由你亲自删改定稿后**，再交给编码 agent。
6. **用「四要素任务单」替代空话铺垫：** 写清做什么、成品长什么样、如何验证完成、绝对禁止做什么；省掉空洞的「请一步步仔细思考」。
7. **一次只交一个切片任务。** 在提示词与项目规则中明确禁止顺手重构无关文件（配合[规则文件 + hooks](/zh/articles/rules-hooks/)）。
8. **验证全绿再提交。** 验证不过就地修复或回滚重审规格，绝不在红灯状态下继续叠新功能。

本仓库的[坏链接发布门禁实例](/zh/articles/48h-mvp-agent-stack/#broken-link-release-gate)是一个已固定 commit、可复现的验证命令失败例子。

> [!NOTE] 来源与证据边界说明
> `specify → plan → tasks → implement` 主流程有 GitHub 官方 Spec Kit 文档支撑（**文档依据**）。社交帖提到的仓库星标热度、「先语音倾倒再转技术规格」与「四字段提示法」属于社区经验分享——在你用自己的项目实测前，请将相关效率数字视作**发帖人单方主张（未验证）**。

> [!NOTE] 先替换项目专属配置
> 下方 `site/`、`npm run check` 与 `ops/` 路径属于 OPC Vibe Stack。用于其他项目时，先查 README 和已有脚本再替换。本站完整测试使用 Linux CI 环境；部署示例依赖 GNU 工具和 `flock`。跳过平台测试不等于部署通过。

## 可直接复制的实用模板

### 1. 切片规格书（`specs/001-slice.md` —— 空白模板 + 填好实例）

```markdown
# 切片规格：[简短名称]

- **目标用户与痛点：**
- **成功信号（可观察）：**
- **非目标 / 绝对不做：**
- **冻结接口（路由 / Schema / 范围内文件）：**
- **验证命令：**

## 验收核对项

- [ ] 验收项 1：
- [ ] 验收项 2：

---

# 填写实例：静态站文章搜索索引

- **目标用户与痛点：** 读者无法按标题或标签快速检索指南，只能逐栏目翻找。
- **成功信号：** 构建期生成 `/en/search-index.json`（仅含已发布文章）；前端输入可按标题与标签即时过滤。
- **非目标 / 绝对不做：** 不引入外部搜索 SaaS、不泄露草稿或已弃用页、关闭 JS 时主导航依然可用。
- **冻结接口：** `site/src/pages/en/search-index.json.ts`、`site/src/components/SearchControl.astro`、`site/tests/search.test.mjs`。
- **验证命令：** `cd site && npm run check && npm test && npm run build`
```

### 2. 四要素编码交接提示词

```text
1. 要完成的任务：
   按 specs/001-slice.md 实现任务 #1（[一句话概述]）。

2. 成品长什么样：
   - [写出精确的路由行为、命令输出或新增测试断言]
   - 仅允许新建或修改以下文件：[文件列表]

3. 如何确认已完成：
   运行 `cd site && npm run check && npm test && npm run build` 退出码为 0，且无新增告警。

4. 绝对禁止做的事：
   - 不得安装新的 npm 依赖
   - 不得修改范围外文件，不得删改或弱化现有测试
   - 若发现规格与现有类型定义冲突，立即停下提问，不要自行猜测改契约
```

## 完成定义

- [ ] 在 agent 改动业务代码前，已有书面规格文档（`specs/...` 或 Spec Kit 产物）
- [ ] 每一条验收条件都能通过自动化测试、构建门禁或明确的页面操作客观检验
- [ ] 交接提示词中明确列出了禁改目录与非目标
- [ ] 当前切片的验证命令返回 `0` 且 diff 已审阅后，才进入下一切片

## 反模式

- **只丢一句「帮我优化一下」却不给验收标准** —— 最容易换来一堆无效样式折腾与隐蔽回归。
- **放任 agent 改到一半自创路由或改数据契约** —— 发现偏航应先停下更新规格，再重跑校验。
- **把两千字半熟脑暴原封不动塞给仓库 agent** —— 发散探索与仓库执行必须拆成两步。
- **迷信社交平台星标涨幅** —— 规格文档够短、够卡住回归就够用，不要在一人公司搞重型流程表演。
