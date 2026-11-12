---
slug: 2026-w46-seo-geo-review
date: "2026-11-10"
title: "SEO/GEO review: evidence wording, titles, and authorship"
summary: "Clarified evidence language and bilingual qualifiers, intent-clear titles, editorial byline, JSON-LD, sitemap lastmod, and build guardrails."
locale: en
status: published
changes:
  - type: revised
    text: "Relabeled unmeasured examples, aligned Chinese qualifiers with English, and expanded the pinned broken-link release-gate case."
    affectedPages:
      - /en/articles/spec-first-agent-loop/
      - /zh/articles/spec-first-agent-loop/
      - /en/articles/codex/
      - /zh/articles/codex/
      - /en/articles/claude-code/
      - /zh/articles/claude-code/
      - /en/articles/rules-hooks/
      - /zh/articles/rules-hooks/
      - /en/articles/48h-mvp-agent-stack/
      - /zh/articles/48h-mvp-agent-stack/
      - /en/articles/weekly-content-site-refresh/
      - /zh/articles/weekly-content-site-refresh/
      - /en/
      - /zh/
    evidence: documentation-backed
  - type: revised
    text: "Gave home, stack, and stage pages intent-clear titles; derived the stack title from current featured tools; and split Research, Build, and Sell into primary reading orders plus supplementary references."
    affectedPages:
      - /en/
      - /zh/
      - /en/stack/
      - /zh/stack/
      - /en/research/
      - /zh/research/
      - /en/build/
      - /zh/build/
      - /en/sell/
      - /zh/sell/
    evidence: documentation-backed
  - type: added
    text: "Added an editorial-team byline linked to About, a public GitHub Issues correction channel, visible first-published dates, Article and BreadcrumbList JSON-LD, sitemap lastmod from real update dates, and build checks for those contracts."
    affectedPages:
      - /en/about/
      - /zh/about/
      - /en/articles/claude-code/
      - /zh/articles/claude-code/
      - /en/articles/codex/
      - /zh/articles/codex/
      - /en/articles/grok-build/
      - /zh/articles/grok-build/
    evidence: documentation-backed
internalBriefing: []
publicSources:
  - title: "Google sitemap lastmod guidance"
    url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap"
    kind: docs
  - title: "Google Article structured data"
    url: "https://developers.google.com/search/docs/appearance/structured-data/article"
    kind: docs
---

This pass follows the 2026-11-10 full-site SEO/GEO review. Title changes are editorial intent, not validated keyword targets. The editorial byline names the maintaining team, not a biographical author. The nginx `www` / `index.html` redirects are documented in the repo and have not been applied to the live VPS.
