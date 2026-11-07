---
title: "上线与演示：落地页 + agent 演示清单"
slug: ship-demo-checklist
summary: "销售侧清单：落地页清晰度、≤90 秒演示路径，以及可选的 agent 录屏。"
locale: zh
category: checklist
stage: sell
tools: [grok-build, claude-code, codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "任意栈 agent + 你的静态托管；可选 agent 录屏 MCP/CLI"
updated: "2026-11-06"
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

上线不等于「仓库变绿」。上线是陌生人理解卖点并走完主路径。短演示视频有帮助——无论你自己录，还是让编程 agent 驱动开源录屏 MCP/CLI。

## 前置条件

- 公开 URL（临时源站也可以）
- 一句话卖点与一个主 CTA
- 可选：若试用 agent-screenplay（按其 README：`npx agent-screenplay init`），需要 Node 20+

## 步骤

1. 按此顺序写落地页：给谁 → 问题 → 卖点 → 证据 → CTA。
2. 录制或生成 **≤90 秒演示**，只展示快乐路径。
3. **可选 agent 录屏：** 如 [agent-screenplay](https://github.com/gmpetrov/agent-screenplay) 可让 Claude Code / Codex / Cursor（或任意 MCP 客户端）探索站点或桌面应用、写场景、导出带光标/缩放/字幕的 MP4。包本身不含模型——思考由你的 agent 完成。安装前读 README；场景指向预发，不要对着有真实客户的生产。工具存在属**文档依据**；是否适合你的 OPC 请自行核实。
4. 在手机上冒烟：首页、CTA、以及一条恢复路径（404 或空状态）。
5. 加定价或「如何开始」，不要编造指标。
6. 记录一周入站问题；把答案折回页面。

## 模板字段

```text
受众：
一句话卖点：
主 CTA：
演示链接 / MP4 路径：
演示工具（手动 | agent-screenplay | 其他）：
已知异议：
```

## 完成定义

同行看完一页与一段演示后，能在你不在场时说清你卖什么。

## 反模式

- 功能清单堆砌却没有 CTA
- 假社会证明或未验证营收数字
- 自动化场景对着会发真实邮件/扣款的生产账号录屏

## 来源

Astro 文档支撑本站静态、语言前缀的上线模式（dogfood）。agent-screenplay README 与简报 X 帖支撑可选的 agent 录屏步骤。
