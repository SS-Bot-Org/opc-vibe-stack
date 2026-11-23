---
title: The Claude Code sandbox doesn't cover the Read tool
slug: sandbox-covers-shell-only
summary: The sandbox wraps shell commands only. Block file-tool reads with a Read deny rule; a sandbox denyRead entry doesn't stop the Read tool.
locale: en
tools:
  - claude-code
appliesTo: Claude Code built-in sandbox (sandboxed Bash tool) and permission rules, as documented on 2026-11-22.
tags:
  - sandbox
  - permissions
  - security
evidence: documentation-backed
wording: '"permissions": { "deny": ["Read(./.env)", "Read(./secrets/**)"] }'
wordingLang: text
effect: "Official sandboxing docs say the sandbox wraps the shell commands Claude runs and the processes they start. Read, Edit, Write, WebFetch, and WebSearch follow permission rules instead: a sandbox denyRead entry doesn't stop the Read tool, and allowedDomains doesn't limit WebFetch. A Read deny rule in settings is what blocks Claude's file tools from reading a path."
limits: "Command hooks, local MCP servers, the status line command, and apiKeyHelper run outside the sandbox with your full access. By default, sandboxed commands can still read most of the machine, including ~/.ssh and ~/.aws/credentials, unless you add denyRead or credentials entries. The sandbox is off by default (/sandbox or sandbox.enabled turns it on). Read deny rules apply to the file tools, not to every subprocess. This site has not re-tested these boundaries."
officialSource: &a1
  title: "Claude Code docs: Configure the sandboxed Bash tool (what runs outside the sandbox)"
  url: https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox
  kind: docs
discoverySource: &a2
  title: leocx66, 2026-11-18
  url: https://x.com/leocx66/status/2122879897559302525
  kind: x
dateAdded: "2026-11-22"
lastVerified: "2026-11-22"
status: active
internalBriefing:
  - date: "2026-11-18"
    note: "Vibe Coding briefing tip: Claude Code sandbox covers shell commands only"
publicSources:
  - *a1
  - title: "Claude Code docs: Configure permissions (Read deny rules)"
    url: https://code.claude.com/docs/en/permissions
    kind: docs
  - *a2
---
