# Coding standards

## Component design

- Prefer native HTML, then a directive, then a component.
- Reuse an existing Sushi feature before adding parallel behavior.
- Keep public APIs independent of DaisyUI and Tailwind.
- Support keyboard, pointer, touch, screen readers, zoom, narrow viewports, and translated text.
- Expose only stable consumer concepts as inputs, models, outputs, templates, methods, or CSS tokens.

## Angular

- Use signal APIs: `input`, `model`, `output`, `signal`, `computed`, and signal queries.
- Use `inject()` and `ChangeDetectionStrategy.OnPush`.
- Use Signal Forms for form controls; do not add CVA, `FormsModule`, or Reactive Forms.
- Prefer Angular Aria for interaction patterns and CDK for overlays, focus, portals, drag/drop, and virtual scrolling.
- Derive state with `computed`. Use an effect only to synchronize with an external system.
- Keep templates declarative and use early returns to keep branches shallow.
- Type public contracts and named variables. Do not introduce `any`.

Order class members as follows:

1. models, inputs, and outputs;
2. content and view queries;
3. template and derived state;
4. private state and injected dependencies;
5. lifecycle methods;
6. public methods;
7. protected handlers;
8. private helpers.

## Files and names

- Organize source by feature under `sushi/src/lib/<feature>/`.
- Keep one primary declaration per file and specs under `testing/`.
- Put code in `internal/` only when it has a separate private responsibility.
- Export public declarations through the feature `index.ts` and `sushi/src/public-api.ts`.
- Never export `internal/` declarations.
- Use kebab-case component selectors and camelCase directive attributes.
- Do not prefix public classes with `Sui`. Use positive names for boolean inputs.

## Public API and documentation

- Prefer projection for content rendered once and typed templates for repeated or contextual content.
- Add consumer-facing JSDoc to every project-owned public declaration, member, template context, and type.
- Describe behavior, defaults, units, and constraints. Do not repeat the symbol name.
- Use only public APIs in examples.
- Do not maintain handwritten API tables; the generator reads TypeScript and CSS source.

## Readability

- Give each function one responsibility and keep it readable without tracing several nested branches.
- Separate completed steps with blank lines.
- Extract code when the extracted unit has a clear name and responsibility.
- Use comments for constraints and decisions, not for obvious syntax.
- Prefer direct control flow over generic helpers used once.

See [Component styling](component-styling.md) for CSS placement and token rules.
