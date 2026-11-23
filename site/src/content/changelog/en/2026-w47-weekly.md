---
slug: 2026-w47-weekly
date: "2026-11-22"
title: "Week 47 — Google Antigravity joins the featured three; fail-closed hooks; repo config review"
summary: "New Google Antigravity tool guide replaces Grok Build in the featured three; hooks, security, and Codex guides revised; four new documentation-backed tips."
locale: en
status: published
changes:
  - type: added
    text: "New tool guide for Google Antigravity in the sell stage: plan one buyer-facing change, have the agent check the path in a browser, and review the walkthrough and screenshots. Built from the official docs opened 2026-11-22; not run on this site. It replaces Grok Build in the homepage’s featured three after a week of sustained English and Chinese discussion (evidence in the pull request). The Grok Build guide stays published, with a notice, and is listed under Previously featured on the Stack page."
    affectedPages:
      - /en/articles/antigravity/
      - /zh/articles/antigravity/
      - /en/articles/grok-build/
      - /zh/articles/grok-build/
      - /en/stack/
      - /zh/stack/
      - /en/
      - /zh/
    evidence: documentation-backed
  - type: revised
    text: "Added a step to make policy hooks fail closed with onFailure block (versions, events it doesn’t cover, and the 2.1.329 Code Mode change), and noted that the Claude Code sandbox wraps shell commands only, so a sandbox denyRead entry doesn’t stop the Read tool."
    affectedPages:
      - /en/articles/rules-hooks/
      - /zh/articles/rules-hooks/
    evidence: documentation-backed
  - type: revised
    text: "Added a step to review agent configuration files like code: what the Bitdefender (2026-11-17) and Google Threat Intelligence (2026-11-16) reports describe, which files to read before trusting a cloned repository, the 2.1.329 trust-dialog hook warning, and CODEOWNERS review for agent config paths. The incident details are vendor reports and were not reproduced here."
    affectedPages:
      - /en/articles/security-quickcheck/
      - /zh/articles/security-quickcheck/
    evidence: documentation-backed
  - type: revised
    text: "Added an after-upgrade check: Codex CLI 0.171.0 makes GPT-6.2 Sol the default catalog model, and local web search defaults to a cached index (--search or web_search = \"live\" for live results)."
    affectedPages:
      - /en/articles/codex/
      - /zh/articles/codex/
    evidence: documentation-backed
  - type: added
    text: "Four new tips, each checked against its official source on 2026-11-22: onFailure block for guard hooks, the sandbox not covering the Read tool, Codex live search, and cleanupPeriodDays for keeping sessions. The six existing tips were re-checked against their sources; none were retired."
    affectedPages:
      - /en/tips/
      - /zh/tips/
      - /en/tips/#hooks-fail-closed
      - /zh/tips/#hooks-fail-closed
      - /en/tips/#sandbox-covers-shell-only
      - /zh/tips/#sandbox-covers-shell-only
      - /en/tips/#codex-live-web-search
      - /zh/tips/#codex-live-web-search
      - /en/tips/#keep-session-transcripts
      - /zh/tips/#keep-session-transcripts
    evidence: documentation-backed
internalBriefing:
  - date: "2026-11-17"
    note: "Committed .claude/settings.json used to deliver a backdoor (GTIG report)"
  - date: "2026-11-18"
    note: "Sandbox scope; Codex cached web search"
  - date: "2026-11-19"
    note: "Malicious repositories targeting agent instruction files; cleanupPeriodDays; Gemini 4 Neon in Antigravity"
  - date: "2026-11-20"
    note: "Claude Code 2.1.329 onFailure and trust dialog; Codex CLI 0.171.0; Antigravity 2.34.0"
publicSources:
  - title: "Google Antigravity docs: Browser use"
    url: "https://antigravity.google/docs/browser/"
    kind: docs
  - title: "Google Antigravity changelog"
    url: "https://antigravity.google/docs/changelog/"
    kind: docs
  - title: "Claude Code hooks reference: block the action when a hook fails"
    url: "https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails"
    kind: docs
  - title: "Claude Code changelog"
    url: "https://code.claude.com/docs/en/changelog"
    kind: docs
  - title: "Claude Code: Configure the sandboxed Bash tool"
    url: "https://code.claude.com/docs/en/sandboxing"
    kind: docs
  - title: "Bitdefender Labs: AI agents as targets in a GitHub malware campaign"
    url: "https://www.bitdefender.com/en-us/blog/labs/how-ai-agents-become-new-targets-in-github-malware-campaign"
    kind: blog
  - title: "Google Threat Intelligence Group: agentic threat activity report"
    url: "https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold"
    kind: blog
  - title: "Codex CLI 0.171.0 release notes"
    url: "https://github.com/openai/codex/releases/tag/rust-v0.171.0"
    kind: docs
  - title: "Web search (Codex)"
    url: "https://learn.chatgpt.com/docs/web-search"
    kind: docs
  - title: "Claude Code settings reference: cleanupPeriodDays"
    url: "https://code.claude.com/docs/en/settings-reference#cleanupperioddays"
    kind: docs
---

Documentation-backed pass on the week’s briefings. Each new claim was checked against the vendor page linked above on 2026-11-22; nothing in this batch was run or measured on this site. Not included: social posts whose numbers we couldn’t trace to a primary source (token-saving percentages, small-sample agent comparisons), a gateway output-limit tip that Claude Code 2.1.330 made unnecessary, and third-party tools we haven’t vetted.
