---
title: "48-hour MVP with Claude Code, Codex, and Grok Build"
slug: 48h-mvp-agent-stack
summary: "Timeboxed two-day loop: spec → agent build → verify → public demo path using the three-tool stack."
locale: en
category: playbook
stage: cross
tools: [claude-code, codex, grok-build]
priority: P1
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code + Codex + Grok Build / xAI docs as of 2026-11; re-check CLI names before a timed run"
updated: "2026-11-07"
internalBriefing: []
publicSources:
  - title: "Claude Code overview"
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
    kind: docs
  - title: "OpenAI Codex documentation"
    url: "https://developers.openai.com/codex"
    kind: docs
  - title: "xAI documentation"
    url: "https://docs.x.ai/build/overview"
    kind: docs
  - title: "Spec Kit quickstart"
    url: "https://github.github.com/spec-kit/quickstart.html"
    kind: docs
tags: [playbook, mvp, toolchain, timebox]
---

## Conclusion

In **48 hours**, ship a thin but public MVP: written acceptance criteria, one agent-built vertical slice, a verify command that passes, and a demo URL a stranger can open. Use Claude Code / Codex for the repo loop and Grok Build (or your shipping agent) for the last-mile demo path.

## Timebox

| Block | Hours | Outcome |
|---|---|---|
| Spec & scope | 0–4 | One-pager: user, problem, non-goals, DoD |
| Vertical slice | 4–28 | Code + verify command green |
| Ship & demo | 28–40 | Public URL + CTA smoke test |
| Buffer / fix | 40–48 | One regression pass; freeze scope |

Hard rule: when the clock hits a block boundary, cut scope—do not extend the calendar.

## Prerequisites

- Access to Claude Code and/or Codex per current vendor docs
- Access to Grok Build / xAI build surface (or a documented shipping substitute)
- A blank or nearly blank repo with a single verify command (tests, lint, or smoke script)
- A place to host a static or minimal app URL

## Toolchain (who does what)

1. **Spec (research):** You write the one-pager; optionally use Spec Kit’s specify→plan→tasks pattern.
2. **Build (Claude Code / Codex):** Agent implements one vertical slice against the verify command; rules/hooks encode forbidden paths.
3. **Ship (Grok Build or equivalent):** Produce landing/demo path; keep claims honest.
4. **Human:** Diff review on auth/deps/deploy; public smoke test.

## Steps

1. **Hour 0–1:** Write the one-pager (user, problem, non-goals, definition of done). Paste nothing secret into agents.
2. **Hour 1–4:** Break DoD into ≤5 tasks. Pick **one** happy-path demo. Everything else is backlog.
3. **Hour 4–8:** Scaffold repo; add rules file + verify command; confirm agents can run verify unaided (see stack cards).
4. **Hour 8–28:** Run agent sessions **one task at a time**. After each task: verify green, commit, update the one-pager “done” list.
5. **Hour 28–36:** Wire the public path (home → CTA). Prefer static if the product allows.
6. **Hour 36–40:** Record or script a ≤90s demo path; smoke-test home, pricing/contact, and the CTA.
7. **Hour 40–48:** Fix only blockers. Freeze features. Publish the URL.

## Template fields

- One-pager link / path:
- Verify command:
- Demo URL:
- Non-goals (cut list):
- Block end times (local):

## Definition of done

A cold visitor can open the demo URL, understand the offer, and complete the primary CTA without you narrating. Verify command is green on main. Secrets never entered an agent chat.

## Anti-patterns

- Starting agents before the one-pager exists
- Expanding scope after hour 28
- Skipping human review of dependency and auth diffs
- Marketing numbers without evidence labels

## Sources

See frontmatter `publicSources`. Stack division details: [Claude Code](/en/articles/claude-code/), [Codex](/en/articles/codex/), [Grok Build](/en/articles/grok-build/). Spec-first companion: [Spec first](/en/articles/spec-first-agent-loop/).


## Worked example: make a broken content release fail

Use the [OPC Vibe Stack repository](https://github.com/SS-Bot-Org/opc-vibe-stack) as a small content-MVP demo. The runnable fixture lives in `site/tests/content.test.mjs`; it creates a temporary site, changes a quoted YAML link, runs the **full** build, and checks for a nonzero exit. It does not change your working content or publish anything.

Copy this task brief into your coding agent:

```text
Goal: reject a release containing a nonexistent changelog target.
In scope: YAML parsing, shared content contracts, final-output validation, regression tests.
Not in scope: new articles, deployment, external link crawling, changing evidence labels.
Reproduction: in a temporary copy, replace /en/playbooks/ in a published
changelog affectedPages list with the quoted string "/en/does-not-exist/".
Acceptance: full npm run build exits nonzero with "missing output";
the regression test exits zero because it EXPECTS that failure.
Safety: keep the real source untouched; no network deployment or production probes.
```

After checking out the repository, run with Node.js ≥22.23.4:

```bash
cd site
npm ci
node --test --test-name-pattern='quoted nonexistent changelog link' tests/content.test.mjs
```

Expected: the selected `FULL npm run build rejects quoted nonexistent changelog link` test passes. Its inner build fails deliberately; the test runner itself exits **0**. Run `npm run check && npm test && npm run build` for the full local gate.

Local reproduction: Node 22.23.4 on Linux, 2026-11-07. This verifies a content-release failure case only—not agent quality, revenue, browser layout, or production deployment. External sources are not crawled. The article's overall evidence label remains documentation-backed; this small locally tested example does not upgrade every recommendation to “tested”.
