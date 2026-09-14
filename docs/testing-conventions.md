# Testing conventions

Tests protect public contracts. They are not a second implementation and they do not freeze incidental markup or styling.

These conventions apply the official guidance from [Angular component testing](https://angular.dev/guide/testing/components-basics), [Angular testing scenarios](https://angular.dev/guide/testing/components-scenarios), and [Playwright's best practices](https://playwright.dev/docs/best-practices). SUSHI-specific rules below narrow that guidance for a reusable component library.

## Choose the smallest test level

Use a unit test when Angular's test environment can observe the behavior reliably. Use Playwright only when the contract depends on a real browser: layout geometry, viewport changes, scrolling, native focus continuity, pointer drag/resize, overlay placement, or clipping.

Do not repeat the same contract at both levels unless the browser integration is itself the risk.

## Unit tests

- Keep specs beside the feature in `sushi/src/lib/<feature>/testing/`.
- Render a minimal standalone host so bindings, projection, models, outputs, and native behavior work together.
- Drive host state with signals and interact through the DOM.
- Assert public behavior, accessible roles/names/states, emitted values, focus, and meaningful templates.
- Cover applicable defaults, configured behavior, disabled, readonly, loading, invalid, empty, keyboard, model, output, and reset behavior.
- Do not call private/protected methods, snapshot whole DOM trees, or assert every implementation class.
- A class assertion is acceptable only when it proves a documented public appearance mapping.
- Remove tests that only prove Angular, JavaScript, or a fixture assignment works.

Angular describes a component as its class and template working together. That is why interactive components should normally be rendered and exercised through their DOM rather than tested only as class instances. For complex, broadly reused interactive widgets, consider an [Angular component harness](https://angular.dev/guide/testing/creating-component-harnesses) when it would give consumers a stable testing API.

## E2E tests

- Organize specs by public component or browser contract, never by documentation page layout.
- Give each test one explicit contract in its title.
- Start from a fresh page and keep tests order-independent.
- Prefer roles, accessible names, labels, and visible text. Use `data-testid` only for geometry surfaces with no user-facing identity.
- Prefer Playwright's retrying locator assertions. Avoid manual waits and immediate `isVisible()` assertions.
- Use exact pixels only when the API promises an edge, size, or offset. Otherwise assert the invariant: contained, aligned, scrollable, or moved.
- Do not test marketing copy, documentation tabs, utility-class strings, shadows, colors, or example decoration.
- Do not turn every component into an E2E test. Most components should remain unit-only.

These rules follow Playwright's recommendations to test user-visible behavior, isolate tests, prefer user-facing locators, and rely on retrying locators rather than implementation selectors. See also Playwright's guidance on [locators](https://playwright.dev/docs/locators) and [test isolation](https://playwright.dev/docs/browser-contexts).

The browser suite intentionally protects modal focus and dismissal, non-modal scrolling, header-only dragging, in-place resize, viewport containment, Drawer placement and responsive Sidebar composition, Menu overlay focus and placement, Navbar disclosure, and overflow containment.

## Test quality review

Before keeping a test, answer all four questions:

1. Which consumer-visible regression does it catch?
2. Why is this the smallest suitable test level?
3. Will an internal refactor preserve the assertion?
4. Does the failure explain the broken contract?

If any answer is unclear, rewrite or remove the test.

## Commands

- `npm test` is the quick, non-watch unit gate for the library and documentation tooling.
- `npm run test:coverage` runs the library unit suite with its configured coverage thresholds.
- `npm run test:tools` tests the documentation generator separately because it is not part of the Angular library target.
- `npm run test:e2e` runs browser-only contracts.
- `npm run verify` runs the complete handoff sequence once, without repeating the ordinary unit suite before coverage.
