# Verification boundaries

From `site/`, Node ≥22.23.4:

```sh
npm ci
npm run check
npm test
npm run build
```

`content-schema.mjs` is the shared schema used by the preflight inventory and Astro. Preflight parses YAML (including quotes/flow arrays), checks conditional metadata and duplicate IDs before Astro can deduplicate. `inventory.mjs` supplies the set of real published localized HTML routes to sitemap and alternate-language navigation. Drafts and deprecated articles are excluded from that inventory; deprecated article output is retained with noindex. Missing Chinese translations get a noindex fallback canonicalized to English. Search only lists published entries.

The build's final gate parses generated HTML and checks same-origin links/anchors against files actually in `dist`, then checks parsed changelog targets and sitemap equality. It does not crawl external links, execute page scripts, check arbitrary text URLs, or replace editorial source review. Remove or repair inbound links when removing a route; the gate intentionally fails rather than inventing a target. Anchors on fallback translations must actually exist in the fallback output.

Content regressions modify isolated temporary copies, symlink the installed dependencies, run **full npm run build**, and assert nonzero exit plus the correct diagnostic. The draft-translation fixture also checks generated fallback noindex/canonical/hreflang, sitemap exclusion, and search exclusion. They never modify the real content or old production checkout. Search regressions exercise the async controller used by the real component, not a duplicate implementation. Deployment tests exercise only the example helper against local fixtures, never an actual server.

Manual acceptance still required: view at 390×844 and desktop; check header size, native disclosure behavior with/without JS, search opening/Tab/ArrowDown/Escape/outside click, screen-reader live announcements, theme persistence and language switching. Static tests and typecheck are not a browser or assistive-technology audit. Do not claim these visual checks or a production deployment have happened based on these tests.
