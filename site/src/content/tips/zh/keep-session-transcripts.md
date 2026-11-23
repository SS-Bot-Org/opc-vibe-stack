---
title: 让 Claude Code 的会话保留超过 30 天
slug: keep-session-transcripts
summary: Claude Code 会静默删除 30 天前的会话记录。需要用 /resume 找回旧会话时，调大 cleanupPeriodDays。
locale: zh
tools:
  - claude-code
appliesTo: Claude Code 设置（任意设置文件），按 2026-11-22 打开的设置参考文档。
tags:
  - settings
  - sessions
evidence: documentation-backed
wording: '"cleanupPeriodDays": 3650'
wordingLang: text
effect: 官方设置文档写明：cleanupPeriodDays 决定 Claude Code 保留会话记录和其他应用数据的天数（默认 30）。会话启动后会在后台清理，不会提示，更早的会话就会从 /resume 列表里消失。调大这个值就能保留它们。
limits: 取值必须是至少为 1 的整数；设成 0 会校验失败，所以官方建议长期保留时填 3650 这样的大数。会话记录以明文存在本机，保留越久，其中的敏感内容也留得越久；官方文档也说明了如何完全不写会话记录。在 Claude Desktop 或 Cowork 里最后使用的会话另有规则（desktopSessionCleanupPeriodDays）。
officialSource: &a1
  title: "Claude Code settings reference: cleanupPeriodDays"
  url: https://code.claude.com/docs/en/settings-reference#cleanupperioddays
  kind: docs
discoverySource: &a2
  title: Voxyz_ai, 2026-11-19
  url: https://x.com/Voxyz_ai/status/2123431117634367675
  kind: x
dateAdded: "2026-11-22"
lastVerified: "2026-11-22"
status: active
internalBriefing:
  - date: "2026-11-19"
    note: "Vibe Coding briefing tip: Claude Code silently deletes sessions after 30 days"
publicSources:
  - *a1
  - *a2
---
