# Component development

Use this workflow for every public SUSHI KIT feature. Apply the [coding conventions](coding-conventions.md) while implementing and the [testing conventions](testing-conventions.md) while verifying it.

## 1. Define the contract

Before coding:

- Reuse an existing SUSHI feature when it already owns the behavior.
- Prefer native HTML, then a directive, then a component.
- List the supported states, keyboard behavior, semantics, and responsive behavior.
- Keep the public API small, typed, and independent of DaisyUI and Tailwind.

Use projection for content rendered once and typed template markers for repeated or contextual content.

## 2. Create only the files you need

```text
sushi/src/lib/<feature>/
├── index.ts
├── <feature>.directive.ts | <feature>.component.ts
├── <feature>.component.html
├── <feature>.component.css
├── <feature>.interfaces.ts
├── <feature>.templates.ts
├── internal/                         # private implementation details
└── testing/
    └── <feature>.component.spec.ts
```

- Keep small features flat.
- Omit empty HTML, CSS, interfaces, or template files.
- Move private renderers, state, and interaction helpers to `internal/` only when the main declaration becomes hard to scan.
- Export the public API from the feature `index.ts`, then from `sushi/src/public-api.ts`.

### Small example: `sui-note`

Start with the consumer contract: a note displays projected content, has a configurable tone, and exposes no state or events. Native `<aside>` semantics are sufficient, so the component only owns its reusable surface and theming contract.

Create `sushi/src/lib/note/note.component.ts`:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Visual tone available for a note. */
export type NoteTone = 'neutral' | 'info';

/** Displays short supplementary information. */
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

Use semantic markup in `note.component.html`:

```html
<aside class="sui-note" [attr.data-tone]="tone()">
  <ng-content />
</aside>
```

Keep the stable visual roles configurable in `note.component.css`:

```css
:host {
  /** Background color of the note surface. */
  --sui-note-background: var(--color-base-200);

  /** Foreground color of the note content. */
  --sui-note-color: var(--color-base-content);
}

.sui-note {
  padding: 1rem;
  color: var(--sui-note-color);
  background: var(--sui-note-background);
  border-radius: var(--radius-box);
}

.sui-note[data-tone='info'] {
  --sui-note-background: var(--color-info);
  --sui-note-color: var(--color-info-content);
}
```

Test the public contract through a host in `testing/note.component.spec.ts`: render projected content, verify the default and configured tone, and confirm the `<aside>` semantics. Do not test that Angular can merely construct `Note` or duplicate every CSS declaration in assertions.

Finally, export `Note` and `NoteTone` from `note/index.ts` and `sushi/src/public-api.ts`, add source JSDoc and a copyable playground example, run `npm run generate:api`, then finish with `npm run verify`. This example is intentionally small; add templates, outputs, internal helpers, or E2E coverage only when the public behavior requires them.

## 3. Implement the feature

- Use typed signal APIs and `ChangeDetectionStrategy.OnPush`.
- Preserve native attributes and semantics.
- Use Angular Aria or CDK for established interaction and overlay patterns.
- Keep derived state computed and template handlers short.
- Reuse SUSHI first, then DaisyUI, Tailwind, and narrowly scoped feature CSS.
- Expose styling only through documented inputs, templates, or `--sui-*` properties.
- Keep behavior-only composition primitives visually headless when another SUSHI component supplies the surface.
- Place visual defaults in the CSS `components` layer when consumer utility classes are part of the supported override contract.
- Project ordinary body content without a marker; reserve slot directives for genuinely distinct regions.

Prefer clear names and small cohesive changes. Extract code when it has a separate responsibility, not merely to reduce line counts.

## 4. Document usage

Document every public declaration, input, output, type, and template marker at its source. Describe its effect for consumers rather than repeating its name.

Add a playground page with:

- short examples backed by the same HTML, TypeScript, and optional CSS files shown as source;
- a CSS source tab whenever an example owns a stylesheet;
- relevant states, responsive behavior, and customization;
- SUSHI components for composed controls, collections, surfaces, and feedback;
- raw SUSHI appearance by default, with utilities used primarily for layout plus restrained typography and color where they clarify example content;
- generated API and Styling pages.

The API generator loads `sushi/tsconfig.lib.json` and follows the symbols exported by `sushi/src/public-api.ts`. It reads
Angular declarations, signal members, public methods, interfaces, template markers, and referenced types through the
TypeScript compiler API. Non-exported implementation details are ignored. Documentation routes normally follow the
feature folder; a matching playground page name takes precedence for independently documented declarations (for
example, `FileDrop` maps to `file-drop`). No API registry entry is required.

CSS is parsed with PostCSS. Global `features/<name>.styles.css` tokens are associated with the matching documentation
route automatically. A shared style family can declare its consumers once at the top of the CSS file, for example:

```css
/* @sui-docs autocomplete listbox multi-select order-list select */
```

The generator fails when a public declaration, member, template, type, or style token has no description.

## 5. Test public behavior

Place Vitest specs in the feature's `testing/` folder. Use a standalone host and cover applicable states, bindings, projection, models, outputs, keyboard behavior, focus, and ARIA.

Use Playwright only for browser-dependent Library behavior such as layout, scrolling, overlays, responsive changes, and rendered focus continuity. The playground may host the fixture, but assertions must target a SUSHI component's public behavior. Do not test documentation tabs, preview styling, marketing copy, or the playground shell. Coverage thresholds prevent regressions; they do not replace meaningful assertions.

## 6. Verify the package boundary

- Confirm the feature is exported only through its public feature barrel and `public-api.ts`.
- Keep private renderers, test helpers, playground examples, and documentation tooling out of the public exports.
- Run `npm run package:check` and inspect the listed tarball files when adding dependencies, assets, entry points, or global styles.

## Definition of done

- Public API and exports are intentional and documented.
- Examples are complete, copyable, responsive, and use SUSHI primitives.
- Keyboard, pointer, focus, disabled states, long content, and both themes work.
- Unit tests cover public logic; Playwright covers required browser behavior.
- The repository checks pass:

```bash
npm run verify
```
