---
slug: 2026-w46-seo-geo-review
date: "2026-11-10"
title: "SEO/GEO 审阅：证据措辞、标题与作者信息"
summary: "澄清证据措辞与双语限定、补上意图明确的标题、编辑署名、JSON-LD、sitemap lastmod，以及对应的构建校验。"
locale: zh
status: published
changes:
  - type: revised
    text: "把未经测量的数字改标为示例，对齐中英文限定词，并补充已固定 commit 的坏链接发布门禁实例。"
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
    text: "为首页、工具栈和三个阶段栏目补上意图明确的标题；工具栈标题由当前主推工具生成；调研/构建/销售拆成主阅读顺序与补充参考。"
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
    text: "增加指向关于页的编辑团队署名、公开 GitHub Issues 纠错入口、可见的首次发布日期、Article 与 BreadcrumbList JSON-LD、基于真实更新日期的 sitemap lastmod，以及这些约定的构建校验。"
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

本次更新依据 2026 年 11 月 10 日的全站 SEO/GEO 审阅。标题调整是编辑对意图的表达，不是已验证的关键词目标。署名称的是维护团队，不是个人履历。仓库中的 nginx `www` / `index.html` 跳转示例尚未应用到线上 VPS。
