# Contributing to SUSHI KIT

Thank you for improving SUSHI KIT. Changes should preserve a small, accessible consumer API and remain easy for another developer to continue.

## Start here

1. Read the [component workflow](docs/component-development.md).
2. Follow the [coding conventions](docs/coding-conventions.md).
3. Select tests using the [testing conventions](docs/testing-conventions.md).
4. If AI assists the change, follow the [AI conventions](docs/ai-conventions.md).

## Development setup

```bash
npm install
npm run start:playground
```

The library source lives in `sushi/`. The documentation application lives in `playground/`. Do not import playground code into the published library.

## Change workflow

1. Define the consumer-visible behavior before editing code.
2. Make the smallest cohesive implementation and documentation change.
3. Add or update focused unit tests for logic and DOM semantics.
4. Add E2E coverage only when a real browser is required.
5. Regenerate API documentation and inspect the affected examples.
6. Run the complete verification before requesting review.

```bash
npm run verify
```

During iteration, run the smallest relevant check first:

- `npm test` runs the library and documentation-tool unit tests once without coverage.
- `npm run test:watch` reruns library unit tests while editing.
- `npm run test:e2e:ui` opens Playwright's interactive runner for browser-dependent behavior.
- `npm run verify` is the release-quality handoff gate. It checks formatting and linting, runs unit tests with coverage plus tooling tests, runs E2E tests, builds the playground and library, and inspects the npm package.

The full verification deliberately avoids redundant commands: the playground build regenerates the API through its pre-hook, while `package:check` builds the library before inspecting the package.

## Pull requests

- Explain the consumer problem and the resulting public behavior.
- Call out public API, accessibility, theming, dependency, or bundle changes explicitly.
- Link the issue when one exists.
- Include screenshots only when visual behavior changed.
- Keep unrelated refactors out of the same pull request.
- Never commit generated test reports, coverage, build output, or local configuration.

By contributing, you agree that your contribution is licensed under this repository's MIT license.
