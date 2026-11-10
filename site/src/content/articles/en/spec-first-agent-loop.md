---
title: "Spec first, then let the agent change code"
slug: spec-first-agent-loop
summary: "Specify outcomes, boundaries, and verify checks before any agent edits code—using Spec Kit or a 5-line slice brief."
locale: en
category: guide
stage: research
tools: [claude-code, codex, grok-build]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code, Codex, or Grok Build; GitHub Spec Kit when installed; paired with your repo’s verify command"
updated: "2026-11-10"
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

An underspecified goal makes an agent change harder to scope and review. Write the target outcome, file boundaries, non-goals, and verification command **before** any coding agent opens an editor buffer. Whether you adopt GitHub’s **Spec Kit** (`specify → plan → tasks → implement`) or write a 15-line Markdown slice by hand, define acceptance criteria upfront so you can judge the result against a written target.

## First exercise: write a check before a prompt

Use plain Markdown first; Spec Kit is optional. In `specs/001-slice.md`, describe **one** behavior already visible in your product. Example: “Searching for a nonexistent term shows an empty-state message and a working Clear action.”

| Input / action | Expected result | How to verify |
|---|---|---|
| Search for a known title | Relevant result appears | Named test or browser action |
| Search for an impossible term | Explicit empty state | Record the text or screenshot |
| Clear the search | Results disappear; input is usable | Browser action + keyboard check |

Fill in the actual route, files in scope, and existing check command. Run the checks before editing; a missing test is work to add, not permission to invent a passing result. Hand off only the first task. If the desired output is still ambiguous, refine the spec before invoking an implementation workflow.

**Deliverable:** one spec, a small task list, and a reproducible pass/fail result. The `specify → plan → tasks` labels below describe phases, not shell commands. If using Spec Kit, follow its [current quickstart](https://github.github.com/spec-kit/quickstart.html); invoke the installed skills in the agent chat, not your terminal, and review each generated artifact.

> [!FLOW] Specify-before-code slice loop
> 1. **Constitution / Boundary** — Lock stack rules, forbidden paths, and non-goals once per project.
> 2. **Specify & Clarify** — Write user outcome and tickable acceptance checks before implementation.
> 3. **Plan & Tasks** — Split into small, file-scoped tasks ordered by verification gates.
> 4. **Implement & Converge** — Run one task at a time; commit only when the verify command is green.

## Vague prompting vs spec-first loop

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="From specification to evidence">
    <img class="theme-diagram__light" src="/illustrations/spec-first-agent-loop/overview.light.svg" alt="" data-decorative="true" width="420" height="630" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/spec-first-agent-loop/overview.dark.svg" alt="" data-decorative="true" width="420" height="630" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>From specification to evidence</strong> Define the outcome, boundaries, and acceptance check first. Implement one bounded task; a passing check leads to review and commit, while failure sends you back to repair the task or refine the spec.</figcaption>
</figure>

| Dimension | Vague “vibe” prompt | Spec-first slice loop |
|---|---|---|
| Starting input | *“Add search and make the UI nicer”* | Written user outcome + routes/files in scope + non-goals |
| Architecture decisions | Invented mid-edit by the model | Reviewed in `spec.md` / `plan.md` before code changes |
| Typical diff size | 20+ touched files, mixed concerns | 1–4 files per task, easy human diff review |
| Failure recovery | Endless chat debugging spirals | `git checkout` one small task or tighten the spec |
| Completion signal | “Looks right in chat” | Deterministic verify command exits `0` |

## Prerequisites

- A repository (or new project directory) initialized with Git
- One command that proves the current slice works (`npm test`, `npm run build`, or a focused smoke script)
- Optional: [GitHub Spec Kit](https://github.github.com/spec-kit/quickstart.html) (`specify init` and agent slash-commands/skills per current official docs)

## Steps

1. **Capture the slice in five lines:** target user, concrete pain, observable success signal, explicit non-goals, and timebox.
2. **Write stranger-testable acceptance checks:** concrete URLs, CLI exit codes, or named test cases—never subjective adjectives like “clean” or “modern.”
3. **Freeze interfaces for this slice:** routes, schema fields, and directories that must **not** drift during implementation.
4. **Run a structured specify → plan → tasks pass.** Using GitHub Spec Kit (or plain Markdown files in `specs/`), establish project boundaries once, clarify ambiguities before planning, and break the plan into ordered tasks before calling [Claude Code](/en/articles/claude-code/), [Codex](/en/articles/codex/), or [Grok Build](/en/articles/grok-build/).
5. **Optional pre-spec brain dump (unverified community tip):** when an idea is still rough, talk or type raw notes into a reasoning chat and ask it to draft a structured technical spec (data flow, edge cases, file tree, acceptance checks)—then **edit that draft yourself** before handing it to a coding agent.
6. **Frame the coding prompt with four concrete fields** (what to build, what finished looks like, how to verify it is done, and what must never be done) rather than filler phrases like *“think carefully step by step.”*
7. **Execute one task at a time.** Forbid drive-by refactors in both your prompt and your project rules ([Rules files + hooks](/en/articles/rules-hooks/)).
8. **Verify, then commit.** If the verify command fails, either fix the defect within scope or revert and refine the spec—never pile new features onto a broken build.

> [!NOTE] Evidence boundary on sources
> The `specify → plan → tasks → implement` workflow is **documentation-backed** via GitHub’s official Spec Kit quickstart. Social star counts, the voice-to-spec pre-pass, and the four-field prompt framing come from briefing-linked X posts—treat any productivity multipliers as **poster-claimed and unverified** until you test them on your own repository.

> [!NOTE] Adapt repository-specific examples
> `site/`, the `npm run check` script, and the `ops/` paths below belong to OPC Vibe Stack. In another project, inspect its README and available scripts before replacing them. For this repository’s full test suite, use its Linux CI environment; the deployment example requires GNU tools and `flock`. A skipped platform test is not a deployment pass.

## Copy-pasteable templates

### 1. Slice specification (`specs/001-slice.md` — blank + filled example)

```markdown
# Slice Spec: [Short name]

- **User & pain:**
- **Success signal (observable):**
- **Non-goals / hard don'ts:**
- **Interfaces frozen (routes / schemas / files in scope):**
- **Verify command:**

## Acceptance checks
- [ ] Check 1:
- [ ] Check 2:

---
# Filled mini-example: Static article search index
- **User & pain:** Readers on /en/ cannot find guides by tag without clicking every section.
- **Success signal:** Static `/en/search-index.json` emits published EN articles only; client input filters by title/tag.
- **Non-goals / hard don'ts:** No external search SaaS, no draft/deprecated leaks, browsing still works without JS.
- **Interfaces frozen:** `site/src/pages/en/search-index.json.ts`, `site/src/components/SearchControl.astro`, `site/tests/search.test.mjs`.
- **Verify command:** `cd site && npm run check && npm test && npm run build`
```

### 2. Four-field agent handoff prompt

```text
1. Task to complete:
   Implement task #1 from specs/001-slice.md ([one-sentence summary]).

2. What the finished result looks like:
   - [Exact route, CLI output, or test assertion that will exist]
   - Only these files are created or modified: [file list]

3. How to know it is done:
   `cd site && npm run check && npm test && npm run build` exits 0 with zero new warnings.

4. What must NEVER be done:
   - Do not install new npm dependencies
   - Do not modify files outside the scoped list or weaken existing tests
   - Stop and ask if a requirement in specs/001-slice.md conflicts with existing types
```

## Definition of done

- [ ] A written spec artifact (`specs/...` or Spec Kit output) exists before any agent edits application code
- [ ] Every acceptance item can be checked objectively via a test, build gate, or concrete UI action
- [ ] Forbidden paths and non-goals are stated explicitly in the handoff prompt
- [ ] Your verify command passes (`exit 0`) on the resulting diff before you move to the next slice

## Anti-patterns

- **Prompting “make it better” with zero acceptance checks** — invites cosmetic churn and silent regressions.
- **Letting the agent invent new routes or schema fields mid-flight** — pause, update the spec intentionally, and re-run validation.
- **Dumping a raw 2,000-word brainstorm straight into a repo agent** — separate messy exploration from bounded repository execution.
- **Equating GitHub star velocity with fit for a solo company** — adopt only the lightest spec ceremony that keeps your diffs green.
