---
title: "Google Antigravity"
seoTitle: "Google Antigravity: Browser-Check a Buyer Path"
subtitle: "Agent workflow for planning one page change, testing it in a browser, and keeping a reviewable walkthrough"
slug: antigravity
summary: "Google’s agent app and CLI, used here to plan one buyer-facing change, test the path in a browser, and keep a walkthrough you can review."
locale: en
category: stack
stage: sell
tools: [antigravity]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Google Antigravity App v2.30.0+ (built-in browser agent for personal Google Accounts) and Antigravity CLI (agy) with /browser; checked against the official docs and App v2.34.0 changelog on 2026-11-22. Confirm availability for your plan and account type"
published: "2026-11-22"
updated: "2026-11-23"
internalBriefing:
  - date: "2026-11-19"
    note: "Gemini 4 Neon and Orchestrator in Antigravity; shared AGENTS.md caution"
  - date: "2026-11-20"
    note: "Antigravity 2.34.0 changelog"
  - date: "2026-11-23"
    note: "Restored all official App permission presets; labeled official fact vs editorial recommendation; distinguished the CLI execution mode from its command approval policy"
publicSources:
  - title: "Google Antigravity docs: Get started"
    url: "https://antigravity.google/docs/getting-started/"
    kind: docs
  - title: "Google Antigravity docs: Browser use"
    url: "https://antigravity.google/docs/browser/"
    kind: docs
  - title: "Google Antigravity docs: Browser command (/browser)"
    url: "https://antigravity.google/docs/commands/browser/"
    kind: docs
  - title: "Google Antigravity docs: Implementation plan"
    url: "https://antigravity.google/docs/implementation-plan/"
    kind: docs
  - title: "Google Antigravity docs: Walkthrough"
    url: "https://antigravity.google/docs/walkthrough/"
    kind: docs
  - title: "Google Antigravity docs: Agent permissions"
    url: "https://antigravity.google/docs/permissions/"
    kind: docs
  - title: "Google Antigravity docs: Rules"
    url: "https://antigravity.google/docs/rules/"
    kind: docs
  - title: "Google Antigravity docs: Choose a model"
    url: "https://antigravity.google/docs/models/"
    kind: docs
  - title: "Google Antigravity changelog"
    url: "https://antigravity.google/docs/changelog/"
    kind: docs
tags: [stack, sell, browser, launch]
toolId: antigravity
toolAvailability: active
bestFor: "Checking one buyer-facing change in a real browser and keeping a plan, walkthrough, and screenshots for review."
poorFit: "Treating an agent’s browser report as a deployment or a cold-visitor test; workspaces where browser actions can’t be watched or stopped."
caveats: "Browser features differ by surface, account type, and version. The sell-stage role is this site’s workflow choice, not a vendor ranking."
---

## Conclusion

Google Antigravity is an agent app, CLI (`agy`), and set of editor extensions. This guide uses it for one sell-stage job: plan a small change to a buyer-facing page, have the agent test the path in a browser, and keep the plan, walkthrough, and screenshots as evidence you review. That role is an **editorial choice**. Claude Code or Codex can make the same page change, and the agent’s browser report does not replace your own check of the deployed page.

## First run: check one page and its main CTA

**Start with:** a repository whose landing or pricing page already runs locally, the primary call to action (CTA: the button or link that starts the buyer’s task), and the project’s build command.

1. Install the App or the CLI from the [official getting-started guide](https://antigravity.google/docs/getting-started/) and sign in. Open the project folder and confirm the workspace trust prompt only for a repository you intend to trust.
2. Ask for a plan before edits. In Planning mode, or with `/plan`, the agent writes an [implementation plan](https://antigravity.google/docs/implementation-plan/) and waits for your review. Comment on the plan to cut scope: no backend, authentication, dependency, or deployment changes.
3. After the change, run the build yourself, start the local preview, and ask the agent to check the page in a browser: desktop and 390px width, click the CTA, complete the intended action, and report console errors and failed network requests.
4. Read the [walkthrough](https://antigravity.google/docs/walkthrough/) the agent writes when it finishes. Ask it to embed the screenshots it took. Repeat the CTA click yourself in a fresh browser session.

**Keep:** the reviewed plan, the diff, the walkthrough with screenshots, and your own pass/fail line for the CTA. If the built-in browser isn’t available on your account, use `/browser` with Chrome (see Prerequisites) or test by hand. Neither path deploys anything.

> [!FLOW] Plan-to-evidence loop for one buyer path
> 1. **Plan first** — Review the implementation plan and cut anything outside the page and its CTA.
> 2. **Change one page** — Approve a small copy or layout diff; run the project’s build yourself.
> 3. **Browse the preview** — Have the agent check desktop and 390px, the CTA, the console, and failed requests.
> 4. **Review the evidence** — Read the walkthrough and screenshots, then repeat the CTA click yourself.

## Where it fits in the stack

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="Checking the path a buyer takes">
    <img class="theme-diagram__light" src="/illustrations/antigravity/overview.light.svg" alt="" data-decorative="true" width="420" height="580" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/antigravity/overview.dark.svg" alt="" data-decorative="true" width="420" height="580" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>Checking the path a buyer takes</strong> Review the plan before edits, have the agent browse the local preview, read the walkthrough and screenshots, and keep deployment, DNS, and rollback under human control. An agent report is not a deploy.</figcaption>
</figure>

| Layer of work | Primary owner | Handoff artifact |
|---|---|---|
| Core logic, schemas, hooks, and regression tests | [Claude Code](/en/articles/claude-code/) / [Codex](/en/articles/codex/) | Green build and test commands |
| One buyer-facing page change and its browser check | **Google Antigravity** or your chosen repository agent | Reviewed plan + diff + walkthrough with screenshots |
| Recorded walkthrough and launch checklist | Human + [Ship & demo checklist](/en/articles/ship-demo-checklist/) | Your own recording and mobile smoke record |
| Credentials, DNS/CDN, production deploy, rollback | **Human founder** | Verified probes and a rollback target |

## What the docs say (official facts)

| Capability | Where it is documented | Conditions |
|---|---|---|
| Built-in browser agent starts from a plain-language request | [Browser use](https://antigravity.google/docs/browser/) | Antigravity App v2.30.0+, rolling out to personal Google Accounts (Free, Plus, Google AI Pro, Ultra). Not yet for business or enterprise accounts, Remote Agents, or SSH windows |
| `/browser` subagent on your own Chrome | [Browser command](https://antigravity.google/docs/commands/browser/) | CLI, Antigravity IDE v2.6.0+, and business/enterprise App accounts. Chrome v144+ must already run on the same machine with remote debugging allowed; the CLI and IDE also need Node.js (`npx`) |
| Watch, stop, and take over an agent tab; sign-in handoff | [Browser use](https://antigravity.google/docs/browser/) | App built-in browser. The agent pauses at sign-in, MFA, passkey, or CAPTCHA and waits for you |
| Allow / Ask / Deny rules for sites the browser subagent may open | [Browser use](https://antigravity.google/docs/browser/) | Settings > Browser > Browser Actuation Rules |
| Implementation plan waits for review | [Implementation plan](https://antigravity.google/docs/implementation-plan/) | App and IDE extensions; `/plan` always stops for approval |
| Walkthrough after implementation, with screenshots on request | [Walkthrough](https://antigravity.google/docs/walkthrough/) | App and IDE extensions. Browser recordings are optional and not guaranteed |
| App permission presets: Request Review, Default, Auto, Turbo | [Agent permissions](https://antigravity.google/docs/permissions/) | Default: terminal commands run in the sandbox (workspace and temp dirs, no network); running outside it prompts for approval unless an existing rule allows the command. Auto: same sandbox, but a command judged safe and reversible can run outside it without a prompt. Request Review: sandbox off, always ask for terminal commands, workspace-only file access. Turbo: unrestricted commands and full filesystem access. Configured allow, deny, and ask rules take precedence over the preset. |
| `AGENTS.md` / `GEMINI.md` and `.agents/rules/` are loaded as rules | [Rules](https://antigravity.google/docs/rules/) | Loaded from the workspace folder up to the repository root, not from subfolders below it; 24,000 bytes per file |

## Prerequisites

- Install the App or CLI and sign in using the [official guide](https://antigravity.google/docs/getting-started/). In the App, **Settings > Browser** shows which browser backend your account uses.
- A local preview command and a build command for the page you are changing
- A shared `AGENTS.md` with exact commands and boundaries (see [Rules files + hooks](/en/articles/rules-hooks/))
- With the built-in App browser, a plain-language request or `/browser` uses the side panel directly. Only the Chrome DevTools path needs Chrome v144+ running locally with remote debugging enabled at `chrome://inspect/#remote-debugging`. The CLI and IDE also need Node.js (`npx`) on your `PATH`.

## Steps

1. **Check who approves terminal commands.** Official fact ([permissions](https://antigravity.google/docs/permissions/)): The App has a permission preset picker. In the CLI, version 1.5.7+ starts in `auto` where available and in `default` otherwise, unless you choose a different mode. In `auto`, a command judged safe and reversible can run outside the sandbox without a prompt. In CLI `default` mode, the `toolPermission` setting controls shell command approval and defaults to `request-review`. Explicit allow, deny, and ask rules take precedence. Editorial recommendation: in the App, use **Default** for this task when the sandbox is available. For individual command review in the CLI, select `default` in `/config`, confirm that `toolPermission` is set to `request-review`, and check which commands your rules already allow.
2. **Reuse your existing `AGENTS.md`.** Antigravity loads it as an always-on rule, and also loads `GEMINI.md` and `.agents/rules/*.md`. Keep instructions tool-neutral. Editorial recommendation: put tool-specific notes in that tool’s own file instead of writing “if you are tool X” branches in a shared file. One user reported a project stalling on such a line; we have not reproduced it.
3. **Plan, then comment.** Use `/plan` or Planning mode, and comment on the [implementation plan](https://antigravity.google/docs/implementation-plan/) until it touches only the page, its styles, and its CTA.
4. **Run the build yourself.** Use the project’s own build and preview commands. A browser pass on a stale dev server proves nothing about the release build.
5. **Give the browser check a script.** Name the URL, the viewport widths, the CTA, the expected end state, and one failure or empty state. Ask for console errors and failed network requests. Restrict sites the subagent may open with Browser Actuation Rules.
6. **Review the walkthrough like a pull request.** Check each screenshot against the step it claims to show. If the agent signed in somewhere, confirm which account it used.
7. **Choose models by plan, not by default.** Official fact ([models](https://antigravity.google/docs/models/)): Gemini 4 Neon isn’t available on Free and Plus plans. Orchestrator, which plans with one model and hands steps to a faster one, can use a Neon planner on Google AI Pro and Ultra; on Gemini Enterprise it pairs Gemini 4 Carbon with Gemini 4 Hydrogen. This site has not compared model quality or cost.

> [!NOTE] What this guide does not test
> We have not run Antigravity on this repository for this update. All tool behavior above comes from the official docs opened on 2026-11-22. Browser features are rolling out by account type and version, so App users should check **Settings > Browser** before planning a browser task.

## Starter templates

### Browser check request

```text
Start the preview with: <your preview command>
Open: http://localhost:<port>/<page>
Check at desktop width and at 390px:
1. The headline and the primary CTA are visible without scrolling on desktop.
2. Click the CTA and complete: <intended action>. Expected end state: <what success looks like>.
3. Try one failure or empty state: <e.g. submit the form empty>. Expected: <message>.
Report console errors and failed network requests.
Do not change backend, auth, dependencies, or deployment files.
Put screenshots of each step in the walkthrough.
```

### Pass/fail line you keep

```text
Date / commit:
Page + CTA:
Agent walkthrough reviewed (yes/no):
My own CTA click in a fresh session (pass/fail):
Open issues:
```

## Definition of done

- [ ] The implementation plan was reviewed and limited to the page, its styles, and its CTA
- [ ] The project’s own build command passed, run by you
- [ ] The walkthrough includes screenshots for desktop and 390px, the CTA end state, and one failure or empty state
- [ ] You repeated the CTA click yourself in a fresh browser session
- [ ] Deployment, DNS, credentials, and rollback stayed outside the agent session

## Anti-patterns

- **Switching the App to Turbo to make prompts go away** — it removes the terminal sandbox and allows full filesystem access; add specific allow rules instead.
- **Counting the agent’s browser pass as a launch check** — it ran against a local preview in the agent’s browser profile; a cold visitor on the deployed URL is a separate test.
- **Letting the browser subagent sign in to production admin consoles** — keep it to local previews and staging; sign-in handoff means you are granting that session access.
