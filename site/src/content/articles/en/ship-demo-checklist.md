---
title: "Ship & demo: landing page + agent-made demo checklist"
slug: ship-demo-checklist
summary: "Turn a working repo into a stranger-ready offer: 5-block landing page, ≤90s demo storyboard, and staging-safe screen capture."
locale: en
category: checklist
stage: sell
tools: [grok-build, claude-code, codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Any stack agent plus your static/staging host; optional agent-screenplay MCP/CLI (Node 20+) for scripted recordings"
published: "2026-11-06"
updated: "2026-11-10"
internalBriefing:
  - date: "2026-11-04"
    note: "Agent-made demo / screen recording tools"
publicSources:
  - title: "agent-screenplay README"
    url: "https://github.com/gmpetrov/agent-screenplay"
    kind: docs
  - title: "Agent-made polished screen recordings (briefing post)"
    url: "https://x.com/RoundtableSpace/status/2117802763262591481"
    kind: x
  - title: "Astro internationalization (locale-prefixed routes)"
    url: "https://docs.astro.build/en/guides/internationalization/"
    kind: docs
  - title: "Astro project structure"
    url: "https://docs.astro.build/en/basics/project-structure/"
    kind: docs
tags: [sell, launch, demo]
---

## Conclusion

“Tests green on `main`” is not shipped. Shipped means a cold stranger lands on your public URL, understands who the product is for in 10 seconds, watches or clicks through a **≤90-second happy path**, and completes the primary CTA without you explaining it on a call.

CTA means the primary call to action: the button or link that starts the user’s intended task.

## Run this acceptance test with one new visitor

Use staging with synthetic data. Ask a peer who has not seen the product to open the page without a walkthrough. A recording is optional; an actual successful task is required.

1. Ask them to state the target user and expected outcome after reading the first screen. Record their words instead of explaining the answer.
2. Give them one representative input. Observe whether they find the CTA, complete the action, and recognize the result without help.
3. Repeat at 390px width. Use keyboard navigation to reach the CTA, trigger one invalid input or empty state, and recover to the starting page.
4. Record each failure as **page → action → expected → actual → fix**. Fix the first blocker and repeat that same action before polishing the video.

**Release evidence:** the tested URL/revision, date, viewport, exact task, result, and remaining limitations. If access requires login, use a test account or a clearly labeled recording; never remove necessary access controls for a demo. A successful page load alone does not prove the CTA, purchase, or form submission works.

> [!FLOW] From repo-green to stranger-ready
> 1. **Draft 5-block page** — Write audience, pain, offer, verifiable proof, and one CTA in order.
> 2. **Capture ≤90s demo** — Film one real input-to-output path manually or via staging automation.
> 3. **Smoke mobile & 404** — Test cold load, primary action, and recovery on a phone viewport.
> 4. **Close 7-day loop** — Log real visitor objections for a week and fold answers back into copy.

## Five-block landing page blueprint

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="A visitor-first page blueprint">
    <img class="theme-diagram__light" src="/illustrations/ship-demo-checklist/overview.light.svg" alt="" data-decorative="true" width="420" height="664" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/ship-demo-checklist/overview.dark.svg" alt="" data-decorative="true" width="420" height="664" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>A visitor-first page blueprint</strong> This conceptual wireframe maps five buyer questions to five page sections. The demo strip follows the article’s 10 / 35 / 25 / 20-second storyboard: problem, workflow, result, and call to action. It is not a captured product interface.</figcaption>
</figure>

Structure your landing page top-to-bottom so every scroll answers the buyer’s next objection:

| Block | Copy job | Pass / fail stranger check |
|---|---|---|
| **1. Who + one-line offer** | Name the exact builder/buyer and concrete outcome | Reader states what you sell in ≤10 seconds |
| **2. Status-quo pain** | Contrast the manual/scattered headache vs your workflow | Target user recognizes their current friction |
| **3. ≤90s happy-path demo** | Show real product input → output (video or live sandbox) | Use synthetic data or a labeled recording; preserve necessary access controls |
| **4. Honest proof** | Link live repo, docs, sample output, or labeled benchmarks | Zero fabricated user counts or fake logos |
| **5. Primary CTA & pricing/start** | One clear action (`Start`, `Install`, `Buy`, or `Waitlist`) | Visitor knows cost and immediate next step |

## ≤90-second demo storyboard

Keep launch demos ruthlessly focused on **one** job—skip account creation, settings screens, and edge-case detours:

| Time window | On screen | Caption / narration rule |
|---|---|---|
| **0:00–0:10** | Starting problem state (messy input or broken status quo) | State the problem in one plain sentence |
| **0:10–0:45** | Core workflow executing end-to-end | Show real UI/CLI response; avoid jump-cutting slow steps dishonestly |
| **0:45–1:10** | Finished artifact or verified output | Highlight the concrete payoff the buyer keeps |
| **1:10–1:30** | Public URL + primary CTA | Tell viewers the exact URL and single first step |

## Prerequisites

- A reachable public or provisional staging URL ([Grok Build](/en/articles/grok-build/) or static Astro deploy)
- One sentence offer, one primary CTA, and honest pricing or access terms
- Optional for scripted recordings: Node.js 20+ if testing [agent-screenplay](https://github.com/gmpetrov/agent-screenplay) (`npx agent-screenplay init` per its official README)

## Steps

1. **Draft the five landing blocks in plain Markdown first** before touching layout polish—if the offer sounds vague in plain text, CSS will not save it.
2. **Record a ≤90-second happy-path walkthrough.** Either record manually in one clean take or script an automated scenario.
3. **Optional: try agent-driven screen capture on staging.** Open-source tools such as [agent-screenplay](https://github.com/gmpetrov/agent-screenplay) expose MCP/CLI hooks so [Claude Code](/en/articles/claude-code/), [Codex](/en/articles/codex/), or other MCP clients can inspect a local/staging app, author a scenario, and export an MP4 with cursor motion, zooms, and captions (the package ships no LLM of its own). Existence and CLI setup are **documentation-backed** via its README; evaluate output quality and dependency trust yourself before relying on it.
4. **Run a mobile & recovery smoke pass** at `≤390px` width: test home load, demo playback, primary CTA, locale/theme controls (if enabled, as dogfooded on this Astro site), and a deliberate `404` or empty-search state.
5. **State pricing or “how to start” plainly** without inventing urgency timers, fake seat limits, or unverified ROI claims.
6. **Collect inbound questions for 7 days** from peers, X replies, or support emails, and turn the top three questions directly into landing copy or FAQ bullets.

> [!WARNING] Never point automated demo agents at live customer accounts
> Automated browser/desktop scenario runners click buttons and submit forms for real. Run `agent-screenplay` (or any browser MCP) strictly against `localhost` or an isolated staging environment with mock billing and disabled outbound email—never against production Stripe, live webhooks, or real user data.

> [!NOTE] Optional recorder setup changes your environment
> The [agent-screenplay README](https://github.com/gmpetrov/agent-screenplay) says `init` downloads Chromium, adds MCP configuration for detected agents, and installs its guide. Review those changes and restart the agent afterward. Manual screen recording is sufficient for this checklist; you do not need to install it to test the visitor journey.

## Copy-pasteable launch & demo worksheet

```text
Target buyer (be specific):
Painful status quo (1 sentence):
Offer in one sentence:
Primary CTA label + destination URL:
Pricing / access model (free | paid tier | waitlist):
Demo format (manual recording | interactive preview | agent-screenplay):
Staging URL used for filming (confirm zero prod side effects):
Top 3 buyer objections to answer on-page:
```

## Pre-launch smoke checklist

- [ ] A peer builder can explain who the product is for and what it does after one unguided page view
- [ ] Primary CTA works end-to-end on both desktop and a real mobile viewport (`≤390px`)
- [ ] Demo video or interactive walkthrough finishes the happy path in `≤90 seconds`
- [ ] Zero fake testimonials, invented customer counts, or unlabeled benchmark claims appear anywhere on the page
- [ ] Automated demo scripts (if used) ran against staging/mock accounts only—no real emails or charges fired
- [ ] `404` page, Open Graph title/image preview, and canonical URL resolve cleanly

## Anti-patterns

- **Shipping a 15-bullet feature matrix with no primary CTA** — visitors admire the effort and close the tab.
- **Padding launch pages with invented social proof or unverified revenue claims** — permanently burns indie credibility.
- **Recording a 7-minute unedited tour starting at `git clone` and login screens** — lead with the 60-second payoff first; link deep docs underneath.
- **Running browser-driving agents against production accounts** — one misfired click can trigger real customer notifications or billing events.
