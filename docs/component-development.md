# Build a component

This page lists every repository change required for a public component. Use the [coding standards](coding-conventions.md), [component styling](component-styling.md), and [testing standards](testing-conventions.md) for the detailed rules.

## Workflow

| Step | Change                  | Required result                                                                          |
| ---- | ----------------------- | ---------------------------------------------------------------------------------------- |
| 1    | Define the contract     | Element type, states, keyboard behavior, ARIA, content model, and styling API are known. |
| 2    | Add the library source  | The feature works through its public Angular API.                                        |
| 3    | Export it               | Consumers can import it from `@sushi-kit/angular`.                                       |
| 4    | Add playground examples | Common use and important variations are visible and copyable.                            |
| 5    | Register the page       | The example, Interface, and Theming routes are reachable.                                |
| 6    | Add tests               | Unit tests cover logic and semantics; E2E covers browser-only behavior.                  |
| 7    | Generate and verify     | Generated docs, builds, tests, and package contents agree.                               |

## 1. Define the contract

Answer these questions before creating files:

- Can native HTML provide the behavior?
- Is a directive sufficient, or does the feature own markup?
- Which states, bindings, events, templates, and public methods does a consumer need?
- What are the keyboard, focus, pointer, touch, and screen-reader rules?
- Which visual roles need tokens?
- Does Angular Aria or CDK already implement the interaction pattern?

Do not expose DaisyUI classes, Tailwind classes, internal elements, or implementation state.

## 2. Add the library source

Create `sushi/src/lib/<feature>/`. Start flat and add only files used by the feature:

```text
sushi/src/lib/<feature>/
├── index.ts
├── <feature>.component.ts
├── <feature>.component.html
├── <feature>.component.css
├── <feature>.interfaces.ts
├── <feature>.templates.ts
├── internal/
└── testing/
    └── <feature>.component.spec.ts
```

Use a directive instead of a component when native markup should remain in consumer control. Omit empty HTML, CSS, interface, and template files. Use `internal/` only for a separate private responsibility.

A minimal component follows this shape:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Visual tone available for a note. */
export type NoteTone = 'neutral' | 'info';

/** Displays supplementary information. */
@Component({
  selector: 'sui-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Note {
  /** Controls the semantic color treatment. */
  readonly tone = input<NoteTone>('neutral');
}
```

```html
<aside class="sui-note" [attr.data-tone]="tone()">
  <ng-content />
</aside>
```

Document every public declaration and member in its source. Describe consumer behavior, not TypeScript syntax.

## 3. Export it

Export the public declarations from the feature barrel:

```ts
// sushi/src/lib/note/index.ts
export * from './note.component';
```

Then export the feature from the package entry point:

```ts
// sushi/src/public-api.ts
export * from './lib/note';
```

Do not export tests, examples, or anything under `internal/`.

## 4. Add playground examples

Create this structure:

```text
playground/src/app/pages/<feature>/
├── <feature>.page.ts
├── <feature>.page.html
└── examples/
    └── basic/
        ├── basic.example.ts
        ├── basic.example.html
        └── basic.example.css       # only when the example needs CSS
```

Each example is a standalone Angular component that imports the public API from `@sushi-kit/angular`. The page imports the same source files as text and passes them to `pg-example-code`. See `playground/src/app/pages/button/` for the smallest complete reference.

The page wiring for one example is:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { NoteBasicExample } from './examples/basic/basic.example';

@Component({
  selector: 'pg-note-page',
  imports: [ExampleCode, ExamplePreview, NoteBasicExample],
  templateUrl: './note.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotePage {
  protected readonly basic: ExampleSource = {
    html: basicHtml,
    typescript: textSource(basicTs),
  };
}
```

```html
<pg-example-code [html]="basic.html" [typescript]="basic.typescript">
  <ng-template pgExamplePreview>
    <pg-note-basic-example />
  </ng-template>
</pg-example-code>
```

When an example owns CSS, import it with the same text loader and set `css: textSource(basicCss)`. The source viewer adds the CSS tab.

Examples should cover:

1. the common use first;
2. meaningful API variations;
3. a complex or responsive case only when it teaches another contract.

Keep sample data short. Use SUSHI components for controls and feedback. Use utilities for page layout, not to reach into component internals.

## 5. Register the documentation

Add the component page route to `playground/src/app/app.routes.ts`:

```ts
{
  path: 'note',
  loadComponent: () => import('./pages/note/note.page').then(({ NotePage }) => NotePage),
  title: 'Note | SUSHI KIT Playground',
},
```

Add its label and path to the correct group in `playground/src/app/app.navigation.ts`:

```ts
{
  label: 'Note',
  path: '/note',
},
```

That navigation entry also creates `/note/api` and `/note/styling`. Do not add separate API or Styling routes.

The documentation generator follows exports from `sushi/src/public-api.ts` and reads TypeScript and CSS directly:

```text
public source + JSDoc ──> npm run generate:api ──> /<feature>/api
documented --sui-* CSS ─> npm run generate:api ──> /<feature>/styling
```

The feature folder and playground page normally determine the documentation route. No manual API registry is required.

## 6. Add the right tests

Write unit tests in `sushi/src/lib/<feature>/testing/`. Render a host and test the public contract through bindings and the DOM.

Add Playwright coverage only for behavior that requires a real browser, such as geometry, scrolling, responsive layout, native focus, pointer drag, resize, or overlay placement.

Do not test that Angular constructs the class, documentation page markup, or every CSS declaration. See [testing standards](testing-conventions.md).

## 7. Generate and verify

While developing:

```bash
npm run generate:api
npm test
npm start
```

Before review:

```bash
npm run verify
```

Inspect the component's Examples, Interface, and Theming pages in both themes. Run `npm run package:check` separately when changing exports, dependencies, assets, entry points, or global styles; `npm run verify` already includes it.

## Completion checklist

- The public API contains only consumer concepts and has JSDoc.
- Native semantics, keyboard behavior, focus, disabled states, and ARIA are correct.
- Examples use only public APIs and show the important states.
- Public visual roles have documented tokens.
- Unit tests cover logic and semantics; E2E exists only for browser contracts.
- The feature is exported, routed, listed in navigation, and generated docs are current.
- `npm run verify` passes.
