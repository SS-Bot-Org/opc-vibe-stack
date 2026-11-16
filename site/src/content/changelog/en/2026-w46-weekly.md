---
slug: 2026-w46-weekly
date: "2026-11-15"
title: "Week 46 — Hooks miss @ references; untrusted folders; fresh-context review"
summary: "Rules + hooks now tests secret guards through @ references, the security quickcheck covers committed local settings and untrusted folders, and the spec loop adds a read-only reviewer."
locale: en
status: published
changes:
  - type: revised
    text: "Documented that @ file references reach the prompt without a tool call, so PreToolUse hooks (including Read matchers) don't fire; added a second exercise path, the best-effort Read deny coverage, and the CLAUDE_CODE_DISABLE_FILE_MENTIONS option with its version and scope limits."
    affectedPages:
      - /en/articles/rules-hooks/
      - /zh/articles/rules-hooks/
    evidence: documentation-backed
  - type: revised
    text: "Added checks for a tracked .claude/settings.local.json (where saved approvals land) and for starting agents in untrusted folders, including what claude -p runs before trust and the flags that limit it; Codex loads project config only for trusted projects."
    affectedPages:
      - /en/articles/security-quickcheck/
      - /zh/articles/security-quickcheck/
    evidence: documentation-backed
  - type: revised
    text: "Added a failing-test-first acceptance step and a step to review the diff against the spec in a context that didn't write the code (/code-review, a read-only reviewer subagent template, Codex /review)."
    affectedPages:
      - /en/articles/spec-first-agent-loop/
      - /zh/articles/spec-first-agent-loop/
    evidence: documentation-backed
internalBriefing:
  - date: "2026-11-10"
    note: "Check whether .claude/settings.local.json is committed"
  - date: "2026-11-12"
    note: "@ file references skip PreToolUse hooks"
  - date: "2026-11-13"
    note: "Tests before code; don't start agents in ~/Downloads"
  - date: "2026-11-15"
    note: "Separate writing and reviewing contexts"
publicSources:
  - title: "Hooks reference: PreToolUse and @ references (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks"
    kind: docs
  - title: "Configure permissions: Read rules, workspace trust (Claude Code)"
    url: "https://code.claude.com/docs/en/permissions"
    kind: docs
  - title: "Settings files and scopes (Claude Code)"
    url: "https://code.claude.com/docs/en/settings"
    kind: docs
  - title: "Claude Code best practices"
    url: "https://code.claude.com/docs/en/best-practices"
    kind: docs
  - title: "Codex advanced configuration"
    url: "https://developers.openai.com/codex/config-advanced"
    kind: docs
  - title: "Codex CLI slash commands"
    url: "https://developers.openai.com/codex/cli/slash-commands"
    kind: docs
---

Documentation-backed pass on three gaps the week's briefings surfaced. Each claim was checked against the vendor docs linked above on 2026-11-15; none of the new steps were measured on this site. Social posts with unverified numbers (leaked-secret counts, review-tool benchmarks, cost-saving claims) were left out. Homepage featured tools are unchanged.
