---
title: "内容站周更闭环"
slug: weekly-content-site-refresh
summary: "周日 90–120 分钟：过滤简报、改 Markdown、校验、写 changelog、部署——不编造新闻。"
locale: zh
category: playbook
stage: cross
tools: [claude-code, codex]
priority: P1
status: published
evidence: documentation-backed
applicableToolsVersions: "Astro 静态站 + Markdown collections；任选 agent CLI；编辑验证门按本站 SDD"
updated: "2026-11-06"
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

用**定时周更闭环**（目标 **90–120 分钟**）保持实践站新鲜：过滤简报输入、只改可执行页、诚实标证据、changelog 写清 `affectedPages`、校验后原子部署。过滤后若无实质内容就跳过本周——不要编造填充。

## 时限

| 步骤 | 分钟 | 门槛 |
|---|---|---|
| 过滤与映射 | 15–25 | 只要可复用的 OPC 动作 |
| 改写与来源 | 30–45 | 步骤 + 完成定义 + 公开永久链接 |
| 证据与提示 | 10–15 | tested / documentation-backed / unverified |
| Changelog | 10–15 | 本版真实存在的 `affectedPages` |
| 校验与部署 | 15–25 | 构建绿；冒烟探针 |
| 私有记录 | 5 | 发布记录放在 `dist/` 外 |

若过滤结果为空，第 1 步后停止，并私下记录「无更新」。

## 前置条件

- 带 schema 校验的 Markdown/MDX 内容站（本站用 Astro collections）
- 每周简报或 digest 输入（未核验前视为不可信）
- 可暂存 release 目录并翻转 symlink 的部署路径（勿直写线上目录 rsync）
- 作用域限于站点文件的 SSH 或 CI 身份

## 工具链

1. **人类 / 编辑：** 过滤主张；打开原文；标证据。
2. **Claude Code 或 Codex：** 改 Markdown、跑 `npm run build`、修校验错误。
3. **主机：** Nginx 服务 `/srv/.../current`；回滚 = 指回上一 symlink。

## 步骤

1. **过滤：** 从本周 Vibe Coding 笔记里，只留会改可执行清单、工具卡、playbook 或告警的条目。丢掉纯新闻与情绪帖。
2. **映射：** 每条保留项决定「改现有」还是「新页」。优先改现有。
3. **改写：** 结论 → 前置 → 步骤 → 模板字段 → 完成定义 → 反模式。保留主张限定语。
4. **核对来源：** 打开每个公开 URL。不编造 X 链接。未读则保持草稿或丢掉主张。
5. **证据：** 用「最不夸大但仍准确」的标签。混合证据可拆段。
6. **Changelog：** 一条周更（`YYYY-wNN`），`changes[]` 非空，且每条 `affectedPages` 在**本版**真实存在。
7. **校验：** `npm run validate && npm run build`（或项目等价）。修到绿。
8. **部署：** 上传到 `releases/<id>/`，校验和，原子翻转 `current`。冒烟首页、改动文、changelog、故意 404。
9. **记录：** 私有发布记录（版本、路径、结果）。给下次简报焦点写反馈备注。

## 模板字段

- 简报日期范围：
- 保留 / 丢弃：
- 改动 slug：
- Changelog slug：
- Release id：
- 耗时分钟：

## 完成定义

要么 (a) 发布了含实质 `changes[]` 的 changelog 且冒烟通过，要么 (b) 私下写了带过滤理由的「无更新」——绝不要假的「已周更」日期。

## 反模式

- 发布未读过的引用
- 把纯措辞微调算作实质变更
- 指导已变却不写 changelog
- 永远不做回滚演练

## 来源

见 frontmatter `publicSources`。配套：[规则与 hooks](/zh/articles/rules-hooks/)、[安全速查](/zh/articles/security-quickcheck/)、[更新日志](/zh/changelog/)。
