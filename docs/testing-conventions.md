# Testing standards

Test public contracts, not implementation structure.

## Select the test level

| Contract                                                                                        | Test level |
| ----------------------------------------------------------------------------------------------- | ---------- |
| Inputs, models, outputs, projection, ARIA, keyboard logic                                       | Unit       |
| Geometry, clipping, scrolling, responsive layout, native focus, drag, resize, overlay placement | E2E        |

Do not duplicate a contract at both levels unless the browser integration is the risk.

## Unit tests

Place specs in `sushi/src/lib/<feature>/testing/`.

- Render a standalone host with realistic bindings and projected content.
- Change host signals and interact through the DOM.
- For signal inputs and models, change the host signal and assert the rendered result or two-way value. Use `await fixture.whenStable()` when rendering or effects are asynchronous.
- Assert public values, events, accessible roles, names, states, focus, and template results.
- Cover applicable defaults, configured behavior, disabled, readonly, loading, invalid, empty, keyboard, model, output, and reset behavior.
- Do not call private or protected methods.
- Do not snapshot complete DOM trees or assert every internal class.
- Remove tests that only prove Angular can construct a class or assign a fixture value.

A CSS class assertion is valid only when it proves a documented appearance mapping.

## E2E tests

Place browser contracts in `e2e/specs/` and organize them by component or shared behavior.

- Give each test one consumer-visible contract.
- Start from a fresh page and keep tests order-independent.
- Prefer roles, accessible names, labels, and visible text.
- Use `data-testid` only for geometry surfaces without a user-facing identity.
- Use Playwright's retrying locator assertions; do not add manual waits.
- Assert layout invariants such as contained, aligned, scrollable, or moved. Use exact pixels only when the API promises them.
- Do not test documentation tabs, copy, utility classes, colors, shadows, or page decoration.

Most components need unit tests only. Existing E2E coverage protects modal focus and dismissal, non-modal scrolling, drag and resize, viewport containment, responsive navigation, overlay focus and placement, selection popups, media viewers, and overflow behavior.

## Keep or remove a test

A useful test answers all four questions:

1. Which consumer-visible regression does it catch?
2. Why does it need this test level?
3. Would an internal refactor preserve the assertion?
4. Does its failure identify the broken contract?

Rewrite or remove the test when an answer is unclear.

## Test the npm package locally

Run this from the repository root after `npm install`:

```bash
npm run package:check
```

This builds the library, checks the tarball contents, builds the Playground against the library output, then installs the tarball in a temporary Angular app and builds that app. The temporary app imports the public API and `@sushi-kit/angular/styles.css`; it does not use workspace source aliases. npm needs access to the registry when the dependencies are not cached. The temporary app is removed when the command finishes.

To rerun only the isolated installation step, use `npm run package:install`. It requires a current library build in `dist/sushi`; run `npm run build:sushi` first after changing library code or styles. For the complete test suite, use `npm run verify`, which includes `package:check`.

## Commands

| Command                   | Scope                                                              |
| ------------------------- | ------------------------------------------------------------------ |
| `npm test`                | Library and documentation-tool unit tests                          |
| `npm run test:coverage`   | Library units with coverage thresholds                             |
| `npm run test:tools`      | Documentation generator units                                      |
| `npm run test:e2e`        | Browser contracts                                                  |
| `npm run package:check`   | Build and check the package and both consumer builds               |
| `npm run package:install` | Install the packed tarball in an isolated Angular app and build it |
| `npm run verify`          | Complete handoff gate                                              |

References: [Angular component testing](https://angular.dev/guide/testing/components-basics), [Angular testing scenarios](https://angular.dev/guide/testing/components-scenarios), and [Playwright best practices](https://playwright.dev/docs/best-practices).
