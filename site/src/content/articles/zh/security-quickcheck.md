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
published: "2026-11-06"
updated: "2026-11-10"
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
  - title: "GitHub security log"
    url: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-security-log"
    kind: docs
  - title: "GitHub SSH key review"
    url: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-ssh-keys"
    kind: docs
  - title: "Git ignore rules and tracked files"
    url: "https://git-scm.com/docs/gitignore"
    kind: docs
  - title: "Claude Code permissions"
    url: "https://code.claude.com/docs/en/permissions"
    kind: docs
tags: [alert, security]
notice:
  text: "下文事件主张来自社交报道（未验证）。本页是防御清单——不确认你已被入侵，也不提供攻击步骤。"
  relatedSlugs: [rules-hooks]
---

## 结论

Agent 的实际访问能力取决于沙箱、审批模式、系统权限与连接的工具。先盘点这些边界，不预设它一定完全隔离或等同 root。日常保持秘密不进提示词、核查扩展与 MCP 服务，并区分例行自查和疑似入侵响应。

## 从私有清单开始，不运行一键清理脚本

日常自查只记录组件名称、发布者、版本、密钥指纹、账号归属和权限范围。**不要把令牌值、私钥或完整环境变量输出粘进聊天或公开 issue。** 第一轮清单不等于证明机器干净。

GitHub 用户可按[安全日志指引](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-security-log)与[密钥审阅指引](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-ssh-keys)，打开 **Settings → Security log** 和 **Settings → SSH and GPG keys**，私下记录陌生活动，并与已知设备核对密钥。其他厂商的会话和密钥控制入口不同，并不存在通用的“一键吊销所有凭证”。

怀疑正在被入侵时，隔离受影响设备，用可信设备处理账号恢复。移除组件前保留相关日志与组件标识；修改服务器 SSH 访问前，先确认密钥归属和备用管理通道，不能仅凭眼生就删除，以免把自己锁在外面。范围不清时请系统负责人或事件响应人员介入。

**交付物：** 每个暴露面对应一条私有记录：负责人、核查证据、结果、下一步。没有 `authorized_keys` 只能记为“不适用 / 需核对账号配置”，不是安全证明；快速检查没有发现异常，也不能把整个账号标为已排除风险。

> [!WARNING] 社交报道是线索，不是入侵诊断
> 所引简报包含未经独立核实的扩展篡改与 agent 会话令牌失窃报告，本站未确认其时间线和影响范围。不要仅凭产品名称相同就判断自己的设备已被入侵；先核对具体组件标识与厂商公告，再使用下方防御清单。

## 五大暴露面 5 分钟防御排查表

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="防御检查地图">
    <img class="theme-diagram__light" src="/illustrations/security-quickcheck/overview.zh.light.svg" alt="" data-decorative="true" width="420" height="641" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/security-quickcheck/overview.zh.dark.svg" alt="" data-decorative="true" width="420" height="641" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>防御检查地图</strong> 分别检查扩展、SSH 密钥、Agent 会话、部署凭证，以及 MCP 和技能代码。这张图概括防护检查范围，不代表上方事件报告已经得到证实。</figcaption>
</figure>

| 暴露面 | 失守后果 | 5 分钟快速检查法 | 发现异常时的防御动作 |
|---|---|---|---|
| **编辑器扩展市场** | 仿冒包或被劫持更新在本地执行任意代码 | 查看已安装扩展及近 14 天更新时间，核对发布者精确 ID | 若正在被入侵则隔离设备；保留组件标识与日志，停用可疑代码并评估暴露凭证 |
| **SSH `authorized_keys`** | 攻击者免密持久登录开发机或线上服务器 | 逐行打开本机与 VPS 的 `~/.ssh/authorized_keys` | 确认归属与备用管理通道后，撤销未授权密钥并检查登录日志 |
| **Agent CLI 与桌面令牌** | 窃密程序直接偷走本地令牌，仅改密码无法止血 | 登录 Anthropic / OpenAI / xAI / GitHub 后台查活跃会话 | 全端强制退出登录、吊销旧 API Key，在干净系统重新授权 |
| **云端与部署凭证** | Agent 误读或改写线上生产资源 | 检查项目目录是否散落 `.env*` 或全局云管理员密钥 | 部署账号严格限权在 `/srv/<app>`，绝不用 `root` 跑日常会话 |
| **MCP 服务器与 Skills** | 恶意脚本或外网网页触发间接提示词注入 | 盘点 `.mcp.json`、`~/.codex/config.toml` 与 `.claude/skills/` | 仅保留审过源码的组件；令牌一律通过受限环境变量传入 |

> [!FLOW] 怀疑凭证暴露时的止血顺序
> 1. **断连与退出** — 隔离受影响设备，保留相关证据，在可信设备上处理恢复。
> 2. **后台吊销令牌** — 在各厂商控制台直接吊销 API Key、OAuth 授权、Git 令牌与部署密钥。
> 3. **排查持久化项** — 逐一核查 `~/.ssh/authorized_keys`、终端启动配置与定时任务。
> 4. **最小权限重签** — 在确认干净的机器上重新签发最小作用域密钥，并记录轮换时间。

## 步骤

1. **盘点近两周安装或自动更新过的编辑器扩展。** 停用并调查不认识的扩展，移除前先确认来源；核对官方认证发布者标识，绝不顺手点社交帖子里的短链装插件。
2. **逐行核查 `~/.ssh/authorized_keys`（含开发机与线上 VPS）。** 按密钥指纹与清单核对归属；缺少备注不等于密钥恶意。
3. **怀疑令牌失窃时，必须「吊销会话 + 轮换密钥」，不能只改登录密码。** 信息窃取类程序直接搬走本地缓存令牌，只有去厂商后台撤销活跃会话与旧 API Key 才能真正切断访问。**严禁**运行社交帖里来路不明的「一键排查脚本」或复现样本。
4. **区分 Git 防漏与访问控制。** `.gitignore` 只能减少未跟踪文件被误加入，不阻止读取，也不清除已提交历史。真实秘密放在 agent 无权访问的位置，并实测权限/沙箱边界（见[规则文件 + hooks](/zh/articles/rules-hooks/)），并按 Astro 环境变量规范确保服务端密钥绝不打进前端静态产物。
5. **收窄部署账号权限。** 部署身份仅授予实际需要的发布路径和已审阅的激活/回滚操作。仅能写 `releases/` 并不意味着可以切换 `current`；不要为了部署成功而扩大到通用管理员权限。
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
- [ ] 已记录秘密扫描范围与结果；发现暴露凭证时先撤销，再处理跟踪文件与历史
- [ ] 各 agent CLI 与 MCP 配置均通过环境变量引用凭证，仓库配置文件零明文密钥
- [ ] 线上 VPS 部署身份非 `root`，权限严格限制在站点发布目录内
- [ ] 已记录所用厂商的会话、OAuth 授权、API Key 与部署凭证的撤销入口及负责人

## 反模式

- **顺着热门帖子一键安装未核实发布者的扩展或 MCP** —— 热门 AI 工具名正是仿冒投毒的头号目标。
- **怀疑中招后只改账号密码、不吊销 API Key 与活跃会话** —— 已泄露的持久化令牌在吊销前依然有效。
- **为了「让 agent 顺手部署」把云平台超级密钥塞进项目目录** —— 本地构建校验与受控脚本发版必须物理分层。
- **把一条社交爆料当成最终取证报告（或跟着帖子跑攻击复现命令）** —— 只做干净的防御性排查与密钥轮换，通告以官方安全页为准。
