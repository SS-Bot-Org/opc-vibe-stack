---
title: "Weekly content-site refresh loop"
slug: weekly-content-site-refresh
summary: "A 90–120 minute Sunday loop: filter briefings, revise Markdown, validate, changelog, deploy—no invented news."
locale: en
category: playbook
stage: cross
tools: [claude-code, codex]
priority: P1
status: published
evidence: documentation-backed
applicableToolsVersions: "Astro static site + Markdown collections; agent CLI of choice; editorial gate per site SDD"
updated: "2026-11-06"
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

Keep a practice site current with a **timed weekly loop** (target **90–120 minutes**): filter briefing inputs, revise only executable pages, assign honest evidence labels, write a changelog with `affectedPages`, validate, and deploy an atomic release. Skip the week if nothing substantive survives the filter—do not invent filler.

## Timebox

| Step | Minutes | Gate |
|---|---|---|
| Filter & map | 15–25 | Only reusable OPC actions |
| Rewrite & sources | 30–45 | Steps + DoD + public permalinks |
| Evidence & notices | 10–15 | tested / documentation-backed / unverified |
| Changelog | 10–15 | Real `affectedPages` in this revision |
| Validate & deploy | 15–25 | Build green; smoke probes |
| Private record | 5 | Release record outside `dist/` |

If the filter yields nothing, stop after step 1 and record “no update” privately.

## Prerequisites

- A Markdown/MDX content site with schema validation (this site uses Astro collections)
- Weekly briefing or digest inputs (treated as untrusted until verified)
- Deploy path that stages a release directory and flips a symlink (no live-dir rsync)
- SSH or CI identity scoped to the site files

## Toolchain

1. **Human / editor:** Filter claims; open original sources; assign evidence.
2. **Claude Code or Codex:** Apply Markdown edits, run `npm run build`, fix validation errors.
3. **Host:** Nginx serves `/srv/.../current`; rollback = previous symlink.

## Steps

1. **Filter:** From the week’s Vibe Coding notes, keep only items that change an executable checklist, stack card, playbook, or alert. Drop pure news and hot takes.
2. **Map:** For each keeper, choose revise-existing vs new page. Prefer revising.
3. **Rewrite:** Conclusion → prerequisites → steps → template fields → definition of done → anti-patterns. Preserve claim qualifiers.
4. **Verify sources:** Open each public URL. No invented X links. If unread, leave as draft or drop the claim.
5. **Evidence:** Label the page with the least-assured accurate label. Split mixed-evidence sections if needed.
6. **Changelog:** One weekly entry (`YYYY-wNN`) with nonempty `changes[]`, each with `affectedPages` that exist in **this** revision.
7. **Validate:** `npm run validate && npm run build` (or project equivalent). Fix until green.
8. **Deploy:** Upload to `releases/<id>/`, checksum, atomic `current` flip. Smoke home, changed article, changelog, deliberate 404.
9. **Record:** Private release record (revision, paths, result). Feedback note for next briefing focus.

## Template fields

- Briefing date range:
- Keepers / rejects:
- Changed slugs:
- Changelog slug:
- Release id:
- Elapsed minutes:

## Definition of done

Either (a) a published changelog entry with substantive `changes[]` and green smoke checks, or (b) a private “no update” note with filter rationale—never a fake dated refresh.

## Anti-patterns

- Publishing unread citations
- Counting wording-only tweaks as substantive changes
- Deploying without changelog when guidance changed
- Skipping rollback rehearsal forever

## Sources

See frontmatter `publicSources`. Companion pages: [Rules & hooks](/en/articles/rules-hooks/), [Security quickcheck](/en/articles/security-quickcheck/), [Changelog](/en/changelog/).
