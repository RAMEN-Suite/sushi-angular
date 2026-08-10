# SUSHI guidelines

## Principles

- Prefer native HTML.
- Reuse SUSHI before writing custom UI.
- Keep public APIs independent of DaisyUI and Tailwind.
- Use Angular 22+: signals, Signal Forms, Angular Aria, CDK, built-in control flow.
- Use only `@angular/forms/signals`; never `FormsModule`, Reactive Forms, CVA, or `NG_VALUE_ACCESSOR`.
- Build mobile-first and accessible.
- Keep APIs and implementations minimal.
- Do not add tests until the project policy changes.

## Native, directive, or component

Choose in order:

1. Native element when HTML already owns the behavior.
2. Directive when consumers own the native element and SUSHI adds behavior or styling.
3. Component when SUSHI owns structure, state, children, or a composite interaction.

Rules:

- No component that only wraps `<ng-content />`.
- No directive for a generic utility class.
- Do not replace useful native semantics.
- Use projection for content rendered once.
- Use typed `ng-template` markers only for contextual, repeated, deferred, or conditional content.
- A component may use small companion directives for meaningful roles such as title or actions.
- Keep internal coordination directives private.

## Feature structure

```text
sushi/src/lib/<feature>/
├── index.ts
├── <feature>.directive.ts | <feature>.component.ts
├── <feature>.component.html
├── <feature>.component.css
├── <feature>.interfaces.ts
└── <feature>.templates.ts
```

- Organize by feature, not Angular type.
- Prefer one declaration per file; related template markers may share `*.templates.ts`.
- Keep helpers private until two unrelated features need them.
- Export through the feature barrel, then `public-api.ts`.
- Import other features through their barrel.
- Keep component CSS beside the component.
- Put directive and shared composition CSS in `styles/features/<feature>.styles.css`.
- `sushi.core.css` contains imports only.

## Package size

- Keep the published library tree-shakable; declarations must not register global runtime behavior.
- Never export playground, documentation, generator, or demo code from `public-api.ts`.
- Prefer platform and existing Angular APIs over new runtime dependencies.
- Import only the Angular, CDK, Aria, and icon symbols a feature actually uses.
- Keep optional behavior lazy or consumer-provided; do not bundle syntax highlighting, sample data, or documentation utilities.
- Review `dist/sushi` when adding a dependency or a substantial feature.

## Angular

- Prefer `input`, `model`, `output`, `signal`, `computed`, `contentChild`, and `viewChild`.
- Use `inject()`, not constructor injection.
- Use Signal Forms for form controls.
- Composite controls implement `FormValueControl<T>` or `FormCheckboxControl`.
- Use `booleanAttribute` and `numberAttribute` for HTML-like inputs.
- Derive state with `computed`; avoid synchronization effects.
- Use `protected` for templates and `private` for internals.
- Keep members `readonly` unless reassigned.
- Type public and protected APIs explicitly; do not rely on accidental inference.
- Keep templates declarative and handlers short.
- Use early returns.
- Do not write `standalone: true`.

Class order:

1. models
2. inputs
3. outputs
4. queries
5. derived state
6. private state and injections
7. constructor/lifecycle
8. public methods
9. protected handlers
10. private helpers

## Components and directives

- Components use kebab-case selectors; directives use camelCase attributes.
- Directives target the narrowest valid native selector.
- Preserve native attributes and browser behavior.
- Do not mirror native inputs unless coordination requires it.
- Use external HTML for non-trivial component templates.
- Implement `focus()` and `reset()` when native behavior is insufficient.
- Emit `touch` when an interaction completes, not on focus.
- Every template marker needs a typed context and a working example.

## Naming

- Components: `sui-select`; directives: `suiInput`; pages: `pg-select-page`.
- Classes have no `Sui` prefix: `Select`, `SelectItemTemplate`.
- Booleans are positive: `disabled`, `loading`, `fluid`.
- Handlers describe actions: `handleSelection`, `handleReset`.
- CSS hooks use `.sui-feature` and `.sui-feature__element`.
- Names stay short but must remain unambiguous.

## CSS

Prefer in order:

1. SUSHI component/directive
2. DaisyUI primitive
3. Tailwind utility
4. reusable `.sui-*` feature rule
5. component-local CSS

- Do not split component-owned styles across files.
- Avoid fixed positioning, duplicated theme colors, broad selectors, and `!important`.
- Respect `prefers-reduced-motion`.
- Static class order: primitive, feature hook, shared hook.
- Utility order: layout, size, spacing, typography, color, border, effects, interaction, motion, state, responsive.

## Accessibility and overlays

- Every control needs an accessible name and visible focus.
- Disabled covers pointer, keyboard, and forms behavior.
- Loading controls use `aria-busy` and cannot activate.
- Invalid controls use `aria-invalid`; messages use `aria-describedby`.
- Use Angular Aria for standard interaction patterns.
- Use CDK for overlays, portals, focus, and virtual scrolling.
- Position overlays before display; keep placement stable while open.
- Interaction inside an overlay must not close it unexpectedly.

## Playground

- Generate API references from the Angular source with `npm run generate:api`; playground serve and build run it automatically.
- Write API descriptions as JSDoc on the public member or template marker so code and documentation share one source.
- Render the example first; show its exact HTML and TypeScript below.
- Store each stateful example in `examples/<name>/<name>.example.ts|html`.
- Compile those files for the preview and import the same files through text loaders.
- Never duplicate source as strings or handwritten `suiCodeLine` blocks.
- Pages own only descriptions, layout, examples, and raw-source references.
- Lazy-load every playground page through `loadComponent`.
- Keep routed documentation in `playground/src/app/pages/<component>`; navigation groups do not create filesystem layers.
- Use `pg-example-code` for HTML and TypeScript examples; do not add separate code-rendering wrappers.
- Use the shared HTML/TypeScript code tabs.
- Group by behavior; keep examples short, complete, copyable, and mobile-first.
- Document every public input, output, state, template, native attribute, and useful composition.
- Use existing SUSHI components in examples.
- Do not mention DaisyUI in user-facing documentation.
- Reset buttons use `severity="neutral"` and `variant="soft"`.

## Before handoff

- Check semantics, keyboard, pointer, touch, focus, screen readers, mobile, zoom, themes, long text, and translated text.
- Run `npm run lint`.
- Run `npm run build:sushi`.
- Run `npm run build:playground`.
