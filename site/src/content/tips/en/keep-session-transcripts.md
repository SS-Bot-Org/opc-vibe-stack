---
title: Keep Claude Code sessions longer than 30 days
slug: keep-session-transcripts
summary: Claude Code deletes session transcripts older than 30 days without a message. Raise cleanupPeriodDays if you need /resume to find them.
locale: en
tools:
  - claude-code
appliesTo: Claude Code settings (any settings file), as documented on the settings reference opened 2026-11-22.
tags:
  - settings
  - sessions
evidence: documentation-backed
wording: '"cleanupPeriodDays": 3650'
wordingLang: text
effect: "Official settings docs say cleanupPeriodDays sets how many days Claude Code keeps session transcripts and other application data (default 30). The deletion runs as a background sweep after a session starts and shows no message, so older sessions disappear from the /resume picker. A larger value keeps them."
limits: "The value must be a whole number of at least 1; setting 0 fails validation, which is why the docs suggest a large value such as 3650 for long retention. Transcripts are stored locally in plaintext, so longer retention keeps any sensitive content longer; the docs describe how to stop writing transcripts at all. Sessions last used in Claude Desktop or Cowork follow separate rules (desktopSessionCleanupPeriodDays)."
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
