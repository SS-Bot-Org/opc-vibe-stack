---
title: "内容站周更闭环"
slug: weekly-content-site-refresh
summary: "周日 90–120 分钟闭环：过滤简报、更新可执行页面、跑校验门禁、写更新日志并原子部署——绝不编造凑数。"
locale: zh
category: playbook
stage: cross
tools: [claude-code, codex]
priority: P1
status: published
evidence: documentation-backed
applicableToolsVersions: "Astro 静态站 + Markdown collections；任选 agent CLI；编辑验证门按本站 SDD"
updated: "2026-11-10"
internalBriefing: []
publicSources:
  - title: "Astro content collections"
    url: "https://docs.astro.build/en/guides/content-collections/"
    kind: docs
  - title: "Claude Code overview"
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
    kind: docs
  - title: "OpenAI Codex documentation"
    url: "https://developers.openai.com/codex"
    kind: docs
tags: [playbook, ops, changelog, timebox, content]
---

## 结论

让工程实践站长期保持参考价值，靠的不是日更追热点，而是**严控在 90–120 分钟内的周日维护闭环**：先把输入简报过滤到真正改变实操动作的条目，亲手点开核对每一个一手来源，优先修订既有指南而非盲目新建页面，在[更新日志](/zh/changelog/)中写清真实的 `affectedPages`，跑通构建门禁后用原子 symlink 切换发布。如果当周没有任何实质条目通过过滤，直接提前收工，绝不硬凑更新。

## 第一次实践：只改一处，先在本地预览

选择一篇既有文章，以及一个确实会改变具体操作的一手来源。私下记录来源 URL、变化内容和需要修改的段落；来源打不开或不能支持改动时，暂停该条目。

1. 对已有的两种语言做最小修订。只有操作建议实质变化才改 `updated`，排版调整不改。
2. 把下方日志骨架以 **draft** 状态保存，替换所有示例日期、主张、路径与来源，核对目标在本次版本中真实存在；检查通过后再发布日志。
3. 执行仓库检查，在本地预览查看改动文章、语言链接和日志锚点，保存命令输出与实际结果。
4. 准备待发布版本，只通过单独配置并测试过的流程部署。没有部署流程时，停在可审阅的本地结果，不临时拼凑 SSH 命令。

**无更新也是有效结果：** 私下保存被拒条目和理由。使用本站 Linux 部署示例前，阅读仓库的 `site/ops/DEPLOYMENT-EXAMPLE.md`；它依赖 GNU 工具和 `flock`，不能当作通用 macOS 部署配方。支持不可变版本的静态托管平台，可用原生发布/回滚流程代替 VPS 软链。

> [!FLOW] 周日 90–120 分钟内容刷新管线
>
> 1. **过滤筛选（15 分钟）** — 只留改变核对清单、工具边界或安全告警的条目；纯新闻一律丢弃。
> 2. **核源与改写（45 分钟）** — 人工打开原始链接，更新双语可执行步骤，保守标注 `evidence`。
> 3. **更新日志（10 分钟）** — 编写含真实 `affectedPages` 的 `YYYY-wNN.md`，准备待发布版本。
> 4. **检查、发布与记录（25 分钟）** — 跑完检查，通过既定流程发布，探测结果并留存私有记录。

## 时限分配与止损门禁

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="内容发布决策树">
    <img class="theme-diagram__light" src="/illustrations/weekly-content-site-refresh/overview.zh.light.svg" alt="" data-decorative="true" width="420" height="662" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/weekly-content-site-refresh/overview.zh.dark.svg" alt="" data-decorative="true" width="420" height="662" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>内容发布决策树</strong> 如果没有条目能改变实际行动，就记录私下的「本周无更新」说明并结束；否则核实来源、修订文章、通过发布检查并执行冒烟测试。保留上一个版本用于回滚。</figcaption>
</figure>

| 阶段              | 分钟    | 主责角色                                                                       | 通过 / 止损门禁                                                      |
| ----------------- | ------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| **1. 过滤与映射** | `15` | 人类编辑                                                                       | 至少 1 条可执行动作变更留存；若为 0 则立即停止并记录「本周无更新」   |
| **2. 核源与改写** | `35` | 人类 + [Claude Code](/zh/articles/claude-code/) / [Codex](/zh/articles/codex/) | 所有引用 URL 均由人工打开确认；双语可执行章节同步修订                |
| **3. 证据与提示** | `10` | 人类编辑                                                                       | 准确设置 `tested` / `documentation-backed` / `unverified` 与风险限定 |
| **4. 更新日志**   | `10` | Agent + 人类                                                                   | `changes[]` 非空，且每条 `affectedPages` 在本次 `dist/` 中真实存在   |
| **5. 校验与部署** | `20` | CI / 发布脚本                                                                  | `npm run build` 退出 `0`；原子切换软链且线上 HTTP 冒烟全部通过       |
| **6. 私有归档**   | `5`     | 人类编辑                                                                       | 在 `dist/` 之外保存发布记录与上一版回滚目标                          |

> [!TIP] 「空窗周」是健康信号，不是失职
> 如果某周收集到的全是融资新闻、跑分口水战或无法复现的噱头，**在第 1 阶段结束后直接停表**。私下记三行「本周无实质更新」远比为了刷存在感去篡改旧文章的 `updated` 日期诚实得多。

上表预算合计 95 分钟，距 120 分钟上限保留 25 分钟缓冲。如果核源或检查超时，保留草稿并稍后继续，不为赶时间跳过门禁。

## 简报过滤决策矩阵

把每周简报、书签与社媒帖子一律视为「待核实线索」，按以下标准决定去留：

| 输入线索类型                              | 处理决定         | 目标动作                                                                    | 最高可用 `evidence` 标签                                |
| ----------------------------------------- | ---------------- | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| 官方 CLI / SDK 参数、hooks 或权限模型变更 | **保留**         | 修订对应工具卡或[规则文件 + hooks](/zh/articles/rules-hooks/)               | `documentation-backed`（本地实测复现后方可标 `tested`） |
| 活跃供应链投毒、密钥泄露或恶意插件通报    | **保留（高优）** | 补充[安全速查](/zh/articles/security-quickcheck/)防御项 + 发布 `alert` 日志 | `documentation-backed`                                  |
| X 上带具体步骤与边界的实战工作流          | **带限定保留**   | 并入既有指南；社媒效率数字注明「作者自述、未独立验证」                      | `unverified`（除非同时有一手官方文档支撑核心机制）      |
| 模型榜单跑分、价格传闻、情绪化观点帖      | **直接丢弃**     | 不建任何资讯水文                                                            | —                                                       |
| 尚未亲手打开核对正文的外部链接            | **挂起 / 丢弃**  | 保持 `status: draft` 或彻底删去该引用                                       | —                                                       |

## 前置条件

- 具备严格 schema 与构建产物校验的静态 Markdown/MDX 仓库（本站使用 Astro Content Collections 加 `scripts/validate-output.mjs`）
- 原始周报/素材目录与公开站点源码隔离存放
- 支持原子切换的服务器目录结构（`/srv/<site>/releases/<id>` + `/srv/<site>/current` 软链），杜绝直接往线上目录跑裸 `rsync --delete`
- 权限最小化的 SSH 或 CI 部署身份，且不在 coding agent 的自动执行权限内

## 周日分步工作流

1. **先做减法过滤：** 通读本周素材，只留下会让一人公司下周一**改动作、加检查或避坑**的内容。
2. **优先映射到既有页面：** 能改现有指南或工具卡就不新建碎片文章；保持 `en` 与 `zh` 的 `slug` 严格对齐。
3. **逐条点开公开来源：** 人工确认网页可访问且内容与正文表述一致；严禁让 agent 猜测或拼凑 X 帖子链接。
4. **维护可执行结构：** 保持「结论 → 前置条件 → 分步动作 → 可直接复制模板 → 完成定义 → 反模式」的清晰骨架。
5. **按最保守的准确标准打 `evidence` 标签：** 只有填写真实本地环境与日期结果的条目才标 `tested`；混合证据段落用提示框明确拆开。
6. **编写周更日志（`YYYY-wNN.md`）：** 逐项记录 `added`、`revised`、`deprecated` 或 `alert`，并填入本次构建真实生成的 `affectedPages` 路径（如 `/zh/articles/codex/`）。
7. **跑通本地构建门禁：** 执行 `cd site && npm run check && npm test && npm run build`，直到 schema、内部锚点与 changelog 目标路由零报错。
8. **暂存目录并原子翻转软链：** 把 `dist/` 上传到全新的 `releases/<id>/`，核对权限后原子切换 `current` 软链，并在磁盘保留上一版本以便秒级回滚。
9. **线上冒烟与私有记录：** 探测关键页面状态码，在 `dist/` 之外记下本次发布摘要。

> [!NOTE] 先替换项目专属配置
> 下方 `site/`、`npm run check` 与 `ops/` 路径属于 OPC Vibe Stack。用于其他项目时，先查 README 和已有脚本再替换。本站完整测试使用 Linux CI 环境；部署示例依赖 GNU 工具和 `flock`。跳过平台测试不等于部署通过。

## 可直接复制模板

### 1. 周更日志条目模板（`site/src/content/changelog/zh/YYYY-wNN.md`）

这是示例草稿，不是已经完成的工作记录。替换所有示例主张与日期；确认实际改动与目标路由后，才能从草稿改为发布。

```yaml
---
slug: 2026-w46
date: "2026-11-14"
title: "第 46 周：收紧 Codex 沙箱参数说明与周日冒烟清单"
summary: "补充 Codex 只读与工作区写入沙箱边界，并在周更发布清单中加入静态资源缓存头检查。"
locale: zh
status: draft
changes:
  - type: revised
    text: "明确无人值守任务启动前的 read-only 与 workspace-write 审批边界。"
    affectedPages:
      - "/zh/articles/codex/"
      - "/en/articles/codex/"
    evidence: documentation-backed
internalBriefing:
  - date: "2026-11-12"
    note: "每周 CLI 官方文档例行核对"
publicSources:
  - title: "OpenAI Codex documentation"
    url: "https://developers.openai.com/codex"
    kind: docs
---
本周聚焦沙箱权限边界维护，核心三工具栈未新增外部工具。
```

### 2. 私有发布 / 空窗周记录（保存在公开仓库之外）

以下是填写示例，不是真实发布。自己的记录应存于工作区外或明确被 Git 忽略的目录；仅放在 `dist/` 外，并不能防止被提交到 Git。

```markdown
# 周更运维记录 — [YYYY-wNN]

- **执行日期与耗时：** 2026-11-14（85 分钟）
- **审阅简报范围：** 2026-11-08 .. 2026-11-14
- **保留 / 丢弃条数：** 保留 2 条 / 丢弃 9 条（纯发布造势噪音）
- **本周结论：** [正式发布 | 本周无实质更新]
- **改动文章 slug：** `codex`（en, zh）
- **更新日志 slug：** `2026-w46`
- **发布目录与回滚目标：** `releases/20261114-1830`（上一版：`releases/20261107-1715`）
- **线上冒烟结果：** `/` 最终进入 `/en/`（记录真实 HTTP 或页面跳转），`/zh/` 200，`/zh/articles/codex/` 200，`/zh/changelog/` 200，`/missing-probe` 404
```

## 完成定义

- [ ] 要么发布了含真实 `affectedPages` 的实质性 `YYYY-wNN` 更新日志，**要么**留下了写明过滤理由的私有「无更新」记录
- [ ] 本周新增或修改的每一个 `publicSources` 链接均由人工在浏览器中打开核实
- [ ] `cd site && npm run check && npm test && npm run build` 退出码为 `0`，无坏链或悬空 `affectedPages`
- [ ] 线上冒烟全部通过：`/`、`/en/`、`/zh/stack/`、至少一篇改动文章、`/zh/changelog/`、带哈希的 `/_astro/*` 静态资源，以及故意访问的不存在路径（返回 `404`）
- [ ] 服务器仍完整保留上一版 `releases/<prev-id>` 目录，随时可单命令切换软链回滚

## 反模式

- **没点开原文就把聚合帖里的二手链接发上线** — 极易把拼错的幻觉链接或被曲解的官方文档写进实操手册。
- **只改了标点或样式就顺手刷新文章 `updated` 日期** — 稀释更新时间信号，让读者再也不信页面标注的新鲜度。
- **悄悄修改关键操作建议却不写更新日志** — 老读者回访时根本不知道推荐参数或风险边界已经变了。
- **直接往线上目录覆盖式同步构建产物** — 一旦中途断网或构建半途出错，访客就会看到半新半旧的错乱页面。
