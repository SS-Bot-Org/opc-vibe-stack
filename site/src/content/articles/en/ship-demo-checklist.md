---
title: "Ship & demo: landing page + agent-made demo checklist"
slug: ship-demo-checklist
summary: "Sell-side checklist: landing clarity, ≤90s demo path, and optional agent-filmed screen recordings."
locale: en
category: checklist
stage: sell
tools: [grok-build, claude-code, codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Any stack agent plus your static host; optional agent-screenplay MCP/CLI for filmed demos"
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

## Conclusion

Shipping is not “repo green.” Shipping is a stranger understanding the offer and completing the primary path. A short demo video helps—whether you record it yourself or let a coding agent drive an open-source screen-recording MCP/CLI.

## Prerequisites

- A public URL (even a provisional origin)
- One sentence offer and one primary CTA
- Optional: Node 20+ if you try agent-screenplay (`npx agent-screenplay init` per its README)

## Steps

1. Write the landing in this order: who it’s for → problem → offer → proof → CTA.
2. Record or generate a **≤90s demo** that shows the happy path only.
3. **Optional agent-filmed demo:** tools such as [agent-screenplay](https://github.com/gmpetrov/agent-screenplay) let Claude Code / Codex / Cursor (or any MCP client) explore a site or desktop app, write a scenario, and export an MP4 with cursor, zooms, and captions. The package contains no model of its own—your agent does the thinking. Read the README before installing; point scenarios at staging, not production with real customers. Existence of the tool is **documentation-backed**; whether it fits your OPC is for you to verify.
4. Smoke-test on mobile: home, CTA, and one recovery path (404 or empty state).
5. Add pricing or “how to start” without inventing metrics.
6. Log inbound questions for a week; fold answers into the page.

## Template fields

```text
Audience:
Offer in one sentence:
Primary CTA:
Demo link / MP4 path:
Demo tool used (manual | agent-screenplay | other):
Known objections:
```

## Definition of done

A peer can explain what you sell after one page view and one demo without you on the call.

## Anti-patterns

- Feature laundry lists with no CTA
- Fake social proof or unverified revenue numbers
- Filming production accounts that send real emails/charges during an automated scenario

## Sources

Astro docs inform the static, locale-prefixed shipping pattern used by this site (dogfood). agent-screenplay README and the briefing X post support the optional agent-filmed demo step.
