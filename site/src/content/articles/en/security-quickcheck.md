---
title: "Security quickcheck for agentic coding"
slug: security-quickcheck
summary: "Hard no-gos for extensions, SSH keys, and agent tokens—treat marketplace and malware reports as unverified until you assess originals."
locale: en
category: alert
stage: cross
tools: [claude-code, codex, grok-build]
priority: P0
status: published
evidence: unverified
applicableToolsVersions: "Any local agent CLI and editor extension marketplace; re-check after tool updates"
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
  text: "Incident claims below are social reports (unverified). This page is a defensive checklist—not confirmation that you were compromised, and not attack instructions."
  relatedSlugs: []
---

## Conclusion

Treat agent tooling like production access: least privilege, no secrets in prompts, and verify what extensions, SSH keys, and session tokens exist on the machine. **Alert:** recent X reports describe (1) a tampered Claude Code–branded extension in Cursor’s marketplace (poster-claimed ~11 hours on or around 2026-10-29, possible SSH key persistence) and (2) Windows infostealers targeting coding-agent and chat tokens. Those claims are **unverified** here—open the linked posts (and any vendor notices you can find) yourself before acting as if the details are settled.

## Prerequisites

- Access to your editor’s extension list and `~/.ssh/authorized_keys` (or OS equivalent)
- Ability to rotate tokens / sign out of agent CLIs and related desktop apps
- Willingness to treat marketplace installs and MCP servers as code you run

## Steps

1. **Inventory extensions** installed or updated in the last two weeks; remove anything you did not intentionally add. Prefer pinned versions and known publishers over social “install this” links.
2. **Check SSH authorized keys** for unknown public keys; remove strangers. If anything looks wrong, rotate keys and review recent login activity. (Suggested after the marketplace-compromise report—still **unverified** as to whether your machine was affected.)
3. **Assume password change alone may be insufficient** if a stealer took session tokens or API keys. Sign out of agent CLIs and related apps, revoke API keys, and rotate deploy credentials. Do **not** follow malware analysis or exploit steps from social posts—defensive rotation only.
4. **Keep secrets out of chat.** Use env files that are gitignored; never paste tokens into prompts.
5. **Scope deploy credentials** to the site path only; do not run casual agent sessions as root.
6. **Prefer verify commands** that cannot exfiltrate secrets (local tests over “curl this weird URL”).
7. **MCP and skills:** only connect servers and install skill packs you trust; servers that fetch outside content can introduce prompt-injection risk (see Claude Code MCP docs).

## Template fields

```text
Extensions reviewed on:
Unknown SSH keys found?:
Agent CLI / API token rotation date:
Desktop app sign-out completed?:
Deploy identity scope:
MCP servers reviewed:
```

## Definition of done

You can state when you last reviewed extensions and SSH keys, you rotated agent credentials after any credible token-theft report that applies to your OS, and your agent sessions cannot read production secrets by default.

## Anti-patterns

- Installing marketplace extensions from social links without checking the publisher
- Storing cloud keys in the repo “just for the agent”
- Treating an X thread as a completed forensic report
- Publishing or requesting exploit / persistence reproduction steps

## Sources

Incident items cite the briefing-linked X posts only (opened for this revision). Official Astro env-var and Claude Code docs support general secret hygiene. Upgrade any claim to `documentation-backed` only after a vendor advisory or primary notice is assessed.
