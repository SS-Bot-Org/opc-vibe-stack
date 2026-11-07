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

Manual acceptance still required: view at 390×844 and desktop; check header size, progressively enhanced Menu and native Search disclosure behavior with/without JS, search opening/Tab/ArrowDown/Escape/outside click, screen-reader live announcements, theme persistence and language switching. Static tests and typecheck are not a browser or assistive-technology audit. Do not claim these visual checks or a production deployment have happened based on these tests.

PR #2 interaction follow-up: content fixtures inspect the actual rendered switcher in both draft-translation directions (not just route inventory), canonical/hreflang/sitemap behavior, matching translated articles, sections and the 404 locale-home action. Header tests exercise the production enhancement controller with event targets and inspect actual rendered toolbar/menu separation; PostCSS checks the responsive flow/order contract. These are not browser geometry or hit-test measurements. At 390×844, manually open Menu, confirm it appears below the entire toolbar, then tap Search and verify the URL does not change. Open both independently, use keyboard toggles, check collapsed height and desktop resizing, and verify no-JS navigation remains reachable.

Article rendering follow-up: mixed task/plain Markdown lists deliberately retain native `ul`/`li` markup (including GFM's disabled checkbox markers); all-task lists keep the interactive checklist enhancement. Renderer tests inspect ordering, formatting, nested prose and links. An isolated full-build fixture checks the final EN/ZH article DOM for the same content without duplication. Hook documentation tests extract the actual bilingual Stop script/config, assert parity, and run only safe temporary npm check scripts: success, failure-to-exit-2, repeat-stop guard, malformed/wrong-event input and missing project paths. This verifies the example wrapper, not live Claude Code integration or filesystem access enforcement. Required CI remains independent of the Stop hook's anti-loop bypass.
