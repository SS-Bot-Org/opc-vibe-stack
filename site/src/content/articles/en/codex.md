---
title: "Codex"
seoTitle: "Codex: From Task Specs to Verifiable Code Changes"
subtitle: "Spec-driven CLI agent for scoped slices, batchable edits, and clean diffs"
slug: codex
summary: "OpenAI’s spec-driven coding agent and CLI for scoped repository slices, batchable edits, and clean diffs."
locale: en
category: stack
stage: build
tools: [codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "OpenAI Codex CLI/agent; confirm current CLI flags and config.toml keys against official OpenAI docs"
published: "2026-11-06"
updated: "2026-11-10"
internalBriefing: []
publicSources:
  - title: "OpenAI Codex documentation"
    url: "https://developers.openai.com/codex"
    kind: docs
  - title: "Codex configuration reference (config.toml & mcp_servers)"
    url: "https://developers.openai.com/codex/config-reference"
    kind: docs
  - title: "Codex CLI setup"
    url: "https://learn.chatgpt.com/docs/codex/cli"
    kind: docs
tags: [stack, build, cli, workflow]
toolId: codex
toolAvailability: active
bestFor: "Spec-driven coding tasks, batchable edits, and CLI-centered workflows."
poorFit: "Vague product ideas with no acceptance tests; skipping human review on security-sensitive diffs."
caveats: "Product surfaces evolve; pin docs links and re-check commands after upgrades."
---

## Conclusion

Reach for **Codex** when you already have a written task boundary—inputs, files in scope, acceptance checks, and a verify command—and want a disciplined CLI/agent run that turns that spec into a focused, reviewable diff.

## First run: a task you can accept or reject

**Start with:** an existing repository, one reproducible issue, and a check that distinguishes failure from success. You do not need several agents or MCP servers for this exercise.

1. Use the [official Codex CLI setup](https://learn.chatgpt.com/docs/codex/cli), or select this repository in the desktop app. For the CLI, run `codex` from the repository directory after installation and sign-in.
2. Ask Codex to identify the project instructions, relevant files, and existing tests before editing. Confirm that it is working in the intended repository.
3. Supply the four-part task brief below and capture the failing behavior first. For example, a search that returns drafts should get a regression check asserting that drafts are absent.
4. Review the diff and rerun the exact check. Test the original input plus one empty or invalid input; record expected and actual results.

**Accept when:** the reproduction passes, unrelated behavior remains intact, and all changed paths fit the brief. If a dependency, schema, or permission change becomes necessary, reassess the scope before continuing. When running independent tasks, use separate branches/worktrees; “parallel-safe” does not mean two agents should edit one checkout concurrently.

> [!FLOW] Spec-to-diff execution loop
> 1. **Write task brief** — Pin exact target behavior, allowed files, and verify command.
> 2. **Run one slice** — Execute Codex on a single bounded task with clean Git state.
> 3. **Gate on verify** — Require tests, typecheck, and build checks to pass locally.
> 4. **Audit sensitive diffs** — Inspect lockfiles, auth, schemas, and deploy scripts before merge.

## Parallel vs sequential task split

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="A map of task boundaries">
    <img class="theme-diagram__light" src="/illustrations/codex/overview.light.svg" alt="" data-decorative="true" width="420" height="586" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/codex/overview.dark.svg" alt="" data-decorative="true" width="420" height="586" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>A map of task boundaries</strong> Independent bugfixes and content slices can proceed in parallel when their files do not overlap. Shared schema and dependency changes stay sequential. Every path still needs verification and review of sensitive diffs.</figcaption>
</figure>

Use independent tasks only when their file ownership and acceptance checks are clear. Shared files still require coordination; parallel execution is not an automatic speedup.

| Slice type | Run mode | Why |
|---|---|---|
| Isolated bugfix + regression test in one module | **Parallel-safe** | Self-contained files and deterministic test failure/pass signal |
| Bilingual content parity check or new article draft | **Parallel-safe** | Disjoint content paths validated by `npm run validate` |
| Shared schema (`content-schema.mjs`) or route helper edits | **Sequential only** | Touches contracts every downstream page depends on |
| Dependency upgrades (`package.json` / `package-lock.json`) | **Sequential + human gate** | Lockfile churn conflicts easily and carries supply-chain risk |
| Auth, billing, SSH, or deployment scripts (`ops/`) | **Sequential + strict audit** | High blast radius; never merge unattended |

## Prerequisites

- Current OpenAI Codex CLI or documented agent surface installed and authenticated per official docs
- `AGENTS.md` in the repository root (or target workspace directory) listing build, test, and style rules
- A runnable verification command that exits nonzero on regressions

## Steps

1. **Verify CLI setup and `config.toml` against official docs.** Codex surfaces and flags evolve quickly; confirm current sandbox/approval modes and `[mcp_servers.*]` syntax in the [Codex configuration reference](https://developers.openai.com/codex/config-reference).
2. **Keep `AGENTS.md` operational, not philosophical.** Put exact working directory, Node/runtime requirements, build/test commands, and forbidden edits at the top where Codex reads them first.
3. **Hand Codex a four-part task brief** (goal, in-scope files, out-of-scope boundaries, verify command). If you cannot write the verify check yet, step back to [Spec first, then let the agent change code](/en/articles/spec-first-agent-loop/).
4. **Run one slice per session.** Clear or start a new session before switching to an unrelated problem so earlier file assumptions do not bleed across diffs.
5. **Review `git diff --stat` and security-sensitive lines** before committing—especially dependencies, environment handling, and build gates.

> [!NOTE] Adapt repository-specific examples
> `site/`, the `npm run check` script, and the `ops/` paths below belong to OPC Vibe Stack. In another project, inspect its README and available scripts before replacing them. For this repository’s full test suite, use its Linux CI environment; the deployment example requires GNU tools and `flock`. A skipped platform test is not a deployment pass.

## Starter templates

### Scoped Codex task brief (blank + filled example)

```text
# Blank template
Goal:
In scope:
Out of scope / hard don'ts:
Verify command:

# Filled OPC example
Goal: Reject changelog entries whose affectedPages point to draft-only translations.
In scope: site/scripts/validate-output.mjs, site/tests/content.test.mjs.
Out of scope / hard don'ts: Do not alter published Markdown articles, astro.config.mjs, or package.json.
Verify command: cd site && npm run check && npm test && npm run build
```

### High-signal `AGENTS.md` command header

```markdown
# Repository Guidelines

## Commands (run from `site/`, Node >= 22.23.4)
- `npm run validate` — Fast content & stack-card preflight
- `npm run check`    — Astro + TypeScript diagnostics
- `npm test`         — Node regression suite (`tests/*.test.mjs`)
- `npm run build`    — Full preflight + static build + HTML link/anchor gate

## Hard constraints
- Preserve matching slugs across `en` and `zh` translations
- Never fabricate source URLs or commit `.env` files / `dist/` output
- Keep JavaScript optional for core reading and navigation
```

> [!IMPORTANT] Lockfiles and MCP configs stay under human control
> Configure any shared MCP server directly in Codex’s own `~/.codex/config.toml` (or trusted project config) using `[mcp_servers.<name>]`—never copy raw JSON from another editor or commit API tokens into version control. See [Rules files + hooks](/en/articles/rules-hooks/).

## Definition of done

- [ ] Task brief specifies exact in-scope files, non-goals, and a runnable verify command
- [ ] Codex finishes with `npm run check`, `npm test`, and `npm run build` (or repo equivalent) exiting `0`
- [ ] Reviewed tracked and untracked paths; staged only intended files, excluding secrets and generated output while preserving pre-existing user work
- [ ] Any change to dependencies, schemas, auth, or deploy scripts has been read line-by-line by a human

## Anti-patterns

- **Bundling three unrelated features into one Codex run** — when one test fails, the agent tangles fixes across all three; split into atomic commits instead.
- **Blindly approving `package-lock.json` diffs** — agents occasionally swap or add unnecessary packages to silence a type error; reject unrequested dependencies.
- **Copying social-media CLI flags without checking current docs** — Codex CLI subcommands and config keys change across versions; always check `codex --help` and official docs first.
