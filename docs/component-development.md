# Component development

Use this workflow for every public SUSHI feature. The detailed rules remain in [GUIDELINES.md](../GUIDELINES.md).

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

## 3. Implement the feature

- Use typed signal APIs and `ChangeDetectionStrategy.OnPush`.
- Preserve native attributes and semantics.
- Use Angular Aria or CDK for established interaction and overlay patterns.
- Keep derived state computed and template handlers short.
- Reuse SUSHI first, then DaisyUI, Tailwind, and narrowly scoped feature CSS.
- Expose styling only through documented inputs, templates, or `--sui-*` properties.

Prefer clear names and small cohesive changes. Extract code when it has a separate responsibility, not merely to reduce line counts.

## 4. Document usage

Document every public declaration, input, output, type, and template marker at its source. Describe its effect for consumers rather than repeating its name.

Add a playground page with:

- short examples backed by the same HTML and TypeScript files shown as source;
- relevant states, responsive behavior, and customization;
- SUSHI components for composed controls, collections, surfaces, and feedback;
- generated API and Styling pages.

## 5. Test public behavior

Place Vitest specs in the feature's `testing/` folder. Use a standalone host and cover applicable states, bindings, projection, models, outputs, keyboard behavior, focus, and ARIA.

Use Playwright only for browser-dependent behavior such as layout, scrolling, overlays, responsive changes, and rendered focus continuity. Coverage thresholds prevent regressions; they do not replace meaningful assertions.

## Definition of done

- Public API and exports are intentional and documented.
- Examples are complete, copyable, responsive, and use SUSHI primitives.
- Keyboard, pointer, focus, disabled states, long content, and both themes work.
- Unit tests cover public logic; Playwright covers required browser behavior.
- The repository checks pass:

```bash
npm run lint
npm test
npm run test:coverage
npm run test:e2e
npm run build:sushi
npm run build:playground
npm run format
```
