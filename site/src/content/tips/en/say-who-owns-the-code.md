---
title: Say who owns the code
slug: say-who-owns-the-code
summary: Tell Claude Fable 5.2 the codebase is its own when you want it to consolidate duplicated code.
locale: en
tools:
  - claude-fable
appliesTo: Claude Fable 5.2, in a system prompt or agent harness. This is model guidance, not limited to Claude Code.
tags:
  - prompt
  - ownership
evidence: documentation-backed
wording: You are the owner and long-term maintainer of this codebase, and its design is up to you.
wordingLang: text
effect: In Anthropic's testing on small coding tasks, Claude Fable 5.2 tended to add to the existing structure—even when that duplicated existing code—when the prompt said nothing about ownership or presented the codebase as someone else's. When the prompt said the codebase was the model's own, it often consolidated duplicated code and sometimes made related fixes without being asked. On those small coding tasks, Anthropic reported consolidation in under 10 percent of runs without the sentence and in about 75 percent of runs with it.
limits: "These figures are Anthropic's, on small coding tasks; this site did not re-run them. With this prompt, output tokens rose by about 70 to 80 percent, and the model made changes nobody had asked for, many of them new tests and documentation. In some runs, it also changed how an existing feature behaves. A rule that limits scope does not cancel the effect: in Anthropic's testing, the model still consolidated duplicated code in more than half of runs when \"No drive-by refactors, renames or cleanups\" appeared earlier in the same prompt. Leave the sentence out when the user owns the code and wants the smallest possible change. Review the reported diff as well as any pull-request summary, which often left out small changes. Simon Willison's 2026-11-10 post is the discovery source and quoted an earlier published wording of this section (\"This codebase is yours: what it's for and how it's built are your call, and you'll keep building on it.\") with earlier figures (about half of tries with the sentence, under a tenth without; the result held inside a long system prompt). The copyable sentence and figures above are from the official guide as opened on 2026-11-16."
officialSource: &a1
  title: "Anthropic, Prompting Claude Fable 5.2: Say who owns the code"
  url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2#say-who-owns-the-code
  kind: docs
discoverySource: &a2
  title: Simon Willison, 2026-11-10
  url: https://x.com/simonw/status/2120029347948220500
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-16"
status: active
internalBriefing: []
publicSources:
  - *a1
  - *a2
---
