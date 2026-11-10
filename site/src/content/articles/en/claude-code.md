---
title: "Claude Code"
slug: claude-code
summary: "Interactive, repo-aware coding agent for plan-first refactors, verification loops, and enforceable hooks."
locale: en
category: stack
stage: build
tools: [claude-code]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code CLI/agent (Anthropic); confirm current commands and hook schema against live vendor docs"
updated: "2026-11-10"
internalBriefing: []
publicSources:
  - title: "Claude Code overview"
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
    kind: docs
  - title: "Automate actions with hooks (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks-guide"
    kind: docs
  - title: "How Claude remembers your project (CLAUDE.md, AGENTS.md, imports)"
    url: "https://code.claude.com/docs/en/memory"
    kind: docs
  - title: "Configure permissions (Claude Code)"
    url: "https://code.claude.com/docs/en/permissions"
    kind: docs
  - title: "Extend Claude with skills (SKILL.md)"
    url: "https://code.claude.com/docs/en/skills"
    kind: docs
  - title: "Claude Code quickstart"
    url: "https://code.claude.com/docs/en/quickstart"
    kind: docs
tags: [stack, build, hooks, workflow]
toolId: claude-code
toolAvailability: active
bestFor: "Repo-local agent loops, plan-then-implement sessions, and rules/hooks enforcement."
poorFit: "Blind one-shot generation without a verification command; treating chat memory as policy."
caveats: "Keep secrets out of prompts; encode hard no-gos in permission rules and hooks, not prose."
---

## Conclusion

Use **Claude Code** as your primary interactive repository agent whenever a change spans multiple files, needs codebase exploration before editing, or needs lifecycle hooks: `PreToolUse` to reject a call before it executes, `PostToolUse` for checks after it has run, and `Stop` to check completion conditions.

## First run: one small repository change

**Use this when:** you have a repository and a specific bug or behavior change. Keep existing work on its own branch or save it before starting; do not reset a dirty worktree to follow this guide.

1. Install using the [official quickstart](https://code.claude.com/docs/en/quickstart), then run `claude --version` in a new terminal. Open your repository and run `claude`; finish the documented sign-in flow.
2. Ask: “Read the project instructions and README. Identify the affected files and the existing verification command. Do not edit yet.” Compare its answer with the actual scripts or test configuration.
3. Run that command yourself to capture the baseline. If it already fails, record the failure before asking for a change.
4. Use the scoped prompt below for **one** behavior. Ask for the changed files, exact commands run, exit results, and anything untested.

**Keep:** the task brief, focused diff, and verification output. For a UI change, also perform the named user action in the rendered app. If scope expands or a check fails, stop adding features and resolve that issue within the slice. A successful agent reply alone is not acceptance.

> [!FLOW] Repo-local session loop
> 1. **Frame & plan** — State the slice goal, file boundaries, and verify command; ask for a plan first.
> 2. **Approve scope** — Trim out-of-scope refactors before any file is edited.
> 3. **Implement & verify** — Let the agent edit and iterate until your verify command exits `0`.
> 4. **Codify lessons** — Promote repeated corrections to `CLAUDE.md`, `SKILL.md`, or a blocking hook.

## When to pick Claude Code vs hand off

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="Hook timing at a glance">
    <img class="theme-diagram__light" src="/illustrations/claude-code/overview.light.svg" alt="" data-decorative="true" width="420" height="556" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/claude-code/overview.dark.svg" alt="" data-decorative="true" width="420" height="556" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>Hook timing at a glance</strong> PreToolUse can reject a call before execution. PostToolUse checks an action after it succeeds. Stop checks completion conditions. Neither an after-the-fact check nor a completion check can reverse an earlier action.</figcaption>
</figure>

| Situation | Best owner | Why |
|---|---|---|
| Multi-file feature or refactor where couplings are unclear | **Claude Code** | Strong interactive exploration + plan-before-edit review loop |
| Batching several independent, tightly specified slices | [Codex](/en/articles/codex/) | Clean CLI task execution when boundaries and tests already exist |
| Turning a working build into a public offer & demo path | [Grok Build](/en/articles/grok-build/) | Keeps last-mile shipping and CTA smoke checks focused on buyers |
| Preventing edits to migrations, `.env`, or production configs | [Rules + hooks](/en/articles/rules-hooks/) | Prose instructions drift; hooks and CI fail forbidden actions deterministically |

## Prerequisites

- Official Claude Code installation authenticated via Anthropic’s documented login flow
- Git working tree clean enough to inspect `git diff` after a single task
- One fast, non-destructive verification command (for example `npm test`, `npm run check`, or a local smoke script)

## Steps

1. **Install and verify authentication** against the official Claude Code documentation—never paste raw API keys into project files or chat prompts.
2. **Create a concise project rules file** under ~80 lines (Anthropic's docs target under 200): state what the product is, the exact verify command, and hard forbidden paths. If you also run Codex, keep the rules in `AGENTS.md` and start `CLAUDE.md` with `@AGENTS.md` so both tools read one file. Put forbidden paths and commands in `permissions.deny` / `ask` in `.claude/settings.json` as well, since permission rules are enforced by Claude Code while `CLAUDE.md` text is only advice.
3. **Default to plan-first on multi-file work.** Ask the agent to inspect affected files and list proposed edits before touching disk; reject scope creep early while changes cost zero tokens to undo.
4. **Gate completion on your verify command.** Require the agent to run your test/typecheck/build command and report actual exit status rather than assuming edits work.
5. **Turn mistakes into durable guardrails.** If the agent touches a forbidden directory or repeats a bad pattern, add a concise rule or move the constraint into a lifecycle hook ([Rules files + hooks](/en/articles/rules-hooks/)) the same day.
6. **Reset context between unrelated slices.** Fresh context prevents stale assumptions from leaking into your next feature.

> [!NOTE] Adapt repository-specific examples
> `site/`, the `npm run check` script, and the `ops/` paths below belong to OPC Vibe Stack. In another project, inspect its README and available scripts before replacing them. For this repository’s full test suite, use its Linux CI environment; the deployment example requires GNU tools and `flock`. A skipped platform test is not a deployment pass.

## Starter templates

### Shared project `AGENTS.md` (adapt this repository-specific example)

```markdown
# Project Rules

## Product slice
Static Astro site + validated content collections. Run all commands from `site/`.

## Verification gate (must pass before done)
- Typecheck & tests: `npm run check && npm test`
- Full build gate: `npm run build`

## Hard boundaries (never touch without explicit approval)
- Never read, print, or commit `.env*`, SSH keys, or deploy credentials
- Never edit `ops/` production host targets or weaken `scripts/validate*.mjs`
- Do not add runtime dependencies for static copy or simple CSS problems

## Working style
- Propose a short file-by-file plan before editing >2 files
- Keep diffs focused on the requested slice; log follow-up ideas instead of refactoring unrelated files
```

Keep the shared rules above in `AGENTS.md`. If Claude Code also uses `CLAUDE.md`, start it with the following import rather than maintaining a second copy:

```markdown
@AGENTS.md
```

### Scoped plan-first prompt

```text
Task: Add [one concrete user-visible capability or fix].
In scope: [exact files/folders, e.g. site/src/components/SearchControl.astro, site/tests/search.test.mjs].
Out of scope / never do: Do not add dependencies, change route URLs, or modify unrelated styles.
Done when: [exact observable behavior] AND `npm run check && npm test && npm run build` exits 0.
First step: Inspect the files in scope and give me a 4-bullet implementation plan. Wait for approval before editing.
```

> [!WARNING] Prompt & secret hygiene
> Treat every prompt and connected MCP server as an untrusted boundary for credentials. Keep `.env` files gitignored, scope deploy keys outside agent-accessible shells, and review [Security quickcheck](/en/articles/security-quickcheck/) before installing third-party extensions or skill packs.

## Definition of done

- [ ] Claude Code is authenticated without hardcoded keys in the repository or shell history
- [ ] Project instructions name the actual quick check and full verification commands, with realistic runtime expectations
- [ ] Forbidden paths and secret boundaries are stated in rules and backed by hooks or CI checks
- [ ] Multi-file tasks start with an explicit plan check before code edits begin
- [ ] You review `git status` and `git diff` (especially lockfiles, auth, and deploy configs) before committing

## Anti-patterns

- **Pasting `.env` or live tokens into chat “just once”** — rotate immediately if exposed; inject secrets via gitignored local environment variables instead.
- **“Rewrite the whole module and make it cleaner”** — unbounded prompts produce massive, unreviewable diffs; slice by one verifiable behavior at a time ([Spec first](/en/articles/spec-first-agent-loop/)).
- **Stuffing 1,000 lines of prose into `CLAUDE.md`** — bloated always-on context dilutes critical rules; move task-specific playbooks into on-demand `SKILL.md` files.
