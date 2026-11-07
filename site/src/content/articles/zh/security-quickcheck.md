---
title: "Agent 编程安全速查"
slug: security-quickcheck
summary: "扩展、SSH 公钥与 agent 令牌的硬禁区——市场与恶意软件报道在你核对原文前一律标未验证。"
locale: zh
category: alert
stage: cross
tools: [claude-code, codex, grok-build]
priority: P0
status: published
evidence: unverified
applicableToolsVersions: "任意本地 agent CLI 与编辑器扩展市场；工具更新后请再核对"
updated: "2026-11-06"
internalBriefing:
  - date: "2026-11-01"
    note: "Cursor marketplace Claude Code extension compromise report"
  - date: "2026-11-05"
    note: "Windows infostealer targeting coding-agent tokens"
publicSources:
  - title: "Tampered Claude Code extension in Cursor marketplace (report)"
    url: "https://x.com/neuralnotions/status/2116883761329803580"
    kind: x
  - title: "Windows infostealers grabbing coding-agent tokens (report)"
    url: "https://x.com/OmniFrontier/status/2118337244935106668"
    kind: x
  - title: "Astro environment variables (keep secrets out of the client)"
    url: "https://docs.astro.build/en/guides/environment-variables/"
    kind: docs
  - title: "Claude Code overview"
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
    kind: docs
  - title: "MCP trust warning (Claude Code)"
    url: "https://code.claude.com/docs/en/mcp"
    kind: docs
tags: [alert, security]
notice:
  text: "下文事件主张来自社交报道（未验证）。本页是防御清单——不确认你已被入侵，也不提供攻击步骤。"
  relatedSlugs: []
---

## 结论

把 agent 工具当生产权限对待：最小权限、提示词不进密钥，并核实机器上有哪些扩展、SSH 公钥与会话令牌。**告警：** 近期 X 报道称 (1) Cursor 市场出现被篡改的 Claude Code 品牌扩展（发帖人称约在 2026-10-29 前后上架约 11 小时，可能涉及 SSH 公钥持久化），以及 (2) Windows 信息窃取程序瞄准编程 agent 与聊天令牌。这些主张在此均为**未验证**——行动前请自行打开链接帖（以及你能找到的厂商通告）。

## 前置条件

- 能查看编辑器扩展列表与 `~/.ssh/authorized_keys`（或系统等价物）
- 能轮换令牌 / 退出 agent CLI 及相关桌面应用
- 愿意把市场安装与 MCP 服务器当作你会运行的代码

## 步骤

1. **盘点扩展：** 近两周安装或更新过的；删掉非故意添加的。优先固定版本与知名发布者，而非社交「装这个」链接。
2. **检查 SSH authorized keys：** 去掉陌生公钥。若异常，轮换密钥并审阅近期登录。（在市场妥协报道后建议做——你的机器是否受影响仍**未验证**。）
3. **假定只改密码可能不够**——若窃取程序拿走了会话令牌或 API 密钥。退出 agent CLI 与相关应用，撤销 API 密钥，轮换部署凭证。**不要**跟着社交帖做恶意软件分析或利用步骤——只做防御性轮换。
4. **密钥勿进聊天。** 用 gitignore 的 env 文件；永不把令牌粘进提示词。
5. **收窄部署凭证**到站点路径；别用 root 随便开 agent 会话。
6. **优先用不外泄密钥的验证命令**（本地测试优于「curl 某个怪 URL」）。
7. **MCP 与 skills：** 只连接你信任的服务器、只装你信任的 skill 包；会拉外网内容的服务器可能引入提示注入（见 Claude Code MCP 文档）。

## 模板字段

```text
扩展审阅日期：
发现未知 SSH 公钥？：
Agent CLI / API 令牌轮换日期：
桌面应用已退出登录？：
部署身份作用域：
已审阅的 MCP 服务器：
```

## 完成定义

你能说出上次审阅扩展与 SSH 公钥的时间；对适用你操作系统的可信令牌窃取报道已轮换 agent 凭证；默认情况下 agent 会话读不到生产密钥。

## 反模式

- 不查发布者就按社交链接装市场扩展
- 为了「给 agent 方便」把云密钥放进仓库
- 把一条 X 帖子当完成的取证报告
- 发布或索要利用 / 持久化复现步骤

## 来源

事件项仅引用简报关联的 X 帖（本版已打开）。官方 Astro 环境变量与 Claude Code 文档支撑一般密钥卫生。只有在评估过厂商公告或一级通告后，才把主张升为 `documentation-backed`。
