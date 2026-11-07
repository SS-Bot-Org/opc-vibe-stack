# Option 3 implementation QA

Date: 2026-11-07

final result: passed

## Scope and visual targets

- Homepage: `output/imagegen/2026-11-07-ui-mockups/03-stack-desk.png` (1487 × 1058).
- Article opening: `output/imagegen/2026-11-07-ui-mockups/04-stack-desk-article-opening.png` (1486 × 1058).
- Code-reading style: `output/imagegen/2026-11-07-ui-mockups/05-stack-desk-article-code.png`.
- Local implementation: `http://127.0.0.1:4321/en/` and the English/Chinese 48-hour MVP articles.
- Comparison viewport: 1487 × 1058 CSS pixels, devicePixelRatio 1. The browser screenshot exporter returned 1472 × 1047 images. Full comparison pairs normalize both sides to 744 × 529; focused comparisons normalize to the target frame before cropping. Left is the mockup; right is the implementation.

## Final visual evidence

- `output/ui-qa/home-desktop-light-final.jpg`
- `output/ui-qa/home-desktop-dark-final.jpg`
- `output/ui-qa/article-desktop-light-final.jpg`
- `output/ui-qa/article-desktop-dark-code-final.jpg`
- Full comparisons: `output/ui-qa/home-comparison-final.jpg`, `output/ui-qa/article-comparison-final.jpg`.
- Focused typography/table comparisons: `output/ui-qa/home-detail-comparison-final.jpg`, `output/ui-qa/article-detail-comparison-final.jpg`.
- Mobile: `output/ui-qa/home-mobile-light-v2.jpg` (390 CSS px), `output/ui-qa/home-mobile-320-zh-dark.jpg` (320 CSS px), `output/ui-qa/article-mobile-zh-light.jpg`, `output/ui-qa/article-mobile-zh-dark-table-v3.jpg`.
- Tablet: `output/ui-qa/stack-tablet-dark-v2.jpg` (1024 × 900 CSS px).

## Findings and corrections

1. P2, corrected: the first desktop render used undersized navigation and comparison text. Increased desktop type sizes and reviewed the final full-view and focused comparisons. The sidebar, search, table hierarchy, and playbook callout now follow the selected direction.
2. P2, corrected: Markdown tables initially shrank to their intrinsic width. Added a build-time scroll container, retaining full reading-column width on desktop and local keyboard/touch scrolling on mobile. The rendered desktop article table and reading column both measure 858 CSS px.
3. P2, corrected: desktop table column widths carried into mobile rows and split short tool names unnecessarily. Overrode the mobile row-heading width; verified the corrected English and Chinese mobile views.
4. P2, corrected: collapsing the mobile contents disclosure could prevent the anchor destination from being reached. Explicitly scroll and focus the heading after collapse, preserving URL history and modifier-click behavior. Verified the Chinese timebox heading at y=160.2 below a 123.9 px header, contents closed, focus on the heading, and the matching active contents link. Desktop worked-example navigation lands at y=112 below the 88 px header.
5. P2, corrected: the six-column comparison became too narrow at tablet widths. Added a minimum table width and a labeled, keyboard-focusable scroll region. Verified table-only overflow with no page overflow.

No remaining actionable P0/P1/P2 visual findings in the checked routes and states.

## Fidelity and intentional differences

- Typography: system sans-serif follows the selected reference hierarchy; monospace is reserved for code and small code metadata. Actual source copy produces different line breaks from the generated mockup.
- Layout: persistent desktop rail, shared search/theme/language toolbar, open comparison rows, one pale-blue playbook feature, and an article contents rail. Mobile navigation flows below the toolbar; article contents becomes a native disclosure.
- Colors: warm neutral/light palette and restrained blue accents follow option 3. Dark tokens cover navigation, text, tables, evidence, search, and syntax highlighting without bright decorative effects.
- Assets: the design uses a text wordmark and locally stored Tabler outline icons with their MIT license. No raster assets were needed in the implementation.
- Content: canonical tool descriptions, full article text, applicability caveats, source links, and evidence status are preserved. The actual changelog title/date replace the mockup's abbreviated copy. The article keeps its full task brief and command rather than the mockup's condensed example. Evidence labels retain their explanatory tooltip and semantic styling.

## Verification

- `npm run check`: 0 errors, 0 warnings, 0 hints across 63 files.
- 17 relevant Node tests passed: content/rendering, search, header behavior, and article-table transformation. Added coverage for mobile Escape/focus return, localized contents targets, and preserving escaped code/links during table wrapping.
- `npm run build`: passed; 42 HTML pages and 40 sitemap routes validated, including internal links and anchors.
- `git diff --check`: passed.
- Browser: English and Chinese navigation, search results, search/menu coexistence, keyboard table scrolling, article contents/focus, code copy (clipboard text matched the source command), and theme persistence across navigation passed.
- Checked 320, 390, 1024, and 1487 CSS-pixel widths without page-level horizontal overflow. Both light and dark states were inspected. Native theme clicks preserve article scroll position.
- Browser warning/error log was empty for the checked session.
- No-JS navigation and article-table access were checked in generated HTML and regression tests; browser JavaScript was not disabled during visual checks.

## Remaining environment limitation

The full `npm test` invocation also includes an unchanged Linux deployment-example fixture. It fails with exit 64 on this macOS host: the fixture uses the task temporary path containing `.tmp`, which the deployment helper's root-path restriction rejects; `flock` is also unavailable. Deployment scripts were not modified. This does not affect the static-site build or the passing UI/content tests.

## Delivery

The local preview is running on port 4321 and retained in the in-app browser. Source changes are uncommitted. The pre-existing root `AGENTS.md` and earlier mockup outputs were preserved.
