---
title: "Spec first, then let the agent change code"
slug: spec-first-agent-loop
summary: "Specify outcomes and acceptance checks before any agent edits the repository—Spec Kit or a short hand-written slice."
locale: en
category: guide
stage: research
tools: [claude-code, codex, grok-build]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Any of Claude Code, Codex, or Grok Build; Spec Kit skills when installed; pair with your repo’s verify command"
updated: "2026-11-06"
internalBriefing:
  - date: "2026-11-01"
    note: "Spec Kit / specify-before-code brief"
  - date: "2026-11-03"
    note: "Spec Kit reinforcement"
  - date: "2026-11-04"
    note: "Voice→tech-spec and clear task framing"
  - date: "2026-11-05"
    note: "Boundary → stories → acceptance before code"
publicSources:
  - title: "Spec Kit quickstart (GitHub)"
    url: "https://github.github.com/spec-kit/quickstart.html"
    kind: docs
  - title: "github/spec-kit repository"
    url: "https://github.com/github/spec-kit"
    kind: docs
  - title: "Spec Kit: define the plan before the AI writes code"
    url: "https://x.com/Arindam_1729/status/2116733735613956579"
    kind: x
  - title: "Voice-dump idea → technical spec → coding agent"
    url: "https://x.com/DeepStarts/status/2117851814129451496"
    kind: x
  - title: "Clear task / outcome / done / don’t (practice tip)"
    url: "https://x.com/DDXG_99/status/2117853995985441174"
    kind: x
tags: [research, spec, workflow]
---

## Conclusion

Most agent failures are underspecified goals. Write the outcome, constraints, and verify step first; then let the agent edit. Prefer a structured specify → plan → tasks → implement loop (GitHub Spec Kit or an equivalent short slice) over a vague “make it better” prompt.

## Prerequisites

- A repository (or greenfield folder) under version control
- One command that proves “good enough for now”
- Optional: Spec Kit installed for your coding agent (`specify init` / agent skills per current Spec Kit docs)

## Steps

1. **Capture the problem** in five lines: user, pain, success signal, non-goals, deadline.
2. **Write acceptance checks** as bullets a stranger could tick (UI path, CLI output, or test names).
3. **Freeze the interface** for this slice: routes, file boundaries, or API shapes that must not drift.
4. **Prefer specify-before-code.** With Spec Kit (or the same logic by hand), run a constitution / boundary pass once per project, then specify → clarify → plan → tasks → implement → converge. Do not start implementation until acceptance criteria exist. Star counts and social hype around Spec Kit are poster-claimed—use the official quickstart, not the number.
5. **Optional: voice or chat dump first.** If the idea is half-baked, dump features, stack, and logic into a reasoning chat, then ask it to produce an unambiguous technical specification (architecture, folders, data flow, edge cases, implementation steps) before handing that document to Claude Code / Codex / Grok Build. This step is a community practice tip—treat it as **unverified** until you dogfood it.
6. **Prompt with four fields, not filler.** Prefer: what task to complete; what the finished result looks like; how to know it is done; what must never be done. Skip empty “think carefully / step by step” padding. (Community tip citing Claude Code prompt work—**unverified** as a performance claim.)
7. **Hand the agent only this slice.** Forbid drive-by refactors in the prompt/rules.
8. **Verify, then commit.** If verify fails, fix or roll back—do not stack new features.

## Template fields

```text
User:
Problem:
Success signal:
Non-goals / absolute don’ts:
Verify command:
Files in scope:
Files forbidden:
Spec artifact path (spec.md / plan.md / tasks.md or equivalent):
```

## Definition of done

You can point to a written spec (or Spec Kit artifacts) and a green verify command for the slice the agent touched.

## Anti-patterns

- “Make it better” with no acceptance checks
- Letting the agent invent architecture mid-flight without updating the spec
- Pasting half-finished ideas straight into a coding agent and debugging forever
- Treating social star counts as proof the workflow fits your OPC

## Sources

Frontmatter lists Spec Kit documentation (primary for the specify-before-code flow) plus X posts that motivated this weekly revision. Voice-dump and four-field prompt tips remain practice reports unless you reproduce them yourself.
