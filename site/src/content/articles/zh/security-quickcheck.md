---
title: "Agent 编程安全速查"
slug: security-quickcheck
summary: "15 分钟完成编辑器扩展、SSH 公钥、agent 会话令牌与 MCP 服务器的防御性自查——附未验证事件背景。"
locale: zh
category: alert
stage: cross
tools: [claude-code, codex, grok-build]
priority: P0
status: published
evidence: unverified
applicableToolsVersions: "所有本地编程 agent CLI、桌面聊天客户端、MCP 服务器与编辑器扩展市场；工具升级后请复查"
updated: "2026-11-07"
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
  relatedSlugs: [rules-hooks]
---

## 结论

本地编码 agent 默认继承你当前系统账号的终端、文件系统与网络权限——请把它的**编辑器扩展、MCP 服务器与本地会话令牌视同生产高危权限**。日常做到密钥不进提示词、扩展来源逐一核验；一旦社区出现供应链告警，按固定顺序做防御性排查与凭证轮换。

> [!WARNING] 未验证安全报道背景（仅作防御自查参考）
> 近期简报关联的 X 帖文提到两类值得做防御性体检的风险：
> 1. Cursor 扩展市场曾出现被篡改的 **Claude Code 同名/仿冒品牌扩展**（发帖人称在 `2026-10-29` 前后存续约 11 小时，并称可能尝试写入 SSH `authorized_keys` 持久化）。
> 2. **Windows 信息窃取木马（Infostealer）** 开始一并搜刮本地编码 agent 与 AI 桌面端缓存的会话令牌。
>
> 上述事件细节在本站仍标为**未验证**——行动前请自行点开下方原文链接并查阅厂商官方安全公告，勿将社交帖细节直接等同于最终调查结论。

## 五大暴露面 5 分钟防御排查表

| 暴露面 | 失守后果 | 5 分钟快速检查法 | 发现异常时的防御动作 |
|---|---|---|---|
| **编辑器扩展市场** | 仿冒包或被劫持更新在本地执行任意代码 | 查看已安装扩展及近 14 天更新时间，核对发布者精确 ID | 立即卸载可疑扩展，排查 `authorized_keys`，轮换全部令牌 |
| **SSH `authorized_keys`** | 攻击者免密持久登录开发机或线上服务器 | 逐行打开本机与 VPS 的 `~/.ssh/authorized_keys` | 立即删除陌生公钥，重新生成 SSH 密钥对并检查登录日志 |
| **Agent CLI 与桌面令牌** | 窃密程序直接偷走本地令牌，仅改密码无法止血 | 登录 Anthropic / OpenAI / xAI / GitHub 后台查活跃会话 | 全端强制退出登录、吊销旧 API Key，在干净系统重新授权 |
| **云端与部署凭证** | Agent 误读或改写线上生产资源 | 检查项目目录是否散落 `.env*` 或全局云管理员密钥 | 部署账号严格限权在 `/srv/<app>`，绝不用 `root` 跑日常会话 |
| **MCP 服务器与 Skills** | 恶意脚本或外网网页触发间接提示词注入 | 盘点 `.mcp.json`、`~/.codex/config.toml` 与 `.claude/skills/` | 仅保留审过源码的组件；令牌一律通过受限环境变量传入 |

> [!FLOW] 怀疑凭证暴露时的止血顺序
> 1. **断连与退出** — 卸载可疑扩展/组件，退出各编码 CLI 与桌面客户端活跃会话。
> 2. **后台吊销令牌** — 在各厂商控制台直接吊销 API Key、OAuth 授权、Git 令牌与部署密钥。
> 3. **排查持久化项** — 逐一核查 `~/.ssh/authorized_keys`、终端启动配置与定时任务。
> 4. **最小权限重签** — 在确认干净的机器上重新签发最小作用域密钥，并记录轮换时间。

## 步骤

1. **盘点近两周安装或自动更新过的编辑器扩展。** 删掉所有非本人明确安装的扩展；核对官方认证发布者标识，绝不顺手点社交帖子里的短链装插件。
2. **逐行核查 `~/.ssh/authorized_keys`（含开发机与线上 VPS）。** 每一把留存公钥都必须有你认得出的备注与归属设备。
3. **怀疑令牌失窃时，必须「吊销会话 + 轮换密钥」，不能只改登录密码。** 信息窃取类程序直接搬走本地缓存令牌，只有去厂商后台撤销活跃会话与旧 API Key 才能真正切断访问。**严禁**运行社交帖里来路不明的「一键排查脚本」或复现样本。
4. **筑牢 `.env` 隔离墙。** 敏感配置只放进被 Git 忽略的 `.env` 或系统钥匙串，配合 hooks 拦截 `.env*` 读取（见[规则文件 + hooks](/zh/articles/rules-hooks/)），并按 Astro 环境变量规范确保服务端密钥绝不打进前端静态产物。
5. **收窄部署账号权限。** VPS 部署密钥只给 `/srv/<site>/releases/` 的写入权限，绝不在拥有生产 `root` 免密权限的终端里随便跑 agent。
6. **验证命令坚持本地闭环。** 优先跑纯本地单测与静态构建（`npm test`、`npm run build`），拒绝在验证脚本里 `curl` 外部陌生脚本。
7. **接入 MCP 与 `SKILL.md` 前先审代码。** 正如 Claude Code 官方 MCP 文档提醒，凡是会抓取外部不受控网页的 MCP 服务，都可能把提示词注入带进本地会话。

## 可直接复制的安全基线模板

### 仓库 `.gitignore` 密钥防漏基线

```text
# 本地环境变量与密钥（严禁提交）
.env
.env.*
!.env.example

# 本地私钥、发布记录与构建产物
*.pem
*.key
ops/records/
dist/
```

### 15 分钟私有安全体检记录表（保存在公开仓库之外）

```text
体检日期：YYYY-MM-DD
操作系统 / 开发机标识：
已核查编辑器扩展（发布者已确认、闲置项已卸载）：
已核查 ~/.ssh/authorized_keys（开发机 + 线上 VPS）：
Agent CLI 会话与 API 密钥上次轮换日期：
已审阅的活跃 MCP 服务器与 SKILL.md 目录：
部署密钥最小权限核验结果（非 root、仅限发布目录）：
```

## 15 分钟防御自查清单

- [ ] 当前所有已安装编辑器扩展均核对过真实发布者，无来路不明插件
- [ ] 开发机与 VPS 的 `~/.ssh/authorized_keys` 中没有任何陌生公钥
- [ ] Git 工作区与历史记录中零 API Key、零 `.env` 明文、零私钥残留
- [ ] 各 agent CLI 与 MCP 配置均通过环境变量引用凭证，仓库配置文件零明文密钥
- [ ] 线上 VPS 部署身份非 `root`，权限严格限制在站点发布目录内
- [ ] 清楚掌握 Claude、OpenAI、xAI、GitHub 与 Cloudflare 后台一键吊销会话与密钥的入口

## 反模式

- **顺着热门帖子一键安装未核实发布者的扩展或 MCP** —— 热门 AI 工具名正是仿冒投毒的头号目标。
- **怀疑中招后只改账号密码、不吊销 API Key 与活跃会话** —— 已泄露的持久化令牌在吊销前依然有效。
- **为了「让 agent 顺手部署」把云平台超级密钥塞进项目目录** —— 本地构建校验与受控脚本发版必须物理分层。
- **把一条社交爆料当成最终取证报告（或跟着帖子跑攻击复现命令）** —— 只做干净的防御性排查与密钥轮换，通告以官方安全页为准。
