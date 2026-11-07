# OPC Vibe Stack — Product Requirements Document (PRD)

## 1. Document information

| Item | Content |
|---|---|
| Document name | Product Requirements Document for OPC Vibe Stack |
| Product name | **OPC Vibe Stack** |
| Domain | **opcvibestack.com** (registered) |
| Version | **v0.5** |
| Date | 2026-11-06 (America/Los_Angeles) |
| Author | VibeCode |
| Status | Canonical product direction — **revised per Fan review; v0.5 consistency fixes** (supersedes English PRD v0.3 and Chinese PRD v0.1/v0.2) |
| Related inputs | Daily / weekly Vibe Coding briefings in this chat; Fan goal: build site + weekly refresh; Fan review of v0.3 (six issues) |

**Canonical note:** This English PRD (**v0.4**) is the source of truth for product direction. `PRD-v0.3-en.md` is retained as the pre-review draft. The Chinese file `PRD-v0.1.md` is historical context only.

---

## 2. Background and goals

### 2.1 Background

One-person companies (OPCs) increasingly use AI coding agents—**Claude Code**, **Codex**, and **Grok Build**—for research, development, shipping, and distribution. Practical methods are scattered across X (Twitter), blogs, and vendor docs: hard to reuse, weak tool boundaries, and almost no sell-side guidance.

VibeCode already produces a **daily briefing** (English X–first, Chinese secondary) covering Vibe Coding / AI image / AI short drama, plus a **Sunday HTML digest**. The **Vibe Coding** section is the primary feedstock for this site’s weekly updates.

### 2.2 Product positioning

An **executable best-practice knowledge site** for English-speaking indie OPC builders: which agent for which stage, how to wire a pipeline, how to sell—kept current by weekly intake from briefings. Not a news dump; not a course platform.

**One-liner:** *Ship alone, faster—with Claude Code, Codex, and Grok Build—then sell.*

### 2.3 Goals (testable)

1. **MVP accepted at M2** on `opcvibestack.com`: clear IA, core practice pages, and **one demonstrated weekly refresh** (see §11–§12). Soft launch (M1) alone does **not** count as MVP complete.
2. **Maintainable:** weekly briefing → site update ≤ ~2 hours of agent work; VibeCode may merge/publish without per-item Fan approval **after** the editorial verification gate (§9.5).
3. **Shareable:** English default; stable slugs; **public sources followable** (permalinks where citing X/web); structure ready for secondary locales.
4. **Explicitly not:** a general AI news site, a tool ranking leaderboard, or a full LMS.

### 2.4 Non-goals

- Daily news volume as a KPI (daily briefings stay in chat).
- Running Fan’s sales accounts or closing deals on their behalf.
- Accounts, paywall, or community feed in v1.
- Auto-scrape-and-publish without editorial filters / verification gate.

---

## 3. Users and scenarios

### 3.1 Primary users (P0)

| Persona | Description | Core need |
|---|---|---|
| Indie hacker / solo developer | Ships with agents (some code or almost none) | Clear stack + pipeline, fewer dead ends |
| Soft/hardware OPC founder | SaaS, utilities, or light hardware + firmware/companion app | One-pager from research → listing |

**Geography / language:** English-speaking regions as primary audience and primary information sources (English X, English docs, English indie communities). Other languages via i18n later.

### 3.2 Secondary users (P1)

- Creators moving from “vibe coding only” to “can sell.”
- Tiny teams (≤3) that still operate like an OPC.

### 3.3 Typical scenarios

1. **Choose tools:** Claude Code vs Codex vs Grok Build for research / coding / shipping.
2. **Start a build:** idea → spec → agent loop → verify → ship checklist.
3. **Avoid damage:** rules files, hooks, security alerts (extension malware, token theft)—no exploit steps.
4. **Sell:** landing page, demo video (often agent-assisted), distribution, pricing, feedback loop (lightweight).
5. **Weekly read:** “What landed in the site this week from Vibe Coding briefings?”

---

## 4. Requirements analysis

### 4.1 Business needs

- Reusable OPC × agent playbooks that stay current with the ecosystem.
- Closed loop with existing routines: briefing production → site deposition → site gaps feed next briefing focus.
- The site itself is an OPC case study (built and updated with agents).

### 4.2 User needs (priority)

| ID | Need | Priority |
|---|---|---|
| U1 | Instant clarity on recommended stack and division of labor | P0 |
| U2 | Executable checklists/templates for research / build / sell | P0 |
| U3 | Reproducible workflows and anti-patterns, not slogans; evidence label on guidance | P0 |
| U4 | Weekly visibility into what was added or revised | P0 |
| U5 | Soft vs hardware differences called out (firmware, supply chain, compliance at “verify yourself” level) | P1 |
| U6 | **First-class i18n** (English default; Chinese and others secondary) | P0 (architecture) / P1 (second locale content in v1/M3) |
| U7 | RSS / optional email subscribe | P1 |

### 4.3 Non-functional requirements

| Category | Requirement |
|---|---|
| Performance | Static pages; avoid heavy client frameworks for core reading |
| Maintainability | Markdown/MDX content; weekly updates must not require architecture changes |
| Traceability | Separate **internal briefing provenance** from **public source permalinks**; no invented URLs; readers must get followable public links when citing X/web |
| Evidence | Published guidance labeled `tested` \| `documentation-backed` \| `unverified`; numerical claims keep “poster-claimed, unverified” disclaimers |
| Safety honesty | Security items (extension poisoning, token theft) clearly flagged; **no attack procedures**; alerts ≠ whole-tool deprecation |
| Compliance | X posts as summary + original permalink; no wholesale copying; trademarks as tool names |
| Accessibility | Semantic HTML, contrast, image alt text |
| Language | **Default locale: `en`**; UI and MVP content in English; i18n-ready routes |
| Visual | Minimal documentation aesthetic; clean layout; polished but quiet UI |

---

## 5. Feasibility

### 5.1 Technical — **High**

Static site (**Astro** preferred) + Markdown/MDX + Git weekly updates. Deploy: **Ubuntu VPS + Nginx** serving the static build; optional CI rsync/scp. Front with **Cloudflare** for TLS, cache, and global edge.

### 5.2 Content / ops — **Medium–high (discipline-dependent)**

Feedstock exists (daily Vibe Coding + Sunday digest). Risk: briefing noise bloating the site. Mitigation: only ingest **executable, reusable, OPC-pipeline-relevant** items; editorial verification gate in §9.5.

### 5.3 Cost — **Low to start**

| Item | Rough scale |
|---|---|
| Domain | `opcvibestack.com` (registered) |
| Hosting | Ubuntu VPS (existing or modest plan) + Cloudflare free/pro |
| Tool subscriptions | Reuse Claude / Codex / Grok; no new hard dependency |
| Labor | MVP build: days; then ≤ ~2h/week agent-driven refresh |

### 5.4 Risks and mitigations

| Risk | Mitigation |
|---|---|
| Tools rename / shut down | Separate **article `status`** from **tool `toolAvailability`** (`active` \| `warning` \| `deprecated`); deprecate whole tool only when product withdrawn or intentionally dropped from stack |
| Extension / workflow risk | Publish `alert`; set tool card to `warning` if needed; update affected guides (banner / patch / deprecate article)—do **not** auto-deprecate the whole tool |
| Briefing noise | Ingest whitelist + P0 section map; prefer Sunday digest cards; verification gate before publish |
| Over-promising solo hardware | Hardware chapter marked high-risk; software-first |
| Inflated SEO expectations | KPIs = completion + return visits, not day-one UV |
| Misattribution | Summary + **public permalink**; mark unverified poster-claimed numbers; evidence labels on guidance |

---

## 6. Scope

### 6.1 In scope (MVP → v1)

- Site IA, home, core section pages, practice articles/checklists, stack comparison.
- Weekly changelog bound to briefing dates **and** public source permalinks where available.
- Content model: article collection + **separate changelog collection**; frontmatter; weekly SOP with verification gate.
- Baseline SEO (title/description/OG), RSS (v1).
- Software path first; hardware as a **light P1 chapter** (not e-commerce).
- Locale-prefixed routing with English default; i18n plumbing; **v1/M3 requires** second-locale About + Stack, switcher, and missing-page fallback.

### 6.2 Out of scope

- Login, comments, UGC community.
- Payments / paid courses (later optional).
- Unreviewed auto-publish from the open web.
- Full CRM / e-commerce backend / “official certification.”
- Daily news stream on the site (daily stays in chat).
- **Cursor** as a homepage stack tool (may appear later as optional mention, not co-equal).

---

## 7. Information architecture and pages

Default locale is English. Routes are **locale-prefixed**; unprefixed `/` redirects to `/en/` (or serves `en` equivalently—pick one scheme and keep it consistent).

```
/en/                      Home: one-liner + Research / Build / Sell + this week’s updates
/en/stack                 Tool stack: Claude Code / Codex / Grok Build — roles & combos
/en/research              Research: competitors, interview outlines, specs, feasibility
/en/build                 Build: agent loops, rules files, hooks, verification, release
/en/sell                  Sell: landing, demos, distribution, pricing, feedback
/en/hardware              Soft+hard notes (P1)
/en/playbooks             End-to-end playbooks (e.g. 48h MVP, weekly content site)
/en/anti-patterns         Anti-patterns & security alerts
/en/changelog             Weekly / historical updates (tied to briefings + public sources)
/en/about                 About, update mechanism, disclaimer
/en/articles/[slug]       Individual practice articles
```

Later (example): `/zh/...` mirrors the same tree when Chinese content is ready. Do not invent other public URLs beyond `opcvibestack.com`.

**Nav (suggested):** Stack | Research | Build | Sell | This week  
**Footer:** About | RSS | Disclaimer | Locale switcher (when ≥2 locales)

---

## 8. Features (with acceptance criteria)

### P0 — Must-have for MVP acceptance (M2)

| ID | Feature | Acceptance |
|---|---|---|
| F01 | Deployable static site on Ubuntu VPS + Nginx | Public URL on `opcvibestack.com` works; mobile-readable |
| F02 | Home explains product and audience | Visitor answers “what is this?” in ~10 seconds |
| F03 | `/en/stack` division-of-labor table | Covers **Claude Code, Codex, Grok Build** only as primary tools; each: best stage, poor fit, caveats; each tool card has `toolAvailability` |
| F04 | ≥1 executable practice piece each for research / build / sell | Steps + template fields + definition of done; each piece has evidence label (`tested` \| `documentation-backed` \| `unverified`) |
| F05 | `/en/changelog` | Separate changelog collection; each entry shows **date**, change summaries, links to affected pages, **internal briefing date(s)**, and **public source permalinks** where the change cites X/web |
| F06 | Markdown content workflow | Adding MD in repo produces a page; required frontmatter validated for articles **and** changelog collection |
| F07 | Disclaimer | Unofficial; security on you; numbers may be unverified; evidence labels explained |
| F08 | Weekly SOP runnable with verification gate | VibeCode completes **one full refresh** end-to-end: filter → map → rewrite → **verify** → ingest → changelog → publish |
| F09 | i18n scaffolding | Locale-prefixed routes; `en` complete for soft launch / MVP content |
| F10 | Visual system | Minimal docs style: readable type, clear hierarchy, polished spacing/color |

**Note:** Soft launch (M1) may ship F01–F04, F06–F07, F09–F10, and a **changelog shell**. F05 with a **real dated entry** (briefing + public permalinks) and F08 (demonstrated refresh) are required for **MVP acceptance at M2**, not optional post-launch polish.

### P1 — ~2–4 weeks after MVP acceptance (v1 / M3)

| ID | Feature | Acceptance |
|---|---|---|
| F11 | ≥2 end-to-end playbooks | Toolchain + timebox |
| F12 | `/en/hardware` | Firmware/companion-app split; supply-chain/compliance “verify yourself” list |
| F13 | RSS | Changelog and/or articles feed works |
| F14 | On-site search | Find articles by title/tags |
| F15 | OG images / share cards | Major social previews OK |
| F16 | Second locale (e.g. `zh`) for **About + Stack at minimum** | Switcher works; missing pages fall back gracefully; **required in v1/M3** (not optional stub-only) |

### P2 — when capacity allows

| ID | Feature | Acceptance |
|---|---|---|
| F17 | Broader locale coverage | More pages translated; not machine-dumped without edit |
| F18 | Briefing → PR semi-automation | Agent drafts changelog + MD diffs; merge/publish still after verification gate |
| F19 | Case library | Shared case template; human review before publish |

---

## 9. Content model and weekly SOP

### 9.1 Content types

| Type | Purpose | Example | Collection |
|---|---|---|---|
| stack | Tool card | Claude Code rules-file practices | `articles` |
| guide | Long-form guide | Idea → Spec → agent loop | `articles` |
| checklist | Checklist | Pre-ship / security | `articles` |
| playbook | End-to-end script | Solo 7-day shippable utility | `articles` |
| alert | Security / risk warning | Extension malware, token theft | `articles` |
| changelog | Weekly delta | 2026-W45 ingest | **`changelog` (separate)** |

### 9.2 Article frontmatter (`articles` collection)

```yaml
title: string                 # required
slug: string                  # required, stable
summary: string               # required, ≤160 chars English
locale: en                    # default; zh etc. later
category: stack|guide|checklist|playbook|alert   # changelog is NOT in this enum
stage: research|build|sell|cross
tools: [claude-code, codex, grok-build]   # cursor only if explicitly added later
priority: P0|P1|P2
status: draft|published|deprecated        # ARTICLE publication status only
evidence: tested|documentation-backed|unverified   # required for published guidance
applicableToolsVersions: string           # e.g. "Claude Code ≥2.x; Codex CLI 2026-10"
updated: YYYY-MM-DD
# Internal provenance (not a substitute for public links; may be chat-only)
internalBriefing:
  - date: YYYY-MM-DD                      # required when sourced from briefing
    note: optional string                 # e.g. "Daily briefing Vibe Coding section"
# Public, followable sources — required when citing X/web claims or workflows
publicSources:
  - title: string
    url: string                           # required real permalink; no invented URLs
    kind: x|docs|blog|other
tags: []
```

Body pattern: conclusion first → steps → templates → anti-patterns → sources (list `publicSources`; mention briefing date only as provenance).

**Evidence labels**

| Label | Meaning |
|---|---|
| `tested` | VibeCode or Fan reproduced the command/workflow (or equivalent) |
| `documentation-backed` | Steps match official docs or a primary vendor source; not necessarily re-run this week |
| `unverified` | Reported from briefing/X; original source checked but not re-tested; keep numerical disclaimers |

### 9.3 Changelog collection (separate; preferred over stuffing `category`)

Changelog entries are **not** articles. Schema:

```yaml
date: YYYY-MM-DD              # required (publish / week date)
title: string                 # required, short week or entry title
summary: string               # required, ≤200 chars
locale: en
changes:                      # required, ≥1
  - type: added|revised|deprecated|alert
    text: string              # change summary
    affectedPages:            # links to site pages touched
      - /en/articles/rules-hooks
    evidence: tested|documentation-backed|unverified
internalBriefing:             # provenance only
  - date: YYYY-MM-DD
    note: optional string
publicSources:                # required when the change cites X/web
  - title: string
    url: string
    kind: x|docs|blog|other
```

**UI for `/en/changelog`:** show `date`, each change summary, links to `affectedPages`, briefing date(s) as internal provenance, and clickable `publicSources` permalinks.

### 9.4 Tool cards: availability vs article status

| Field | Scope | Values | When to use |
|---|---|---|---|
| `status` (article) | Single article/guide | `draft` \| `published` \| `deprecated` | Publication lifecycle of that page |
| `toolAvailability` (stack tool card) | Whole tool on `/en/stack` | `active` \| `warning` \| `deprecated` | Product health / stack recommendation |

**Rules**

1. A **security alert** or risk affecting one extension, plugin, or workflow → publish/update an `alert` article; optionally set the tool to `warning`. Does **not** automatically set `toolAvailability: deprecated`.
2. Set `toolAvailability: deprecated` only when the **product is withdrawn**, vendor shutdown is confirmed, or Fan/VibeCode **intentionally drops** the tool from the homepage stack.
3. When a warning or deprecation lands, update existing guides that recommend the affected tool:
   - **Banner** on the page (quick, preferred for scoped risks);
   - **Patch** steps/caveats and bump `updated` + changelog;
   - **Deprecate the article** (`status: deprecated`) if the guide is no longer safe or useful as written.
4. Ingest mapping: `Shutdown/risk` → `alert` (+ optional tool `warning`); **not** automatic whole-tool deprecation.

### 9.5 Weekly pipeline (tied to existing routines)

**Inputs**

- Daily “AI briefing” **Vibe Coding** section (**English X–first**; Chinese posts only when they add a distinct method).
- Sunday HTML digest cards relevant to vibe coding / OPC pipeline.
- Image / short-drama sections **default out**, unless they directly support demos, landing creatives, or sell steps that can be written as OPC actions.

**Each Sunday (align with Sunday HTML task; may merge)**

1. **Filter:** keep executable actions, new commands/workflows, tool status changes, security alerts. Drop pure hot takes.
2. **Map:** `research | build | sell | stack | alert`.
3. **Rewrite:** briefing voice → second-person site voice; keep “poster-claimed, unverified” on numbers.
4. **Verify (gate — required before publish):**
   - Check **original public sources** (open permalinks; no invented URLs).
   - Record `applicableToolsVersions` (tool + version / date window).
   - Assign `evidence`: `tested` \| `documentation-backed` \| `unverified`.
   - Separate `internalBriefing` (chat date, provenance) from `publicSources` (reader-followable links). When citing X/web, `publicSources[].url` is **required**.
5. **Ingest:**
   - New guide/checklist → new MD in `articles`;
   - Revision → edit page + `updated` + banner/patch if tool risk;
   - Shutdown/risk → `alert` + optional tool `warning`; deprecate whole tool only per §9.4.
6. **Changelog:** new entry in `changelog` collection: added / revised / deprecated / alert + briefing dates + public permalinks + `affectedPages`.
7. **Publish:** VibeCode may **merge and deploy directly** after the verification gate (Fan authorization already granted).
8. **Feedback:** next week’s briefing can emphasize site gaps.

**Effort target:** filter + rewrite + verify + changelog ≤ 90–120 minutes/week; no weekly architecture churn.

---

## 10. Technical recommendations

| Layer | Recommendation | Why |
|---|---|---|
| Framework | **Astro** (+ official i18n / content collections) | Content sites, MD/MDX, fast static |
| Styling | Light CSS (e.g. Tailwind) + typographic defaults | Low maintenance; docs aesthetic |
| Content | Git-managed `src/content/articles` + `src/content/changelog` | Weekly update = Git; schema split |
| Deploy | **Ubuntu VPS + Nginx** static export; CI rsync/scp | Fan’s chosen path |
| CDN / edge | **Cloudflare** in front of origin | TLS, cache, global readers |
| Domain | `opcvibestack.com` → Cloudflare → VPS | Brand + shareable URLs |
| Locales | Default **`en`**; architecture for `/zh` etc. | English-first + i18n |
| Analytics | Optional Plausible/Umami | Privacy-friendly metrics |
| Search | Skip in MVP; client search in P1 | Scope control |

**Build narrative:** generate Astro skeleton + first MD set with Claude Code / Codex / Grok Build—dogfooding the product.

### 10.1 VPS region (open preference)

For an **English-primary, globally readable** docs site with Cloudflare:

| Option | Fit |
|---|---|
| **US-West** (e.g. SF / LA) | Strong for EN primary audience; excellent Cloudflare origin pairing |
| **Singapore** | Strong Asia latency; still fine for EN via Cloudflare |

**Decision deferred to Fan:** pick **SG vs US-West**; either is acceptable with Cloudflare. Document the choice in ops notes when VPS is provisioned. Do not block M1 on region if a temporary origin exists.

---

## 11. Success metrics

### Soft launch (M1) — not MVP acceptance

- Deployed IA + core `en` pages (home, stack, research/build/sell ×1, About).
- Changelog **shell** (collection + route) may be empty or placeholder.
- Site publicly reachable on `opcvibestack.com` (or provisional origin).

### MVP acceptance (M2) — this is “MVP complete”

- All P0 features F01–F10 satisfied, including:
  - ≥4 core pieces `published` in `en` with evidence labels;
  - **≥1 demonstrated weekly refresh:** dated changelog entry(ies) with change summaries, `affectedPages`, **internal briefing date(s) as provenance**, and **public source permalinks** where applicable;
  - Verification gate executed for that refresh.
- Fan willing to share the link with peer OPC builders.

### v1 (M3 / ~6–8 weeks after soft launch)

- ≥4 consecutive weekly updates without skipping.
- ≥15 substantive change items across weekly changelog entries (not filler).
- Observable return traffic or inbound questions/shares.
- ≥1 dogfood case: this site or another small product run via a playbook.
- **F16 complete:** second locale About + Stack translated; switcher + missing-page fallback working.

**Not early success criteria:** daily active users, ads, raw article count. **Do not** declare MVP complete at M1 soft launch.

---

## 12. Milestones

| Phase | Timebox (suggested) | Deliverable | Acceptance gate |
|---|---|---|---|
| **M0 Decisions** | Done | Name, domain, EN-first + i18n, tools (no Cursor), VPS+Nginx, direct publish (post-gate), docs UI | — |
| **M1 Soft launch** | 3–7 days | Astro + i18n routes + `/en/stack` + research/build/sell ×1 + About + **changelog shell** + deploy to VPS | Soft launch only; **not** MVP complete |
| **M2 MVP acceptance** | Next Sunday (or first full week after M1) | **One demonstrated weekly refresh:** real ingest from that week’s Vibe Coding briefings; dated changelog with briefing refs + public permalinks; F05 + F08 green | **MVP = M2** |
| **M3 v1** | 3–5 weeks post-MVP | Playbooks×2, hardware, RSS, anti-patterns/security, search, **required `zh` (or other) About + Stack + switcher + fallback** | F11–F16 |
| **Ongoing** | Sundays | Briefing → verify → update → optional HTML digest cards that mirror site changelog | Verification gate every week |

---

## 13. Confirmed decisions (as of 2026-11-06)

1. **Name:** OPC Vibe Stack.  
2. **Domain:** `opcvibestack.com` (registered).  
3. **Primary language & audience:** English; English-region / English-speaking indie OPC builders; English-first sources.  
4. **i18n:** First-class architecture; Chinese and other locales secondary; **v1/M3 requires** About + Stack translation + switcher + fallback (not optional stub-only).  
5. **Homepage tools:** Claude Code, Codex, Grok Build — **not Cursor** for now.  
6. **Hardware:** Light chapter in P1; software-first.  
7. **Deploy:** Ubuntu VPS + Nginx static hosting; Cloudflare recommended; **SG vs US-West open**.  
8. **Weekly updates:** VibeCode may **merge/publish directly** after the **verification gate**, without per-item Fan approval.  
9. **Visual:** Minimal documentation style; clean layout; polished UI.  
10. **Pipeline:** Daily EN-X-first Vibe Coding briefings → weekly site changelog; image/short-drama only if sell/demo-relevant.  
11. **Monetization:** Not a priority for MVP.  
12. **MVP gate:** Soft launch = M1; **MVP acceptance = M2** (one demonstrated weekly refresh).  
13. **Sources:** `internalBriefing` vs `publicSources`; readers get followable public links.  
14. **Tool risk:** alerts/warnings ≠ automatic whole-tool deprecation.

---

## 14. Open questions

| # | Question | Notes |
|---|---|---|
| O1 | **VPS region: Singapore vs US-West?** | Both OK with Cloudflare; Fan preference |
| O2 | Exact Nginx/CI path (GitHub Actions vs manual rsync)? | Decide at M1 deploy |
| O3 | Analytics vendor (none / Plausible / Umami)? | Optional at soft launch |
| O4 | Unprefixed `/` → redirect to `/en/` vs serve EN at `/` with `/zh` only prefixed? | Prefer always locale-prefixed for consistency |
| O5 | Which second locale first (`zh` assumed)? | M3; About + Stack required |

---

## Appendix A — MVP first content (English)

1. *How a one-person company should split the AI agent stack* (stack)  
2. *Spec first, then let the agent change code* (research/build)  
3. *Rules files + hooks: don’t rely on AGENTS.md alone* (build)  
4. *Ship & demo: landing page + agent-made demo video checklist* (sell)  
5. *Security quickcheck: extension malware, SSH/tokens, hard no-gos* (alert)  
6. Changelog: shell at M1; **first real weekly entry required at M2**

## Appendix B — Relation to existing routines

| Existing routine | Relation to site |
|---|---|
| Morning daily briefing | Raw material; mainly Vibe Coding (+ rare sell-side); becomes `internalBriefing` + `publicSources` |
| Sunday evening HTML digest | Can co-produce with changelog; HTML for share, MD for deposit |
| This chat continues build | After PRD sign-off, enter M1 soft launch here |

## Appendix C — Domain

| Domain | Status |
|---|---|
| `opcvibestack.com` | **Registered** — production domain |

No other product URLs are claimed in this PRD.

## Appendix D — Changelog vs v0.3 (review resolution)

| Review item | Resolution in v0.4 |
|---|---|
| P1 MVP conflict | M1 = soft launch; M2 = MVP acceptance; §11 aligned |
| P1 Editorial evidence | §9.5 verification gate; evidence labels; tools/versions |
| P2 Changelog schema | Separate `changelog` collection (§9.3) |
| P2 Source traceability | `internalBriefing` vs `publicSources`; F05 aligned |
| P2 i18n underdelivery | F16 required in M3; removed optional-stub language |
| P2 Alert vs deprecate | §9.4 `toolAvailability` + guide update rules |

---

**Next step:** Confirm open question O1 (VPS region) when ready—or proceed to **M1 soft launch** with a provisional region and Cloudflare. M1 deliverable: Astro skeleton, `en` routes, first Markdown set, changelog shell, Nginx static deploy path. M2 closes MVP with one verified weekly refresh.
