---
title: Ask Codex for live search only when you need it
slug: codex-live-web-search
summary: Local Codex searches a cached index by default. Add --search for one run when the answer depends on pages published since then.
locale: en
tools:
  - codex
appliesTo: Codex CLI local sessions, as documented on the web search page opened 2026-11-22.
tags:
  - search
  - config
evidence: documentation-backed
wording: codex --search "Summarize the latest release notes for this dependency"
wordingLang: bash
effect: "Official web search docs say local Codex uses cached search by default: results come from an OpenAI-maintained index instead of live page fetches, which lowers prompt-injection risk but doesn't remove it. Passing --search fetches live results for that run. To change the default, set web_search = \"live\" in config.toml; \"disabled\" turns the tool off, and \"indexed\" allows external access only when the search index gates the request."
limits: "Live results raise prompt-injection exposure, so treat every result as untrusted input. With full access, search already defaults to live. Web search is a hosted tool: the sandbox network proxy and domain allowlist don't apply to it, and it can stay available when command network access is off. Not measured on this site."
officialSource: &a1
  title: "Web search (Codex CLI and local search modes)"
  url: https://learn.chatgpt.com/docs/web-search
  kind: docs
dateAdded: "2026-11-22"
lastVerified: "2026-11-22"
status: active
internalBriefing:
  - date: "2026-11-18"
    note: "Vibe Coding briefing tip: Codex searches a cache by default; use --search for live results"
publicSources:
  - *a1
---
