---
title: "Weekly content-site refresh loop"
slug: weekly-content-site-refresh
summary: "A 90–120 minute Sunday loop: filter briefings, update executable guides, validate schemas, log changes, and deploy atomically."
locale: en
category: playbook
stage: cross
tools: [claude-code, codex]
priority: P1
status: published
evidence: documentation-backed
applicableToolsVersions: "Astro static site + Markdown collections; agent CLI of choice; editorial gate per site SDD"
updated: "2026-11-07"
internalBriefing: []
publicSources:
  - title: "Astro content collections"
    url: "https://docs.astro.build/en/guides/content-collections/"
    kind: docs
  - title: "Claude Code overview"
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
    kind: docs
  - title: "OpenAI Codex documentation"
    url: "https://developers.openai.com/codex"
    kind: docs
tags: [playbook, ops, changelog, timebox, content]
---

## Conclusion

Keep an engineering practice site useful without turning weekends into a content treadmill. Run a **timeboxed 90–120 minute Sunday loop**: filter incoming notes down to actionable workflow changes, open and verify every primary source, update existing Markdown guides before creating new ones, write a structured [Changelog](/en/changelog/) with verified `affectedPages`, pass full build validation, and flip an atomic release symlink. If nothing survives the filter, stop early and publish nothing.

> [!FLOW] 90–120 minute Sunday refresh pipeline
>
> 1. **Filter (15–25m)** — Keep only items that change a real checklist, tool boundary, or risk warning; drop pure news.
> 2. **Verify & Rewrite (40–60m)** — Open primary URLs, revise executable steps, and set conservative `evidence` labels.
> 3. **Changelog & Gate (15–25m)** — Log `affectedPages` in `YYYY-wNN.md` and run `npm run validate && npm run build`.
> 4. **Atomic Flip & Smoke (10–15m)** — Stage `releases/<id>/`, switch the `current` symlink, probe live URLs, and log privately.

## Timebox and stop gates

| Phase | Minutes | Owner | Pass / stop gate |
|---|---|---|---|
| **1. Filter & map** | `15–25` | Human editor | At least one concrete action change survives; otherwise stop and record “no update” |
| **2. Verify & rewrite** | `30–45` | Human + [Claude Code](/en/articles/claude-code/) / [Codex](/en/articles/codex/) | Every cited URL opened by a human; executable sections updated across locales |
| **3. Evidence & notices** | `10–15` | Human editor | Accurate `tested` / `documentation-backed` / `unverified` badge + caveats |
| **4. Changelog** | `10–15` | Agent + Human | Non-empty `changes[]` where every `affectedPages` route exists in `dist/` |
| **5. Validate & deploy** | `15–25` | CI / release script | `npm run build` exits `0`; atomic symlink switch + HTTP smoke probes pass |
| **6. Private record** | `5` | Human editor | Private release log saved outside `dist/` with rollback target noted |

> [!TIP] Empty weeks are a feature, not a failure
> If a week’s digest is 100% funding announcements, model leaderboard drama, or unverified hype, **stop after Phase 1**. Record a 3-line private “no update” note instead of bumping `updated` dates on unchanged guides.

## Briefing filter decision matrix

Treat incoming digests, bookmarks, and X threads as untrusted leads until verified against primary documentation:

| Incoming signal | Decision | Target action | Max `evidence` label |
|---|---|---|---|
| Official CLI / SDK flag, hook, or permission change | **Keep** | Update affected stack card or [Rules files + hooks](/en/articles/rules-hooks/) | `documentation-backed` (or `tested` if reproduced locally) |
| Active supply-chain, key-leak, or malicious skill advisory | **Keep (urgent)** | Add defensive check to [Security quickcheck](/en/articles/security-quickcheck/) + `alert` changelog item | `documentation-backed` |
| Repeatable practitioner workflow on X with concrete steps | **Keep with qualifier** | Fold into existing guide; mark social metrics as *poster-claimed, unverified* | `unverified` (unless backed by primary vendor docs) |
| Model benchmark hype, pricing rumor, or hot take | **Drop** | Do not create news stubs | — |
| Citation link you have not personally opened | **Hold / Drop** | Leave in `status: draft` or omit completely | — |

## Prerequisites

- A static Markdown/MDX repository with strict schema + output checks (this site uses Astro content collections plus `scripts/validate-output.mjs`)
- Weekly raw notes or briefing files kept separate from published content
- An atomic release layout (`/srv/<site>/releases/<id>` + symlink `/srv/<site>/current`) so you never `rsync --delete` directly into a live web root
- Scoped SSH or CI deploy credentials that coding agents cannot read or invoke autonomously

## Step-by-step Sunday workflow

1. **Filter ruthlessly:** Scan the week’s raw notes and keep only items that alter what a solo builder should **do**, **check**, or **avoid** Monday morning.
2. **Map to existing slugs first:** Prefer tightening an existing guide or stack card over spawning thin, overlapping articles. Keep `en` and `zh` slugs matched.
3. **Open every public source yourself:** Confirm the URL resolves and actually supports the claim. Never let an agent guess or synthesize an X status URL.
4. **Update executable structure:** Keep `Conclusion → Prerequisites → Steps → Copy-pasteable templates → Definition of done → Anti-patterns` scannable.
5. **Assign the most conservative accurate `evidence` label:** Use `tested` only when `verification` records your own date, environment, and outcome; split mixed-assurance notes into explicit callouts.
6. **Write the weekly changelog (`YYYY-wNN.md`):** List every substantive `added`, `revised`, `deprecated`, or `alert` item with exact `affectedPages` paths (for example, `/en/articles/codex/`).
7. **Run the local build gate:** Execute `cd site && npm run check && npm test && npm run build` until schema checks, internal link checks, and changelog target checks all exit `0`.
8. **Stage and flip atomically:** Upload `dist/` to a fresh `releases/<id>/` directory, verify file permissions, flip the `current` symlink atomically, and keep at least the previous release ready for one-command rollback.
9. **Smoke-test and log privately:** Probe key routes and write a brief release record outside `dist/`.

## Copy-pasteable templates

### 1. Weekly changelog entry (`site/src/content/changelog/en/YYYY-wNN.md`)

```yaml
---
slug: 2026-w46
date: "2026-11-14"
title: "Week 46: Tighten Codex sandbox flags and weekly smoke checks"
summary: "Updated Codex sandbox verification steps and added cache-header probes to the Sunday release checklist."
locale: en
status: published
changes:
  - type: revised
    text: "Clarified read-only vs workspace-write approval boundaries before running unattended tasks."
    affectedPages:
      - "/en/articles/codex/"
      - "/zh/articles/codex/"
    evidence: documentation-backed
internalBriefing:
  - date: "2026-11-12"
    note: "Weekly CLI docs audit"
publicSources:
  - title: "OpenAI Codex documentation"
    url: "https://developers.openai.com/codex"
    kind: docs
---

Focused maintenance pass on sandbox boundaries; zero new tools added to the core three-tool stack.
```

### 2. Private release / no-update log (`ops/releases/YYYY-wNN.md`, outside `dist/`)

```markdown
# Weekly Refresh Record — [YYYY-wNN]

- **Date & elapsed minutes:** 2026-11-14 (85 min)
- **Briefing range reviewed:** 2026-11-08 .. 2026-11-14
- **Keepers vs dropped count:** 2 kept / 9 dropped (pure launch noise)
- **Outcome:** [Published release | No-update week]
- **Changed article slugs:** `codex` (en, zh)
- **Changelog slug:** `2026-w46`
- **Release directory & previous symlink target:** `releases/20261114-1830` (prev: `releases/20261107-1715`)
- **Smoke check status:** `/` 302→`/en/`, `/en/` 200, `/en/articles/codex/` 200, `/en/changelog/` 200, `/missing-probe` 404
```

## Definition of done

- [ ] Either a substantive `YYYY-wNN` changelog is published with verified `affectedPages`, **or** a private “no update” record explains why the week was skipped
- [ ] Every `publicSources` URL added this week was opened in a browser by a human
- [ ] `cd site && npm run check && npm test && npm run build` exits `0` with zero broken links or orphan `affectedPages`
- [ ] Live smoke checks pass on `/`, `/en/`, `/en/stack/`, at least one changed article, `/en/changelog/`, a hashed `/_astro/*` asset, and a deliberate `404` URL
- [ ] Previous `releases/<prev-id>` directory remains intact on disk for instant symlink rollback

## Anti-patterns

- **Publishing unread links copied from an aggregator thread** — propagates hallucinated URLs or misrepresented vendor docs straight into your reference manual.
- **Bumping `updated` timestamps for typo fixes or CSS tweaks** — trains readers to ignore freshness dates and pollutes the changelog.
- **Changing operational advice silently without a changelog entry** — leaves returning readers unaware that a recommended flag or boundary shifted.
- **Deploying via in-place `rsync` onto the live web root** — risks serving half-uploaded HTML/CSS mismatches if the connection drops mid-transfer.
