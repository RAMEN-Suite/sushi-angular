# Coding standards

The formatter, compiler and ESLint configuration enforce mechanical rules. Review remains responsible for design, public contracts and semantic grouping.

## Design and responsibilities

- Choose the simplest explicit solution for the current requirement. Do not add speculative extension points, generic frameworks or trivial wrappers.
- Give each module one coherent responsibility and a small interface. Extract shared code only when the responsibility is actually shared.
- Prefer native HTML, then a directive, then a component. Reuse an existing Sushi feature before adding parallel behavior.
- Keep public APIs independent of DaisyUI and Tailwind. Export only supported consumer contracts, never `internal/` declarations.
- Support keyboard, pointer, touch, screen readers, zoom, narrow viewports and translated text.

## Angular and member order

- Use signal APIs: `input`, `model`, `output`, `signal`, `computed`, and signal queries. Infer `booleanAttribute` input call types from the transformer while keeping the explicit `InputSignalWithTransform<boolean, unknown>` field type.
- Use `inject()` and `ChangeDetectionStrategy.OnPush`.
- Use Signal Forms for form controls; do not add CVA, `FormsModule`, or Reactive Forms.
- Prefer Angular Aria for interaction patterns and CDK for overlays, focus, portals, drag/drop and virtual scrolling. Use their public APIs.
- Derive values with `computed` instead of maintaining duplicate state. Use effects to synchronize with external systems.
- Keep templates declarative and give mutable state a clear owner.

Order class members as follows, preserving initialization dependencies:

1. models, inputs, and outputs;
2. content and view queries;
3. template and derived state;
4. private state and injected dependencies;
5. lifecycle methods;
6. public methods;
7. protected handlers;
8. private helpers.

## Types and contracts

- Use strict TypeScript checking, including `noUncheckedIndexedAccess` and unknown catch variables. Validate collection entries before use.
- Declare variable, field, parameter and return types explicitly, including primitive locals. Contextually typed callbacks and destructuring may use inference where ESLint permits it.
- Put generic constructor arguments on the declaration: `const values: Map<string, number> = new Map();`. Do not repeat them on the constructor.
- Use `import type` or inline `type` imports for type-only dependencies. Keep decorators, injection tokens and other runtime values as normal imports.
- Do not use `any`, expression non-null assertions or unchecked casts to bypass an unclear contract. Narrow `unknown` at untrusted boundaries; annotations do not validate JSON or imported data.
- Prefer literal and discriminated unions for finite states. Use interfaces for object contracts and type aliases for unions and compositions.
- Declare visibility explicitly and mark references, fields and collections `readonly` when consumers should not mutate them. This does not imply a runtime freeze.
- Keep `null` and `undefined` consistent within each contract. Use `??` for absence and `||` only when every falsy value should select the fallback.
- Preserve public names, defaults, ordering and type compatibility during cleanup. Treat changes to them as API changes.

## Files, names and imports

- Organize library features under `sushi/src/lib/<feature>/`; put specs under `testing/`. Keep one primary declaration per file; small helpers may stay with their only consumer.
- Put code in `internal/` only when it has a separate private responsibility.
- Export public declarations through the feature `index.ts` and `sushi/src/public-api.ts`. Use deliberate feature entry points, not internal barrels that hide cycles.
- Group imports as framework/runtime, external packages, then project modules. Use public package entry points and remove unused imports, including component metadata imports.
- Use PascalCase for types and classes, camelCase for functions and variables, plural names for collections, and names such as `itemsById` for lookups.
- Use concrete verbs and distinguish IDs, indexes, positions, counts and units. Shared fixed constants use UPPER_SNAKE_CASE; ordinary readonly values use camelCase.
- Use kebab-case component selectors and camelCase directive attributes. Do not prefix public classes with `Sui`, interfaces with `I` or private members with underscores.
- Use positive boolean names and preserve established public input names. Prefix intentionally unused required callback parameters with `_`.
- Write identifiers and technical documentation in English. Expose configurable labels where consumers need localisation.

## Formatting and readability

Prettier owns wrapping, indentation and punctuation: two spaces, LF, final newline, semicolons, single-quoted TypeScript strings, double-quoted CSS strings, trailing commas and parenthesized arrow parameters. Preferred widths are 130 for TypeScript and 140 for Angular HTML; example HTML and CSS retain the overrides in `.prettierrc`.

- Keep one step compact and use one blank line between distinct steps. Do not insert blank lines after every declaration, guard or `await`.
- Keep a lookup and its immediate guard together. Separate completed preparation or validation from the operation using it when they form distinct phases.
- Keep short lookup/check/return methods compact. After a substantial transformation or configuration object, separate the next operation when it has a different responsibility.
- Prefer guard clauses and explicit branches over deep nesting and nested ternaries. Name complex intermediate results rather than relying on wrapping alone.
- Extract a function when it owns a separate rule or its name expresses a useful operation. File length alone is not a reason to split code.
- Use comments for non-obvious reasons, invariants and compatibility constraints. Remove decorative section comments, dead code and obsolete TODOs.

```ts
const option: SelectionOption | undefined = options[index];
if (!option) return;

this.selectOption(option);
this.focus();
```

## Async work, resources and errors

- Await dependent work in order. Run independent work concurrently only when shared state permits it.
- Prevent duplicate work and stale results. After awaiting, check the relevant request, state or lifecycle before applying a result.
- Handle rejected promises, including deliberate fire-and-forget operations. Report unexpected UI failures at the Angular error boundary; do not silently replace them with fabricated success or fallback data.
- Keep cleanup with resource ownership: unsubscribe, disconnect observers, remove listeners, clear timers and cancel pending work. Prefer framework lifecycle tools.
- Distinguish expected absence, invalid input, cancellation and unexpected failure. Preserve valid state when an operation fails.
- Keep environment dependencies explicit and avoid import-time I/O outside bootstrap or tool entry points. Do not log secrets or complete user documents.

## Public API, documentation and verification

- Prefer projection for content rendered once and typed templates for repeated or contextual content.
- Add consumer-facing JSDoc to public declarations, members, template contexts and types. Explain behavior, units, constraints and computed fallbacks. Generated API tables read input/model defaults from their initializers; avoid repeating literal defaults in JSDoc.
- Use only public APIs in examples. Do not maintain handwritten API tables; the generator reads TypeScript and CSS sources.
- Keep focus visible, accessible names meaningful and focus restoration predictable. Respect reduced motion and long translated text.
- Test observable contracts and failure paths, not private implementation steps. Avoid redundant coverage of the same contract.
- Run formatting, lint, strict type checking, tests and production builds. Check the packaged artifact and installation in an isolated consumer for library changes.
- Keep formatter, lint, compiler configuration and documentation consistent. Do not weaken checks to accommodate an unclear design.
- Keep broad style migrations separate from behavior fixes when committing. Follow the repository's `type(scope): description` rules and validate commit messages.

See [Component styling](component-styling.md) and [Testing standards](testing-conventions.md) for the corresponding Sushi rules and verification commands.
