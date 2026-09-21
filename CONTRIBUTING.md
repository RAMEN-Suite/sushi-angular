# Contributing to Sushi

## Start the repository

```bash
nvm use
npm install
npm start
```

The repository pins its Node.js version in `.nvmrc` and its npm version in `package.json`.

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

## Review checklist

- Explain the consumer problem and the resulting behavior.
- Call out public API, accessibility, theming, dependency, and bundle changes.
- Include screenshots when visual behavior changes.
- Keep unrelated refactors out of the change.
- Do not commit generated reports, coverage, build output, or local configuration.

Contributions are licensed under the repository's MIT license.
