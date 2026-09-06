# SUSHI guidelines

## Principles

- Prefer native HTML.
- Reuse SUSHI before writing custom UI.
- Keep public APIs independent of DaisyUI and Tailwind.
- Use Angular 22+: signals, Signal Forms, Angular Aria, CDK, built-in control flow.
- Use only `@angular/forms/signals`; never `FormsModule`, Reactive Forms, CVA, or `NG_VALUE_ACCESSOR`.
- Build mobile-first and accessible.
- Keep APIs and implementations minimal.
- Protect public behavior with focused automated tests.

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
- Keep small features flat; move private renderers into `internal/` when the public feature root becomes hard to scan.
- Never export an `internal/` declaration.
- Keep helpers private until two unrelated features need them.
- Export through the feature barrel, then `public-api.ts`.
- Import other features through their barrel.
- Keep component CSS beside the component.
- Put directive and shared composition CSS in `styles/features/<feature>.styles.css`.
- `sushi.core.css` contains imports only.

Complexity review:

- Review a component for extraction when its TypeScript exceeds roughly 250 lines, its template exceeds roughly 150 lines, or it owns more than one independent interaction concern. These are review triggers, not targets to game.
- Keep the public feature root limited to its primary declaration, public types, public template markers, styles, and barrel.
- Put private renderers, state coordinators, overlay helpers, and interaction directives in `internal/`; group them one level deeper only when a domain has multiple related files.
- Let the public component coordinate inputs, outputs, queries, and derived state. Move repeated rendering or a self-contained interaction into a private component or directive.
- Extract pure collection or value transformations only when they are reused, independently testable, or obscure the component's main flow.
- Do not create one-method services, pass-through wrappers, or one-file-per-function structures solely to reduce line counts.
- A developer should be able to find the public API from `index.ts`, the primary behavior from the main declaration, and specialized behavior under `internal/` without searching the whole repository.

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
- Use `ChangeDetectionStrategy.OnPush` for every component.
- Use Signal Forms for form controls.
- Composite controls implement `FormValueControl<T>` or `FormCheckboxControl`.
- Use `booleanAttribute` and `numberAttribute` for HTML-like inputs.
- Derive state with `computed`; avoid synchronization effects.
- Use `protected` for templates and `private` for internals.
- Keep members `readonly` unless reassigned.
- Type named variables, properties, parameters, and function returns explicitly.
- Keep contextual callback and destructuring inference when repeating the type would reduce readability.
- Name a local type when its repeated annotation becomes difficult to scan.
- Keep templates declarative and handlers short.
- Keep functions below 40 meaningful lines and cyclomatic complexity at or below 12.
- Use early returns.
- Add comments only for non-obvious constraints, compatibility workarounds, or architectural decisions.
- Do not comment code that is already clear from its names and structure.
- Do not write `standalone: true`.

Class order:

1. models
2. inputs
3. outputs
4. queries
5. template state
6. derived state
7. private state and injections
8. constructor/lifecycle
9. public methods
10. protected handlers
11. private helpers

## Components and directives

- Components use kebab-case selectors; directives use camelCase attributes.
- Directives target the narrowest valid native selector.
- Preserve native attributes and browser behavior.
- Do not mirror native inputs unless coordination requires it.
- Use external HTML for non-trivial component templates.
- Implement `focus()` and `reset()` when native behavior is insufficient.
- Emit `touch` when an interaction completes, not on focus.
- Every template marker needs a typed context and a working example.
- Use `<label suiLabel for>` for native labelable controls.
- Use `<span suiLabel id>` with `ariaLabelledby` for non-native ARIA composites such as Select.
- Add `floating` only to a native label that wraps its control.
- Developers own explicit `for`, `id`, `aria-labelledby`, and `aria-describedby` associations.
- Keep hints, errors, and validation behavior independent from labels.

Navigation components:

- Prefer a typed item model for repeated destinations and use projected content only for application-specific toolbars.
- Use Angular Router destinations for client-side navigation and native `href` destinations for documents or external pages.
- Keep disclosure labels non-selectable; only their child destinations may become current.
- Preserve native links so navigation supports browser history, opening in a new tab, and copied addresses.
- Keep persistent sidebar navigation full-width and use the complete row as its interaction target.

## Naming

- Components: `sui-select`; directives: `suiInput`; pages: `pg-select-page`.
- Classes have no `Sui` prefix: `Select`, `SelectItemTemplate`.
- Booleans are positive: `disabled`, `loading`, `fluid`.
- Handlers describe actions: `handleSelection`, `handleReset`.
- CSS hooks use `.sui-feature` and `.sui-feature__element`.
- Public CSS custom properties use `--sui-feature-*` and describe one stable consumer-facing styling role.
- Names stay short but must remain unambiguous.
- Prefer complete, familiar words over unexplained abbreviations.
- Break dense expressions and markup into readable semantic steps; do not compress examples into clever one-liners.

## CSS

Prefer in order:

1. SUSHI component/directive
2. DaisyUI primitive
3. Tailwind utility
4. reusable `.sui-*` feature rule
5. component-local CSS

- Do not split component-owned styles across files.
- Avoid fixed positioning, duplicated theme colors, broad selectors, and `!important`.
- Use global theme tokens for shared semantics and component tokens for feature-specific surfaces or states.
- Do not couple a component surface to a semantic severity such as `neutral` unless the component represents that severity.
- Treat only documented `--sui-*` custom properties as public CSS API; internal classes and DaisyUI classes remain implementation details.
- Document each public custom property with a JSDoc-style CSS comment immediately before its declaration so the styling reference can generate it.
- Respect `prefers-reduced-motion`.
- Static class order: primitive, feature hook, shared hook.
- Utility order: layout, size, spacing, typography, color, border, effects, interaction, motion, state, responsive.

## Accessibility and overlays

- Every control needs an accessible name and visible focus.
- Keep SUSHI actions and composite widgets focusable while disabled. Use `aria-disabled` or Angular Aria `softDisabled` and suppress activation; reserve native `disabled` for hard-disabled native form controls.
- Visual wrappers such as Input Surface, Input Group, and Join do not name their controls.
- Add `role="group"` and a group label only when the complete composition represents one named interaction.
- Disabled covers pointer, keyboard, and forms behavior.
- Loading controls use `aria-busy` and cannot activate.
- Invalid controls use `aria-invalid`; messages use `aria-describedby`.
- Use Angular Aria for standard interaction patterns.
- Use CDK for overlays, portals, focus, and virtual scrolling.
- Position overlays before display; keep placement stable while open.
- Interaction inside an overlay must not close it unexpectedly.

## Testing

- Keep library specs beside the declaration or helper they exercise as `*.spec.ts`.
- Test components and directives through a standalone host template so bindings, projection, models, outputs, and native behavior are exercised together.
- Use Vitest through Angular's `unit-test` builder and Angular `TestBed`; do not configure a second unit-test runner.
- Use the helpers in `sushi/testing/test-utils.ts` for rendering hosts, required DOM queries, and keyboard events.
- Keep test hosts minimal and drive dynamic host state with signals.
- Test public behavior and observable DOM semantics; do not call private or protected members.
- Cover applicable default, configured, disabled, readonly, loading, invalid, empty, keyboard, focus, model, output, and template behavior.
- Assert ARIA roles, names, relationships, and states where the component owns them.
- Do not snapshot complete DOM trees or assert every utility class. Assert a class only when it proves a required component-to-DaisyUI mapping.
- Keep variables, fixtures, elements, events, and callbacks explicitly typed; shared test helpers must not return `any`.
- Extract a fixture helper only after a setup pattern repeats or when it represents a reusable interaction contract.
- Leave layout, real scrolling, overlay geometry, responsive behavior, and visual regression to Playwright against the playground.
- Playground examples do not receive parallel unit tests; Playwright verifies them as consumer integrations.

## Playground

- Generate API and styling references from the Angular and CSS sources with `npm run generate:api`; playground serve and build run it automatically.
- Write API descriptions as JSDoc on the public member or template marker so code and documentation share one source.
- Render the example first; show its exact HTML and TypeScript below.
- Store each stateful example in `examples/<name>/<name>.example.ts|html`.
- Compile those files for the preview and import the same files through text loaders.
- Never duplicate source as strings or handwritten `suiCodeLine` blocks.
- Pages own only descriptions, layout, examples, and raw-source references.
- Keep generated API references on the component's `/api` subpage; example pages contain no API data or API section heading.
- Keep generated styling references on the component's `/styling` subpage and show only supported theme tokens, component properties, inputs, and templates.
- Lazy-load every playground page through `loadComponent`.
- Keep routed documentation in `playground/src/app/pages/<component>`; navigation groups do not create filesystem layers.
- Use `pg-example-code` for HTML and TypeScript examples; do not add separate code-rendering wrappers.
- Use the shared HTML/TypeScript code tabs.
- Format `*.example.html` through the shared Prettier override; never hand-wrap displayed source.
- Keep syntax highlighting and its dependencies inside the playground.
- Group by behavior; keep examples short, complete, copyable, and mobile-first.
- Document every public input, output, state, template, native attribute, and useful composition.
- Use existing SUSHI components in examples.
- Render content collections with `List`, `DataView`, or `Table`; render independent content surfaces with `Card` instead of recreating them with utility classes.
- Keep native elements when their semantics are the example or no SUSHI abstraction owns that behavior.
- Do not mention DaisyUI in user-facing documentation.
- Reset buttons use `severity="neutral"` and `variant="soft"`.

Component page tags:

- Start with exactly one Angular declaration tag: `Directive` or `Component`.
- Use `Integration` instead only for guidance pages that do not document a SUSHI export.
- Add `Native element` when the public selector enhances a specific native element and preserves its semantics.
- Then include every applicable architecture tag in this order: `Signal Forms`, `Angular Aria`, `Angular CDK`, `Templates`, `Projected content`.
- Use only these fixed labels; do not invent feature, state, size, style, count, or marketing tags.
- Keep this order: declaration, `Native element`, Angular integrations, extension mechanisms.
- Describe the consumer-facing API: a component that only contains a native input remains `Component` without `Native element`.
- Add `Templates` only for public typed `ng-template` markers and `Projected content` only for a deliberate `ng-content` API.
- Add Angular technology tags only when the feature directly uses that API.

## Before handoff

- Check semantics, keyboard, pointer, touch, focus, screen readers, mobile, zoom, themes, long text, and translated text.
- Run `npm test`.
- Run `npm run lint`.
- Run `npm run build:sushi`.
- Run `npm run build:playground`.
