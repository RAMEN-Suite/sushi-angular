# Coding conventions

## Design principles

- Prefer native HTML, then a directive, then a component.
- Reuse an existing SUSHI KIT feature before creating parallel behavior.
- Keep the public API independent of DaisyUI and Tailwind.
- Build mobile-first and preserve keyboard, pointer, touch, screen-reader, zoom, and translated-text behavior.
- Expose only stable consumer concepts as inputs, outputs, templates, methods, or CSS tokens.

## Angular

- Use Angular signal APIs: `input`, `model`, `output`, `signal`, `computed`, content queries, and view queries.
- Use `inject()` and `ChangeDetectionStrategy.OnPush`.
- Use Signal Forms for form controls; do not add CVA, `FormsModule`, or Reactive Forms.
- Prefer Angular Aria for established interaction patterns and CDK for overlays, focus, portals, drag/drop, and virtual scrolling.
- Derive state with `computed`; use effects only for genuine synchronization with an external system.
- Keep templates declarative, handlers short, and branches shallow through early returns.
- Type public contracts and named variables explicitly. Do not introduce `any`.

Class members follow this order: models, inputs, outputs, queries, template state, derived state, private state and injections, lifecycle, public methods, protected handlers, private helpers.

## Files and naming

- Organize code by feature under `sushi/src/lib/<feature>`.
- Keep one primary declaration per file and local tests under `testing/`.
- Put private implementation details in `internal/` only when they represent a separate responsibility.
- Never export an `internal/` declaration.
- Export the public contract through the feature `index.ts`, then `sushi/src/public-api.ts`.
- Components use kebab-case selectors; directives use camelCase attributes.
- Public classes do not use a `Sui` prefix. Boolean inputs use positive names.

## Consumer API and documentation

- Optimize the common case for short, unsurprising markup.
- Prefer projection for content rendered once and typed templates for repeated or contextual content.
- Every public declaration, member, template context, and type owned by this project requires consumer-facing JSDoc.
- Examples must use the public API without querying or restyling component internals.
- API references are generated from source; do not maintain parallel handwritten API tables.

## CSS and theming

- Prefer SUSHI KIT components, DaisyUI primitives, Tailwind layout utilities, then narrowly scoped feature CSS.
- Component-owned styles stay beside the component. Global `.sui-*` styles are reserved for consumer-owned or shared DOM.
- Public custom properties use `--sui-feature-role` and require an adjacent description.
- Tokens describe stable visual roles, not current implementation selectors.
- Avoid `!important`, broad selectors, duplicated theme colors, and fixed positioning when the CDK owns placement.
- Respect `prefers-reduced-motion`.

## Maintainability

- A function should perform one readable task and normally remain below 40 meaningful lines.
- Use semantic blank lines between completed steps.
- Extract a concern because it has a clear responsibility, not to satisfy an arbitrary line count.
- Comments explain constraints and decisions; they do not narrate obvious syntax.
