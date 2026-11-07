---
title: "上线与演示：落地页 + agent 演示清单"
slug: ship-demo-checklist
summary: "把跑通的仓库变成陌生人能买单的供给：五段式落地页、≤90 秒演示分镜与预发环境安全录屏。"
locale: zh
category: checklist
stage: sell
tools: [grok-build, claude-code, codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "任意栈内 agent + 静态/预发托管环境；可选用 agent-screenplay MCP/CLI（需 Node 20+）生成脚本化录屏"
updated: "2026-11-07"
internalBriefing:
  - date: "2026-11-04"
    note: "Agent-made demo / screen recording tools"
publicSources:
  - title: "agent-screenplay README"
    url: "https://github.com/gmpetrov/agent-screenplay"
    kind: docs
  - title: "Agent-made polished screen recordings (briefing post)"
    url: "https://x.com/RoundtableSpace/status/2117802763262591481"
    kind: x
  - title: "Astro internationalization (locale-prefixed routes)"
    url: "https://docs.astro.build/en/guides/internationalization/"
    kind: docs
  - title: "Astro project structure"
    url: "https://docs.astro.build/en/basics/project-structure/"
    kind: docs
tags: [sell, launch, demo]
---

## 结论

「`main` 分支全绿」不叫上线。真正的上线是：**一个完全陌生的访客打开你的公开链接，10 秒内看懂这是给谁解决什么问题，花 ≤90 秒看完或点完核心快乐路径，并在没有你语音解释的情况下顺畅完成主 CTA。**

> [!FLOW] 从「仓库变绿」到「陌生人可转化」
> 1. **搭五段式落地页** — 按顺序写清受众、痛点、供给、可核验证据与唯一主 CTA。
> 2. **做 ≤90 秒演示** — 手动实录或在预发环境用脚本生成单路径核心演示。
> 3. **手机与异常冒烟** — 在手机窄屏实测首屏加载、主按钮与 `404` 恢复路径。
> 4. **7 天异议回流** — 记录首周真实提问，把高频顾虑直接补回页面文案。

## 五段式落地页结构蓝图

按买家阅读心理从上往下排布，让每一次滚屏都刚好回答下一个顾虑：

| 区块 | 文案任务 | 陌生人 10 秒验收标准 |
|---|---|---|
| **1. 受众 + 一句话供给** | 点名具体目标人群与交付结果 | 访客看完首屏就能复述你在卖什么 |
| **2. 现状痛点对比** | 对比手工东拼西凑的痛苦 vs 你的闭环方案 | 目标用户一眼认出自己正在踩的坑 |
| **3. ≤90 秒快乐路径演示** | 真实展示「输入 → 产出」（视频或免登录交互预览） | 无需先注册账号就能看懂核心价值 |
| **4. 诚实可核验的证据** | 放开源仓库、官方文档、真实样例或带标签的实测说明 | 零虚构用户数、零假客户 Logo |
| **5. 唯一主 CTA 与定价/起步** | 一个明确动作（开始使用、复制安装、购买或加入候补） | 访客清楚代价与点击后的下一步 |

## ≤90 秒产品演示分镜表

上线演示只讲透 **一件事**——砍掉注册登录、后台配置和枝节开关：

| 时间段 | 画面内容 | 字幕 / 旁白原则 |
|---|---|---|
| **0:00–0:10** | 切入痛点现场（杂乱输入或低效旧做法） | 一句大白话点破要解决的具体问题 |
| **0:10–0:45** | 核心工作流端到端跑通 | 展示真实响应，不靠恶意剪辑隐瞒关键前置条件 |
| **0:45–1:10** | 最终交付产物或校验结果 | 放大买家真正能带走的核心收益 |
| **1:10–1:30** | 公开网址 + 唯一主 CTA | 给出明确访问入口与第一步操作指引 |

## 前置条件

- 一个外网可访问的正式或预发 URL（可用 [Grok Build](/zh/articles/grok-build/) 或如本站一样的静态 Astro 部署）
- 一句话卖点、唯一主 CTA，以及真实透明的定价或使用门槛
- 可选（脚本化录屏）：若试用 [agent-screenplay](https://github.com/gmpetrov/agent-screenplay)（按其 README 执行 `npx agent-screenplay init`），需准备 Node.js 20+

## 步骤

1. **先用纯文本把五段文案写顺，再去调样式**——如果在纯 Markdown 里都讲不清卖点，再炫的动效也救不回来。
2. **录制一段 ≤90 秒的快乐路径演示**，手动干净录一遍或用脚本驱动均可。
3. **可选：在预发环境试用 agent 驱动录屏。** 像 [agent-screenplay](https://github.com/gmpetrov/agent-screenplay) 这类开源 MCP/CLI 工具允许 [Claude Code](/zh/articles/claude-code/)、[Codex](/zh/articles/codex/) 等客户端读取本地或预发应用、编写交互剧本并导出带光标移动、局部放大与字幕的 MP4（工具包自身不内置大模型）。工具存在及用法属**文档依据**；成片质感与依赖安全性请亲自把关。
4. **在手机窄屏（`≤390px`）做完整冒烟：** 检查首屏打开速度、视频/演示可用性、主 CTA 点击、语言/主题切换（正如本站 dogfood 的双语与暗色切换），以及故意输入错地址时的 `404` 恢复路径。
5. **坦诚写明价格或起步方式**，严禁编造假倒计时、假名额上限或未验证的投资回报率。
6. **收集首周入站问题：** 连续 7 天记下同行私信、评论区或邮件里的真实疑问，把排名前三的顾虑直接写进落地页正文或 FAQ。

> [!WARNING] 严禁让自动化录屏脚本连真实生产账号
> 自动化浏览器/桌面剧本会真实点击按钮并提交表单。运行 `agent-screenplay` 或任何浏览器控制类 MCP 时，**必须**只指向 `localhost` 或关闭了真实扣款与外部发信的隔离预发环境——绝不要对着线上 Stripe、生产 Webhook 或真实客户数据开跑。

## 可直接复制的上线与演示准备单

```text
具体目标买家：
现状痛点（一句话）：
一句话核心卖点：
主 CTA 按钮文案 + 跳转地址：
定价 / 准入方式（免费开源 | 付费档位 | 候补名单）：
演示制作方式（手动实录 | 免登录交互预览 | agent-screenplay）：
录屏所用预发地址（确认零生产副作用）：
页面需直接回应的前 3 个买家顾虑：
```

## 上线前冒烟核对清单

- [ ] 同行在不听任何口头解释的情况下，看完一页即可说清目标受众与核心功能
- [ ] 主 CTA 在桌面端与手机窄屏（`≤390px`）均能端到端走通
- [ ] 演示视频或交互路径在 `≤90 秒` 内直达核心产出
- [ ] 全页零虚假评价、零捏造用户规模、零无出处的性能倍数声明
- [ ] 自动化录屏脚本（若使用）仅在本地或隔离预发环境执行，未触发任何真实扣款或客户邮件
- [ ] `404` 页面、社交分享卡片（Open Graph 标题/配图）与 canonical 链接均解析正常

## 反模式

- **罗列 15 条技术特性却找不到主 CTA** —— 访客夸一句「挺厉害」然后直接关掉标签页。
- **拿编造的数据或假徽章给新产品贴金** —— 在独立开发者与技术买家中一次失信即永久拉黑。
- **放一段从 `git clone` 和输密码开始的 7 分钟未剪辑长视频** —— 先用前 60 秒亮出成果，详细配置放到文档页。
- **拿真实生产账号跑自动化录屏脚本** —— 一次误点就可能发出真实账单或骚扰邮件。
