---
title: "48-hour MVP with Claude Code, Codex, and Grok Build"
slug: 48h-mvp-agent-stack
summary: "Timeboxed two-day loop: spec, agent vertical slice, verify gate, and public demo URL across the three-tool stack."
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

In **48 hours**, ship one thin, stranger-testable MVP: written acceptance criteria, one agent-built vertical slice, a deterministic verify command that exits `0`, and a public demo URL a cold visitor can use without your narration. Keep repository work inside [Claude Code](/en/articles/claude-code/) or [Codex](/en/articles/codex/), use [Grok Build](/en/articles/grok-build/) (or your documented shipping surface) for the last-mile demo path, and enforce hard scope cuts whenever the wall clock hits a block boundary.

> [!FLOW] 48-hour three-tool MVP pipeline
>
> 1. **Hours 0–4: Spec & Freeze** — Write a one-pager with user pain, non-goals, and ≤5 tasks before opening any agent.
> 2. **Hours 4–28: Vertical Slice** — Build one task at a time in Claude Code or Codex behind a single verify command.
> 3. **Hours 28–40: Public Demo Path** — Wire landing copy, honest proof, and primary CTA; smoke-test on desktop and mobile.
> 4. **Hours 40–48: Buffer & Freeze** — Fix blockers only, audit auth/dependency diffs, and publish the live URL.

## Timebox and scope-cut gates

| Block | Hours | Primary owner | Required exit artifact | Scope-cut trigger at boundary |
|---|---|---|---|---|
| **1. Spec & scope** | `0–4` | Human ([Spec first](/en/articles/spec-first-agent-loop/)) | `mvp-48h.md` with DoD + ≤5 tasks | Drop secondary personas, settings pages, and admin dashboards |
| **2. Vertical slice** | `4–28` | [Claude Code](/en/articles/claude-code/) / [Codex](/en/articles/codex/) | Core happy path committed; verify command exits `0` | Replace unfinished background jobs or integrations with static fixtures or manual fulfillment |
| **3. Ship & demo** | `28–40` | [Grok Build](/en/articles/grok-build/) + Human | Live URL + ≤90s repeatable demo path ([Ship checklist](/en/articles/ship-demo-checklist/)) | Collapse multi-page funnels into one static landing section + direct CTA |
| **4. Buffer & fix** | `40–48` | Human reviewer | Regression pass + human diff review ([Security quickcheck](/en/articles/security-quickcheck/)) | Zero new features; revert any unverified late change |

> [!IMPORTANT] Hard clock rule
> When the clock reaches a block boundary, **cut scope—never extend the calendar**. A working single-action product at hour 48 beats an ambitious half-wired architecture next month.

## Prerequisites

- Working access to [Claude Code](/en/articles/claude-code/) and/or [Codex](/en/articles/codex/) verified against current vendor docs
- Access to [Grok Build](/en/articles/grok-build/) / xAI build tooling (or an equivalent documented deployment workflow)
- A clean repository initialized with Git, project guardrails ([Rules files + hooks](/en/articles/rules-hooks/)), and **one** deterministic verify command (`npm test`, `npm run build`, or a smoke script)
- A static host or minimal runtime environment ready to serve a public HTTPS URL

## Toolchain handoff (who owns what)

1. **Spec & boundaries (Human):** Author `mvp-48h.md`—optionally structured with Spec Kit’s `specify → plan → tasks` sequence—and list explicit forbidden paths before code exists.
2. **Repository slice ([Claude Code](/en/articles/claude-code/) / [Codex](/en/articles/codex/)):** Implement one task per session, run the verify command locally or in cloud tasks, and keep diffs small enough for a 5-minute human review.
3. **Last-mile demo surface ([Grok Build](/en/articles/grok-build/) or shipping equivalent):** Draft landing copy, demo walkthrough structure, and launch assets while preserving honest evidence qualifiers.
4. **Release authority (Human):** Review every auth, billing, dependency, and deployment diff; run cold-visitor smoke checks; hold all production secrets outside agent chats.

## Hour-by-hour execution steps

1. **Hours 0–1 (Write the one-pager):** Fill out `mvp-48h.md` with target user, single painful job, observable success signal, and hard cut list. Never paste API keys or `.env` values into prompts.
2. **Hours 1–4 (Decompose into ≤5 tasks):** Select **one** happy-path user journey. Push OAuth providers, dark-mode toggles, analytics pipelines, and secondary roles into a post-MVP backlog.
3. **Hours 4–8 (Scaffold + wire the gate):** Create the minimal repo skeleton, commit `CLAUDE.md` / `AGENTS.md`, and verify that an agent can run your single check command end-to-end without manual babysitting.
4. **Hours 8–28 (Execute one task per session):** Hand one scoped task at a time to Claude Code or Codex. Require a green verify run and `git commit` before starting the next task.
5. **Hours 28–36 (Connect the public path):** Expose `Home → Value proof → Primary CTA` on a real URL. Prefer static output or zero-login previews whenever the product allows.
6. **Hours 36–40 (Script the 90-second demo):** Walk the live URL in a fresh private window on desktop and mobile using the [Ship / demo checklist](/en/articles/ship-demo-checklist/).
7. **Hours 40–48 (Freeze & harden):** Fix broken links, unclear copy, or failing smoke checks only. Run a final [Security quickcheck](/en/articles/security-quickcheck/) over dependencies and secrets before sharing the link.

## Copy-pasteable 48-hour run sheet (`mvp-48h.md`)

Drop this file into your repository root before starting the timer:

```markdown
# 48h MVP Run Sheet: [Project Name]

- **Start / deadline (local time):** [YYYY-MM-DD HH:MM] → [YYYY-MM-DD HH:MM]
- **Target user & single pain:**
- **Primary happy-path outcome:**
- **Verify command:**
- **Public demo URL:**

## Hard non-goals (cut immediately if tempted)
- No multi-tenant teams, custom roles, or billing portals in v0
- No unrequested UI redesigns or extra dependencies
- [Project-specific cut item]

## Scoped build tasks (max 5)
- [ ] T1 (Hours 4–8): Repo scaffold + rules file + green verify command
- [ ] T2 (Hours 8–14): [Core input / data contract]
- [ ] T3 (Hours 14–22): [Core processing / vertical slice behavior]
- [ ] T4 (Hours 22–28): [Error state + edge-case regression test]
- [ ] T5 (Hours 28–40): [Public landing + primary CTA smoke test]

## Block cutoff timestamps
- **Block 1 freeze (Hour 4):**
- **Block 2 code cut (Hour 28):**
- **Block 3 demo ready (Hour 40):**
- **Block 4 ship / stop (Hour 48):**

---
# Filled mini-example: Broken-link release gate demo
- **Target user & single pain:** Solo maintainer shipping bilingual Markdown guides without catching dead changelog URLs.
- **Primary happy-path outcome:** `npm run build` fails deterministically whenever a published changelog cites a missing route.
- **Verify command:** `cd site && npm run check && npm test && npm run build`
- **Public demo URL:** `https://opc.example.com/en/changelog/`
```

## Worked example: make a broken content release fail

Use the [OPC Vibe Stack repository](https://github.com/SS-Bot-Org/opc-vibe-stack) as a concrete content-MVP slice. The runnable fixture lives in `site/tests/content.test.mjs`: it copies the site into a temporary directory, injects a broken quoted YAML route into a published changelog, runs the **full** build, and asserts a nonzero exit without touching your working tree or publishing anything.

Copy this bounded task brief into your coding agent:

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

Expected result: the selected `FULL npm run build rejects quoted nonexistent changelog link` test passes. Its inner build fails deliberately with `missing output`, while the outer test runner exits **0**. Run `npm run check && npm test && npm run build` for the full local gate.

> [!NOTE] Scope of local verification
> Local reproduction recorded on Node 22.23.4 (Linux, 2026-11-07). This fixture verifies a deterministic content-release failure gate only—not agent reasoning quality, revenue outcomes, visual browser layout, or live VPS deployment. External URLs are not crawled. The playbook’s overall `evidence` remains `documentation-backed`; one locally tested regression fixture does not upgrade every workflow recommendation on this page to `tested`.

## Definition of done

- [ ] A cold visitor can open the public demo URL, grasp the offer in one screen, and complete the primary CTA without live narration
- [ ] Your repository verify command exits `0` on `main`
- [ ] Every auth, dependency, and deployment diff was inspected line-by-line by a human
- [ ] Zero production credentials, `.env` files, or private keys ever entered an agent prompt
- [ ] Scope was frozen at Hour 40 with non-essential ideas parked in backlog

## Anti-patterns

- **Opening coding agents at Hour 0 before `mvp-48h.md` exists** — burns your freshest hours building conflicting scaffolding you have to delete by Hour 12.
- **Adding “one quick feature” after Hour 28** — starves deployment, mobile smoke testing, and copy clarity right before launch.
- **Rubber-stamping agent-added packages or auth middleware** — introduces supply-chain and security liabilities in the exact code paths an MVP cannot afford to get wrong.
- **Padding landing copy with invented metrics or unverified social claims** — destroys solo-founder trust faster than shipping a tiny v0.1 ever will.
