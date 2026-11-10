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
updated: "2026-11-10"
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

## First practice: one change, local preview only

Choose one existing article and one source that changes a concrete instruction. Keep a private note containing the source URL, what changed, and the exact paragraph you will revise. If the source is inaccessible or does not support the change, stop that item.

1. Make the smallest correction in both available translations. Change `updated` only for substantive guidance, not formatting.
2. Copy the changelog skeleton below as **draft**, replace every example date, claim, route, and source, then confirm that each target exists in this revision. Publish the entry only after its checks pass.
3. Run the repository checks and inspect the changed page, locale link, and changelog anchor in local preview. Save the command output and actual result.
4. Prepare a release candidate. Deploy only through a separately configured, tested release procedure; if you have none, stop at the reviewed local result rather than improvising SSH commands.

**No-update is valid:** save the rejected item and reason privately. For this site's Linux deployment example, review `site/ops/DEPLOYMENT-EXAMPLE.md` in the repository; its GNU tools and `flock` assumptions are not a portable macOS deployment recipe. Static hosts with immutable versions can use their native publish/rollback workflow instead of VPS symlinks.

> [!FLOW] 90–120 minute Sunday refresh pipeline
>
> 1. **Filter & map (15m)** — Keep only actionable changes; stop if none survive.
> 2. **Verify & rewrite (35m)** — Open primary sources and revise executable steps across locales.
> 3. **Evidence & notices (10m)** — Assign accurate evidence labels and risk qualifications.
> 4. **Changelog (10m)** — Record changes with exact affected-page routes.
> 5. **Validate & deploy (20m)** — Pass the checks, use the configured release workflow, and run smoke probes.
> 6. **Private record (5m)** — Save the outcome and rollback target outside the public repository.

## Timebox and stop gates

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="A publishing decision tree">
    <img class="theme-diagram__light" src="/illustrations/weekly-content-site-refresh/overview.light.svg" alt="" data-decorative="true" width="420" height="662" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/weekly-content-site-refresh/overview.dark.svg" alt="" data-decorative="true" width="420" height="662" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>A publishing decision tree</strong> If no item changes a real action, record a private “no update” note and stop. Otherwise verify sources, revise the guide, pass the release gates, and smoke-test the release. Keep the previous release available for rollback.</figcaption>
</figure>

| Phase | Minutes | Owner | Pass / stop gate |
|---|---|---|---|
| **1. Filter & map** | `15` | Human editor | At least one concrete action change survives; otherwise stop and record “no update” |
| **2. Verify & rewrite** | `35` | Human + [Claude Code](/en/articles/claude-code/) / [Codex](/en/articles/codex/) | Every cited URL opened by a human; executable sections updated across locales |
| **3. Evidence & notices** | `10` | Human editor | Accurate `tested` / `documentation-backed` / `unverified` badge + caveats |
| **4. Changelog** | `10` | Agent + Human | Non-empty `changes[]` where every `affectedPages` route exists in `dist/` |
| **5. Validate & deploy** | `20` | CI / release script | `npm run build` exits `0`; atomic symlink switch + HTTP smoke probes pass |
| **6. Private record** | `5` | Human editor | Private release log saved outside `dist/` with rollback target noted |

> [!TIP] Empty weeks are a feature, not a failure
> If a week’s digest is 100% funding announcements, model leaderboard drama, or unverified hype, **stop after Phase 1**. Record a 3-line private “no update” note instead of bumping `updated` dates on unchanged guides.

The table budgets 95 minutes, leaving up to 25 minutes of contingency within a 120-minute cap. If source verification or checks exceed the cap, keep the candidate as a draft and resume later; never skip a gate to meet the clock.

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

> [!NOTE] Adapt repository-specific examples
> `site/`, the `npm run check` script, and the `ops/` paths below belong to OPC Vibe Stack. In another project, inspect its README and available scripts before replacing them. For this repository’s full test suite, use its Linux CI environment; the deployment example requires GNU tools and `flock`. A skipped platform test is not a deployment pass.

## Copy-pasteable templates

### 1. Weekly changelog entry (`site/src/content/changelog/en/YYYY-wNN.md`)

Illustrative draft, not a record of work performed. Replace every sample claim and date; keep it draft until the cited change and targets have been verified.

```yaml
---
slug: 2026-w46
date: "2026-11-14"
title: "Week 46: Tighten Codex sandbox flags and weekly smoke checks"
summary: "Updated Codex sandbox verification steps and added cache-header probes to the Sunday release checklist."
locale: en
status: draft
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

### 2. Private release / no-update log (outside the public repository)

The following is a filled example, not an actual release. Save your own record outside the checkout, or in an explicitly ignored directory; being outside `dist/` alone does not keep it out of Git.

```markdown
# Weekly Refresh Record — [YYYY-wNN]

- **Date & elapsed minutes:** 2026-11-14 (85 min)
- **Briefing range reviewed:** 2026-11-08 .. 2026-11-14
- **Keepers vs dropped count:** 2 kept / 9 dropped (pure launch noise)
- **Outcome:** [Published release | No-update week]
- **Changed article slugs:** `codex` (en, zh)
- **Changelog slug:** `2026-w46`
- **Release directory & previous symlink target:** `releases/20261114-1830` (prev: `releases/20261107-1715`)
- **Smoke check status:** `/` reaches `/en/` (record actual HTTP or page redirect), `/en/` 200, `/en/articles/codex/` 200, `/en/changelog/` 200, `/missing-probe` 404
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
