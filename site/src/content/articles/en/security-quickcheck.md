---
title: "Security quickcheck for agentic coding"
slug: security-quickcheck
summary: "15-minute defensive audit for editor extensions, SSH keys, agent tokens, and MCP servers—with unverified incident context."
locale: en
category: alert
stage: cross
tools: [claude-code, codex, grok-build]
priority: P0
status: published
evidence: unverified
applicableToolsVersions: "All local coding-agent CLIs, desktop chat apps, MCP servers, and editor extension marketplaces; re-audit after updates"
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
  text: "Incident claims below are social reports (unverified). This page is a defensive checklist—not confirmation that you were compromised, and not attack instructions."
  relatedSlugs: [rules-hooks]
---

## Conclusion

A coding agent runs with your local user’s shell, filesystem, and network privileges—treat its extensions, MCP servers, and session tokens like **production root equivalents**. Keep secrets out of prompts, audit what runs inside your editor, and know how to rotate credentials fast when ecosystem alerts surface.

> [!WARNING] Unverified incident reports (defensive context only)
> Recent briefing-linked X posts report two risks worth defensive hygiene checks:
> 1. A tampered **Claude Code–branded extension** in Cursor’s marketplace (poster-claimed live window of ~11 hours around `2026-10-29`, alleging possible SSH `authorized_keys` persistence).
> 2. **Windows infostealer campaigns** targeting local coding-agent and AI chat session tokens alongside browser credentials.
>
> Both incident claims remain **unverified** on this site—open the linked posts and check official vendor advisories yourself before treating specific timelines or indicators as established fact.

## Five-surface defensive triage matrix

| Attack / exposure surface | What goes wrong | 5-minute check | Defensive response if suspicious |
|---|---|---|---|
| **Editor extensions** | Typosquatted or tampered update runs arbitrary local code | List installed extensions + recent update dates; verify exact publisher ID | Uninstall immediately, inspect `~/.ssh/authorized_keys`, rotate tokens |
| **SSH `authorized_keys`** | Silent persistent backdoor logins to workstation or VPS | Read `~/.ssh/authorized_keys` on laptop and servers line by line | Delete unknown keys, rotate SSH keypairs, review host auth logs |
| **Agent CLI & chat tokens** | Stealer grabs cached OAuth/session tokens; password reset alone fails | Check active sessions in Anthropic / OpenAI / xAI / GitHub dashboards | Sign out all sessions, revoke API keys, re-authenticate on a clean OS |
| **Deploy & cloud keys** | Agent session accidentally reads or mutates production infra | Check shell env + `.env*` exposure in working directories | Scope deploy user to `/srv/<app>` only; never run agents as `root` |
| **MCP servers & skills** | Untrusted server/script injects prompts or exfiltrates local files | Audit `.mcp.json`, `~/.codex/config.toml`, and `.claude/skills/` | Keep only audited servers; pass scoped tokens via env vars only |

> [!FLOW] Credential containment order (if you suspect exposure)
> 1. **Isolate & sign out** — Remove the suspect extension/package and sign out of active CLI & desktop sessions.
> 2. **Revoke tokens** — Revoke API keys, OAuth grants, Git PATs, and VPS deploy keys from vendor consoles.
> 3. **Verify persistence** — Audit `~/.ssh/authorized_keys`, shell startup files, and cron/launch agents cleanly.
> 4. **Re-issue scoped keys** — Mint fresh least-privilege credentials from a trusted machine and log the date.

## Steps

1. **Audit editor extensions installed or auto-updated in the last 14 days.** Remove anything you do not recognize, verify publisher identities directly in the official marketplace, and never install extensions from shortened social links.
2. **Inspect `~/.ssh/authorized_keys` (and VPS deploy accounts).** Every public key on disk should have a comment and owner you recognize immediately.
3. **Rotate session tokens—not just passwords—when token theft is suspected.** Infostealers target live session cookies and CLI tokens stored on disk; revoking active sessions and API keys in each vendor dashboard is required to cut off stolen tokens. Do **not** run untrusted “scanner” scripts from social threads.
4. **Enforce a hard `.env` wall.** Keep secrets in gitignored `.env` files or your OS keychain, block `.env*` reads via hooks ([Rules files + hooks](/en/articles/rules-hooks/)), and verify static builds never inline server secrets into client bundles (see Astro’s environment-variable rules).
5. **Scope deployment identities tightly.** Your VPS deploy key should write only to `/srv/<site>/releases/`—never grant passwordless `root` to a workstation shell where coding agents run casually.
6. **Keep verify commands local and offline-safe.** Prefer deterministic local test/build scripts (`npm test`, `npm run build`) over commands that `curl` external scripts.
7. **Vet every MCP server and `SKILL.md` folder before enabling.** Per Anthropic’s MCP security guidance, MCP servers that fetch arbitrary external content can expose your agent session to indirect prompt injection.

## Copy-pasteable hygiene baselines

### Repository `.gitignore` secret baseline

```text
# Local secrets & environment overrides (never commit)
.env
.env.*
!.env.example

# Local private keys, archives & deployment records
*.pem
*.key
ops/records/
dist/
```

### Private 15-minute security audit log (keep outside public repo)

```text
Audit date: YYYY-MM-DD
OS / workstation:
Editor extensions checked (publisher verified, unused removed):
~/.ssh/authorized_keys checked (workstation + VPS):
Agent CLI & API keys rotated on:
Active MCP servers & SKILL.md packs reviewed:
Deploy key scope verified (non-root, path-restricted):
```

## 15-minute defensive checklist

- [ ] Every installed editor extension matches a known publisher you intentionally chose
- [ ] `~/.ssh/authorized_keys` on both local machine and VPS contains zero unrecognized public keys
- [ ] Zero API keys, `.env` contents, or SSH private keys appear in Git history (`git status` / `.gitignore` verified)
- [ ] Agent CLIs and MCP configs reference environment variables rather than plaintext tokens in repo files
- [ ] Production VPS deploy credentials are non-root and scoped strictly to the release directory
- [ ] You know where to revoke active OAuth sessions and API keys for Claude, OpenAI, xAI, GitHub, and Cloudflare

## Anti-patterns

- **One-click installing extensions or MCP servers from viral X threads** — typosquatted names target fast-moving AI tool brands first.
- **Changing a password while leaving existing API keys and OAuth sessions active** — stolen session tokens keep working until explicitly revoked.
- **Putting cloud admin keys in the project folder “so the agent can deploy”** — stage builds locally and deploy through a narrow, checksummed script instead.
- **Treating social-media malware threads as verified forensics (or running pasted exploit PoCs)** — stick to vendor advisories and clean defensive rotation.
