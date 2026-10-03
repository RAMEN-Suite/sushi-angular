# Contributing to Sushi

## Start the repository

```bash
nvm use
npm install
npm run prepare
npm start
```

The repository pins its Node.js version in `.nvmrc` and its npm version in `package.json`.

For a phone on the same trusted network, use `npm run start:network` and open the printed `Network` URL.

`sushi/` is the published Angular library. `playground/` contains examples and generated documentation. `tools/` contains repository-only generators and build checks.

## Choose the relevant guide

| Task                        | Guide                                               |
| --------------------------- | --------------------------------------------------- |
| Add or change a component   | [Component workflow](docs/component-development.md) |
| Add tokens or shared styles | [Component styling](docs/component-styling.md)      |
| Write library code          | [Coding standards](docs/coding-conventions.md)      |
| Select and write tests      | [Testing standards](docs/testing-conventions.md)    |
| Use AI assistance           | [AI conventions](docs/ai-conventions.md)            |

## Change workflow

1. Define the consumer-visible behavior.
2. Change implementation, source documentation, examples, and tests together.
3. Run the narrowest relevant checks while editing.
4. Regenerate the API reference and inspect the affected playground pages.
5. Run the repository gate before review.

```bash
npm run verify
```

Useful focused commands:

| Command                 | Use                                                |
| ----------------------- | -------------------------------------------------- |
| `npm test`              | Unit tests for the library and documentation tools |
| `npm run test:watch`    | Library unit tests while editing                   |
| `npm run test:e2e:ui`   | Interactive browser tests                          |
| `npm run generate:api`  | Regenerate Interface and Theming data              |
| `npm run package:check` | Build and inspect the publishable package          |

## Branches and commits

`main` is protected. Every change arrives through a pull request with a passing CI run and an approving review from a code owner.

Branch from the latest `main` and write [Conventional Commits](https://www.conventionalcommits.org):

```
feat(dialog): restore focus to the trigger on close
```

| Type                                       | Appears in the changelog |
| ------------------------------------------ | ------------------------ |
| `feat`, `fix`, `perf`, `refactor`, `docs`, `revert` | Yes             |
| `build`, `ci`, `chore`, `style`, `test`    | No                       |

Pull requests are squash-merged, so the pull request title becomes the commit message and follows the same convention. CI lints both the branch commits and the title.

## Dependencies

Renovate opens dependency update pull requests. Do not open Dependabot security update PRs from the alerts page.

The repository installs with install scripts disabled and a seven-day release cooldown, both set in `.npmrc`. A dependency published less than seven days ago cannot enter the lockfile.

## Releases

Maintainers release from the Actions tab with the Release workflow. It runs the full check suite, bumps the version, writes the changelog, tags, stages the package on npm for manual approval, verifies the published package, and deploys the playground.

## Review checklist

- Explain the consumer problem and the resulting behavior.
- Call out public API, accessibility, theming, dependency, and bundle changes.
- Include screenshots when visual behavior changes.
- Keep unrelated refactors out of the change.
- Do not commit generated reports, coverage, build output, or local configuration.

Contributions are licensed under the repository's MIT license.
