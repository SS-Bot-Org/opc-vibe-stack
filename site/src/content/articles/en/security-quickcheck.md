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
published: "2026-11-06"
updated: "2026-11-17"
internalBriefing:
  - date: "2026-11-01"
    note: "Cursor marketplace Claude Code extension compromise report"
  - date: "2026-11-05"
    note: "Windows infostealer targeting coding-agent tokens"
  - date: "2026-11-10"
    note: "Check whether .claude/settings.local.json is committed"
  - date: "2026-11-13"
    note: "Don't start coding agents in ~/Downloads or other untrusted folders"
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
  - title: "Claude Code settings files and scopes (settings.local.json)"
    url: "https://code.claude.com/docs/en/settings"
    kind: docs
  - title: "Claude Code security: workspace trust dialog"
    url: "https://code.claude.com/docs/en/security"
    kind: docs
  - title: "Codex advanced configuration (project config only for trusted projects)"
    url: "https://developers.openai.com/codex/config-advanced"
    kind: docs
tags: [alert, security]
notice:
  text: "Incident claims below are social reports (unverified). This page is a defensive checklist—not confirmation that you were compromised, and not attack instructions."
  relatedSlugs: [rules-hooks]
---

## Conclusion

An agent’s effective access depends on its sandbox, approval mode, operating-system permissions, and connected tools. Inventory those boundaries rather than assuming either full isolation or root access. Keep secrets out of prompts, review installed extensions and MCP services, and separate routine hygiene from response to a suspected compromise.

## Start with a private inventory, not a cleanup script

For routine hygiene, record component names, publishers, versions, key fingerprints, account owners, and access scopes. **Do not copy token values, private keys, or complete environment dumps into a chat or public issue.** A first-pass checklist is not proof that a machine is clean.

On GitHub, open **Settings → Security log** and **Settings → SSH and GPG keys** using the [security-log guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-security-log) and [key-review guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-ssh-keys). Record unfamiliar events privately and compare keys with your known devices. Other providers have their own session and key controls; there is no universal “revoke everything” button.

If you suspect an active compromise, isolate the affected device and use a trusted device for account recovery. Preserve relevant logs and component identifiers before removal. Confirm key ownership and an alternate administrative access path before changing server SSH access; deleting an unfamiliar-looking key blindly can lock you out. Involve the system owner or an incident responder when scope is unclear.

**Deliverable:** one private row per surface: owner, evidence checked, result, next action. Missing `authorized_keys` is “not applicable / investigate account setup”, not proof of safety. Never mark a whole account clean just because a quick scan found nothing.

> [!WARNING] Social reports are leads, not an incident diagnosis
> The linked briefings contain unverified reports about editor-extension tampering and theft of agent session tokens. This site has not established the reported timelines or scope. Do not infer that your device is compromised from a shared product name; compare exact component identifiers and vendor advisories, then use the defensive checklist below.

## Five-surface defensive triage matrix

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="A defensive inspection map">
    <img class="theme-diagram__light" src="/illustrations/security-quickcheck/overview.light.svg" alt="" data-decorative="true" width="420" height="641" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/security-quickcheck/overview.dark.svg" alt="" data-decorative="true" width="420" height="641" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>A defensive inspection map</strong> Inspect extensions, SSH keys, agent sessions, deployment credentials, and MCP or skill code as separate exposure surfaces. This diagram summarizes defensive checks; it does not verify the incident reports above.</figcaption>
</figure>

| Attack / exposure surface | What goes wrong | 5-minute check | Defensive response if suspicious |
|---|---|---|---|
| **Editor extensions** | Typosquatted or tampered update runs arbitrary local code | List installed extensions + recent update dates; verify exact publisher ID | Isolate if actively compromised; preserve component IDs/logs, disable suspect code, and assess exposed credentials |
| **SSH `authorized_keys`** | Silent persistent backdoor logins to workstation or VPS | Read `~/.ssh/authorized_keys` on laptop and servers line by line | Confirm ownership and recovery access; revoke unauthorized keys and review host logs |
| **Agent CLI & chat tokens** | Stealer grabs cached OAuth/session tokens; password reset alone fails | Check active sessions in Anthropic / OpenAI / xAI / GitHub dashboards | Sign out all sessions, revoke API keys, re-authenticate on a clean OS |
| **Deploy & cloud keys** | Agent session accidentally reads or mutates production infra | Check shell env + `.env*` exposure in working directories | Scope deploy user to `/srv/<app>` only; never run agents as `root` |
| **MCP servers & skills** | Untrusted server/script injects prompts or exfiltrates local files | Audit `.mcp.json`, `~/.codex/config.toml`, and `.claude/skills/` | Keep only audited servers; pass scoped tokens via env vars only |

> [!FLOW] Credential containment order (if you suspect exposure)
> 1. **Isolate & sign out** — Isolate the affected device, preserve relevant evidence, and use a trusted device for recovery.
> 2. **Revoke tokens** — Revoke API keys, OAuth grants, Git PATs, and VPS deploy keys from vendor consoles.
> 3. **Verify persistence** — Audit `~/.ssh/authorized_keys`, shell startup files, and cron/launch agents cleanly.
> 4. **Re-issue scoped keys** — Mint fresh least-privilege credentials from a trusted machine and log the date.

## Steps

1. **Audit editor extensions installed or auto-updated in the last 14 days.** Disable and investigate unrecognized components; confirm provenance before removal, verify publisher identities directly in the official marketplace, and never install extensions from shortened social links.
2. **Inspect `~/.ssh/authorized_keys` (and VPS deploy accounts).** Confirm each key’s fingerprint and owner against your inventory; a missing comment is not proof that a key is malicious.
3. **Rotate session tokens—not just passwords—when token theft is suspected.** Infostealers target live session cookies and CLI tokens stored on disk; revoking active sessions and API keys in each vendor dashboard is required to cut off stolen tokens. Do **not** run untrusted “scanner” scripts from social threads.
4. **Separate Git hygiene from access control.** `.gitignore` prevents accidental addition of untracked files; it does not block reads or remove committed history. Keep real secrets outside agent access and test the intended permissions/sandbox ([Rules files + hooks](/en/articles/rules-hooks/)), and verify static builds never inline server secrets into client bundles (see Astro’s environment-variable rules).
5. **Scope deployment identities tightly.** Limit the deploy identity to the release paths and the reviewed activation/rollback operation it actually needs. Writing `releases/` alone does not authorize switching `current`; avoid broad administrative access just to make the deploy succeed.
6. **Keep verify commands local and offline-safe.** Prefer deterministic local test/build scripts (`npm test`, `npm run build`) over commands that `curl` external scripts.
7. **Vet every MCP server and `SKILL.md` folder before enabling.** Per Anthropic’s MCP security guidance, MCP servers that fetch arbitrary external content can expose your agent session to indirect prompt injection.
8. **Check that personal agent settings are not committed.** Run `git ls-files .claude .codex` in each repository. Official fact ([permissions](https://code.claude.com/docs/en/permissions), [settings](https://code.claude.com/docs/en/settings)): when you choose “Yes, and don't ask again” for a Bash command or WebFetch domain, Claude Code saves that rule to `.claude/settings.local.json`; Claude Code keeps that file out of git when it creates it, but a hand-made file needs its own `.gitignore` entry. Editorial inference: a saved rule holds the command text you approved, so if that text contained a key, treat the key as exposed once the file is tracked or pushed. Revoke it first, then `git rm --cached .claude/settings.local.json` and add the ignore line; history still contains the old file.
9. **Start agents only in folders you mean to trust—not `~/Downloads` or your home directory.** Official fact ([security](https://code.claude.com/docs/en/security), [permissions](https://code.claude.com/docs/en/permissions#what-runs-before-you-trust-a-folder)): interactive Claude Code shows a workspace trust dialog for an untrusted folder, but `claude -p` and SDK runs show none. In those non-interactive runs, repository settings-file hooks, the `env` block, and helpers such as `apiKeyHelper` can be used even when the folder was never trusted.
   - **Exclude repository configuration before an unfamiliar run:** pass `--setting-sources user` to exclude project/local settings and the repository's `.mcp.json`. For the SDK, select `settingSources` without project settings. This excludes configuration; it is not a sandbox or a guarantee that untrusted code is safe to execute.
   - **Treat the other controls as narrower options, not substitutes:** `--bare` skips project hooks, skills, custom commands, subagents, plugins, and `.mcp.json` servers, but the project's `env` block and helpers such as `awsAuthRefresh` still apply; in bare mode, `apiKeyHelper` is read only from `--settings`. `--settings '{"disableAllHooks": true}'` disables hooks only: it does not exclude project environment settings, helper commands, or `.mcp.json` servers. Neither option alone provides the same repository-configuration exclusion as `--setting-sources user`.
   - **Review the remaining inputs:** Codex [loads project-scoped config only for trusted projects](https://developers.openai.com/codex/config-advanced). With either tool, read the repository's `AGENTS.md`, `CLAUDE.md`, `.mcp.json`, hooks, and `.codex/` before trusting it; instruction files can still steer the model even where configuration is skipped.

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

# Personal agent settings (saved approvals may contain command text)
.claude/settings.local.json
```

### Private 15-minute security audit log (keep outside public repo)

```text
Audit date: YYYY-MM-DD
OS / workstation:
Editor extensions checked (publisher verified, unused removed):
~/.ssh/authorized_keys checked (workstation + VPS):
Agent CLI & API keys rotated on:
Active MCP servers & SKILL.md packs reviewed:
`git ls-files .claude .codex` result per repo:
Deploy key scope verified (non-root, path-restricted):
```

## 15-minute defensive checklist

- [ ] Every installed editor extension matches a known publisher you intentionally chose
- [ ] `~/.ssh/authorized_keys` on both local machine and VPS contains zero unrecognized public keys
- [ ] Recorded the scope and result of secret scanning; revoked any exposed credential before addressing tracked files/history
- [ ] Agent CLIs and MCP configs reference environment variables rather than plaintext tokens in repo files
- [ ] `.claude/settings.local.json` is untracked in every repo, and no agent was started in `~/Downloads` or another folder you didn't intend to trust
- [ ] Production VPS deploy credentials are non-root and scoped strictly to the release directory
- [ ] Recorded the revocation controls and responsible owner for sessions, OAuth grants, API keys, and deployment credentials at each provider you use

## Anti-patterns

- **One-click installing extensions or MCP servers from viral X threads** — typosquatted names target fast-moving AI tool brands first.
- **Changing a password while leaving existing API keys and OAuth sessions active** — stolen session tokens keep working until explicitly revoked.
- **Putting cloud admin keys in the project folder “so the agent can deploy”** — stage builds locally and deploy through a narrow, checksummed script instead.
- **Treating social-media malware threads as verified forensics (or running pasted exploit PoCs)** — stick to vendor advisories and clean defensive rotation.
