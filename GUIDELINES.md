# SUSHI development guidelines

These conventions apply to the library and its playground. New code should follow the existing public API style unless a deliberate refactoring updates all affected components consistently.

## Design principles

1. Prefer native HTML semantics and behavior.
2. Prefer a directive when styling or enriching an existing native element is sufficient.
3. Use a component when SUSHI must own structure, state coordination, projected templates, or an interaction composed from multiple elements.
4. Use Angular Aria for established interaction patterns such as comboboxes, listboxes, menus, tabs, toggles, and disclosures.
5. Use Angular CDK for overlays, virtual scrolling, focus management, portals, and structural behavior.
6. Use Angular Forms for form state. Do not build a parallel form-state system.
7. Keep presentation replaceable. Public APIs and documentation must describe SUSHI behavior rather than the underlying CSS library.
8. Design mobile-first and make keyboard, pointer, touch, screen-reader, zoom, light-theme, and dark-theme behavior part of the implementation.

## Directive-first decision

Use an attribute directive when all of the following are true:

- a native element already provides the correct semantics;
- SUSHI mainly adds theme classes, typed variants, or form state;
- no internal template or coordinated child state is required;
- consumers should retain native attributes and browser behavior.

Examples: `suiInput`, `suiTextarea`, `suiButton`, `suiCheckbox`, `suiRadio`, `suiRange`, and `suiBadge`.

Use a component when at least one of the following is true:

- multiple internal elements must behave as one control;
- Angular Aria or CDK behavior needs owned structure;
- the control provides projected header, footer, item, empty, loading, or selected-value templates;
- the component implements `ControlValueAccessor` around non-native value behavior;
- state and accessibility attributes must be coordinated across multiple elements.

Examples: `sui-select`, `sui-toggle-button`, `sui-select-button`, and `sui-code`.

Do not introduce a component solely to wrap one native element in another element.

## Project structure

Library code belongs in `sushi/src/lib/<feature>/`.

```text
<feature>/
├── index.ts
├── <feature>.directive.ts       # Directive-first feature
├── <feature>.interfaces.ts      # Public types when needed
├── <feature>.templates.ts       # Public ng-template markers when needed
└── components/                  # Only for components with owned markup
    ├── <feature>.component.ts
    ├── <feature>.component.html
    └── <feature>.component.css  # Only when local CSS is necessary
```

Rules:

- One feature owns its public directives, component, types, and template markers.
- Keep internal helpers inside the feature unless at least two unrelated features need them.
- Shared form behavior belongs in `form-control` or `selection-control` rather than being duplicated.
- Export the feature from its `index.ts` barrel.
- Export the feature barrel once from `sushi/src/public-api.ts`.
- Do not import another feature through private file paths. Import its barrel.
- Playground code belongs in `playground/src/app/view/<category>/<feature>/`.
- Every public feature gets a route, navigation entry, page class, page template, and working examples.

## Naming

### Angular selectors

- Attribute directives use camel-case selectors: `suiInput`, `suiCardBody`, `suiSelectItem`.
- Components use kebab-case element selectors: `sui-select`, `sui-toggle-button`.
- Playground page selectors use the `pg-` prefix: `pg-select-page`.
- Template marker directives describe the slot, not its implementation: `suiSelectItem`, `suiSelectFooter`, `suiSelectEmpty`.

### TypeScript names

- Public classes use concise PascalCase names without a redundant `Sui` prefix: `Input`, `Select`, `SelectItemTemplate`.
- Public type aliases and interfaces use the feature name: `SelectOption`, `ButtonSeverity`, `ToggleButtonContext`.
- Signal names describe state, not implementation: `expanded`, `selectedOptions`, `isDisabled`.
- Boolean inputs use positive names where possible: `fluid`, `filter`, `loading`, `disabled`.
- Event handlers use `handle<Action>` when called from a template: `handleToggle`, `handleSelection`.

### CSS names

- Every public primitive has a stable SUSHI hook: `.sui-input`, `.sui-select`, `.sui-card`.
- Use BEM-like names only for SUSHI-owned structure or state:
  - element: `.sui-form-field__label`
  - modifier/state: `.sui-form-field--floating`
- Generic reusable hooks may omit the feature when their meaning is shared: `.sui-form-control`.
- Do not style generated Angular attributes or depend on DOM depth that is not owned by the feature.
- Do not expose underlying theme-library class names as public API inputs.
- Avoid one-off names tied to a playground example.

## TypeScript file order

Inside a class, use this order:

1. public `model` signals
2. public `input` signals
3. public `output` signals
4. protected content/view queries
5. protected computed state
6. private state and dependencies
7. constructor, only when required
8. Angular Forms or lifecycle methods
9. public methods exposed through template contexts or APIs
10. protected template handlers
11. private helpers

Additional rules:

- Prefer `input`, `model`, `output`, `computed`, and `signal` over decorator-based inputs and outputs.
- Type public and protected members explicitly.
- Use `readonly` unless reassignment is required.
- Use `booleanAttribute` and `numberAttribute` transforms for HTML-like inputs.
- Keep derived state in `computed`; do not synchronize state with effects unless there is no simpler ownership model.
- Keep template handlers small and move reusable calculations into named helpers.
- Use early returns for disabled, loading, and invalid operations.
- Do not add comments that merely restate the code.

## Directive defaults

A simple directive should normally contain:

- a semantic native-element selector;
- `standalone: true`;
- a static host class containing the visual primitive and the stable SUSHI hook;
- typed inputs for supported theme options;
- host bindings for classes and ARIA state;
- shared form-state inheritance when the element participates in Angular Forms.

```ts
@Directive({
  selector: 'input[suiExample]',
  standalone: true,
  host: {
    class: 'input sui-example sui-form-control',
    '[class.input-primary]': 'severity() === "primary"',
    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
export class Example extends FormControlState {
  public readonly severity: InputSignal<ExampleSeverity | null> = input<ExampleSeverity | null>(null);
}
```

Native attributes such as `required`, `readonly`, `autocomplete`, `min`, `max`, and `name` remain native unless coordination requires an explicit input.

## Component defaults

A component should normally use:

- standalone behavior (the Angular default; declare it explicitly only where the existing file type convention does so);
- explicit `imports`;
- an external HTML template when markup is more than trivial;
- no component stylesheet until existing classes and utilities have been exhausted;
- host classes for the stable component hook and host-level states;
- signals for inputs, models, queries, and derived state;
- `ControlValueAccessor` only when native form controls cannot provide the required value behavior.

Template customization must use marker directives and typed context interfaces. Do not identify slots by template reference variable names or string keys.

```html
<ng-template suiExampleItem let-option let-selected="selected">
  <!-- Consumer-owned presentation -->
</ng-template>
```

Template context rules:

- `$implicit` contains the value most consumers need.
- Named properties expose additional state such as `selected`, `disabled`, `index`, or `loading`.
- Actions such as `remove` or `toggle` are exposed only when they preserve the component's state rules.
- Interactive content inside an option must not create conflicting keyboard or selection behavior.
- Every template slot requires a complete playground example and copyable code.

## CSS strategy

Use styling in this order:

1. existing visual primitive classes;
2. Tailwind utility classes in the host or template;
3. a reusable SUSHI hook with `@apply` in `sushi.core.css`;
4. component-local CSS for behavior or styling that cannot be expressed cleanly otherwise.

Do not add CSS to compensate for markup that can be simplified. Avoid fixed pixel positioning, duplicated theme colors, broad descendant selectors, and `!important` unless overriding a deliberate utility in a documented example.

Use CSS variables for values shared across states or needed by consumers. Respect `prefers-reduced-motion` for non-essential animation.

### Class order

Static host classes use this order:

1. underlying visual primitive
2. stable SUSHI feature hook
3. shared SUSHI hooks

Example:

```ts
class: 'input sui-input sui-form-control',
```

Template utility classes use this order:

1. positioning and display
2. flex/grid behavior and alignment
3. width, height, min/max size
4. spacing
5. typography
6. foreground and background colors
7. borders and radius
8. shadows, opacity, and visual effects
9. cursor, pointer, selection, overflow, and interaction
10. transitions and animation
11. state variants such as `hover:`, `focus:`, and `disabled:`
12. responsive variants from small to large

Keep related utilities together and let Prettier format long class attributes. Do not reorder classes merely for visual preference during unrelated changes.

## Accessibility and interaction

- Start from the correct native element and role.
- Every interactive control needs an accessible name.
- Preserve native keyboard behavior unless Angular Aria owns the pattern.
- Loading controls expose `aria-busy` and must not trigger their action.
- Disabled state must apply to pointer, keyboard, and Angular Forms behavior.
- Invalid state uses `aria-invalid`; hints and errors use stable IDs with `aria-describedby`.
- Composite controls must restore focus predictably when overlays close.
- Overlay position is calculated before it becomes visible and remains stable while open unless a real viewport change requires repositioning.
- Popup content must not close from ordinary interaction inside headers, footers, filters, or templates.
- Focus indicators must remain visible without overlapping connected controls.
- Animations must be subtle, use natural easing, and support reduced motion.

## Angular Forms

- Native form directives should inherit the shared form-control state where possible.
- Composite value controls implement `ControlValueAccessor` and support reactive forms, template-driven forms, and direct model binding when exposed.
- `writeValue` updates view state without emitting a consumer change.
- User interaction calls the registered change callback exactly once.
- Blur or equivalent completion calls the touched callback.
- `setDisabledState` combines form-disabled state with an explicit disabled input.
- Reset behavior must be demonstrated in the playground.
- Filtering, scrolling, opening, or rerendering must never discard a valid selection.

## Playground documentation

Documentation describes the component itself. Do not mention the underlying CSS library in titles, descriptions, or user-facing guidance.

Every public feature page should include, where relevant:

1. a short purpose statement;
2. basic usage and Angular Forms integration;
3. every public size, severity, variant, and state;
4. native attributes that remain part of the API;
5. disabled, loading, readonly, required, and invalid examples;
6. every template slot rendered in a realistic example;
7. useful component combinations;
8. responsive or orientation behavior;
9. reset actions for stateful examples;
10. copyable code containing all required imports, state, and markup.

Group examples by behavior rather than placing unrelated variants in one large section. Examples should look intentional at mobile width before adding wider breakpoint layouts.

## Verification checklist

Before considering a feature complete:

- [ ] The directive-first decision has been documented by the implementation shape.
- [ ] Public types and feature barrels are exported.
- [ ] All public inputs, models, outputs, methods, and template contexts are typed.
- [ ] Native semantics, Angular Aria, and CDK responsibilities do not overlap unnecessarily.
- [ ] Angular Forms write, change, touch, disabled, invalid, and reset behavior works.
- [ ] Keyboard, pointer, touch, focus, and screen-reader behavior has been tested.
- [ ] Light theme, dark theme, mobile width, desktop width, and 200% zoom work.
- [ ] Long and translated content does not break the layout.
- [ ] Every public API has a working playground example and copyable code.
- [ ] Custom CSS is minimal and uses stable SUSHI hooks.
- [ ] `npm run lint` passes.
- [ ] `npm run build:sushi` passes.
- [ ] `npm run build:playground` passes.
