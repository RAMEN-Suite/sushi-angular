# AI conventions

AI may assist development, but the contributor remains responsible for every changed line and asset.

## Required behavior

- Read the relevant public API, implementation, tests, and conventions before editing.
- Preserve unrelated work and never discard changes to make a task easier.
- Prefer existing components, utilities, patterns, and dependencies.
- Keep changes within the requested scope and surface uncertain product decisions instead of inventing policy.
- Verify generated code with the same checks required for human-written code.
- Review licenses before adding code, fonts, icons, images, datasets, or dependencies.
- Never add secrets, personal data, copied proprietary code, watermarked assets, or unverifiable generated content.

## Generated code and tests

- Do not generate broad boilerplate that hides the component's core behavior.
- Do not create tests merely to increase coverage.
- Do not weaken assertions, thresholds, accessibility, typing, or lint rules to make checks pass.
- Do not hardcode documentation metadata that can be derived from TypeScript or CSS sources.
- Explain non-obvious architectural decisions in the source or contribution, not in transient chat history.

## Handoff

An AI-assisted change is ready only when its public behavior is documented, meaningful tests pass, generated files are current, package contents were inspected when relevant, and the diff contains no unrelated or unexplained edits.
