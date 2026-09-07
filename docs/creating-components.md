# Creating a SUSHI component

This guide turns the rules in [GUIDELINES.md](../GUIDELINES.md) into the normal delivery path for a public feature.

## 1. Choose the smallest abstraction

Start with native HTML. Add a directive when the consumer should continue to own that element, and use a component only when SUSHI owns structure, state, child coordination, or a composite interaction.

Before adding UI, check whether an existing SUSHI feature already owns it. Library implementations and playground examples compose SUSHI first, then DaisyUI primitives, then focused Tailwind or feature CSS.

## 2. Create the feature folder

Keep small features flat and grouped by capability:

```text
sushi/src/lib/<feature>/
├── index.ts
├── <feature>.directive.ts | <feature>.component.ts
├── <feature>.component.html
├── <feature>.component.css
├── <feature>.interfaces.ts
├── <feature>.templates.ts
└── testing/
    └── <feature>.component.spec.ts
```

Only create files that have a clear responsibility. A directive does not need empty HTML or CSS files, and a feature without public types does not need an interfaces file. Move private renderers, state coordinators, or overlay helpers into `internal/` when the main implementation becomes difficult to scan; never export that folder.

Export the public declarations and types from the feature `index.ts`, then export that barrel from `sushi/src/public-api.ts`.

## 3. Design the public contract

- Prefer signal APIs: `input`, `model`, `output`, `computed`, and signal queries.
- Keep inputs minimal, typed, and independent of DaisyUI or Tailwind.
- Preserve native attributes and semantics instead of mirroring them.
- Use Signal Forms for form controls and Angular Aria or CDK for established interaction patterns.
- Keep disabled actions focusable with `aria-disabled` or soft-disabled behavior, while suppressing pointer and keyboard activation.
- Use projection for content rendered once and typed template markers for repeated or contextual content.
- Expose stable styling roles as documented `--sui-*` custom properties, not internal classes.

Every component uses `ChangeDetectionStrategy.OnPush`. Keep template handlers short, derived state computed, members explicitly typed, and names concise without abbreviations that hide meaning.

## 4. Document at the source

Write a short class description that explains when the feature is useful. Document every public input, output, method, type, and template marker with JSDoc that explains its consumer-facing effect rather than restating its name.

Document public CSS custom properties with a JSDoc-style CSS comment directly above each declaration. The API and styling pages are generated from these source comments, so missing descriptions are reported during generation.

Create a playground page with:

- a focused introduction and the complete applicable component tags;
- small, copyable examples whose rendered preview and source use the same files;
- an `/api` page generated from the public TypeScript API;
- a `/styling` page generated from public styling hooks;
- SUSHI components for composed controls, collections, surfaces, and feedback.

Add the route and navigation entry only once. The shared playground shell provides the Examples, API reference, and Styling navigation.

## 5. Protect observable behavior

Put Vitest specs in the feature-local `testing/` folder. Exercise the declaration through a standalone host template and cover the public states that apply: default, configured, disabled, readonly, loading, invalid, empty, keyboard, focus, model, output, and custom templates.

Use Playwright only when a browser is required to verify geometry or platform behavior, including overlays, real scrolling, responsive layout, and focus continuity across rendered updates.

Coverage is enforced project-wide by `npm run test:coverage` with these minimums:

| Metric     | Minimum |
| ---------- | ------: |
| Statements |     80% |
| Branches   |     80% |
| Functions  |     70% |
| Lines      |     85% |

The thresholds are a regression gate, not a target. Add tests for meaningful behavior even when the percentage already passes.

## 6. Verify before handoff

Run the same checks that protect the repository:

```bash
npm run lint
npm test
npm run test:coverage
npm run test:e2e
npm run build:sushi
npm run build:playground
npm run format
```

Review both themes and a narrow viewport in the playground. Confirm keyboard, pointer, focus, accessible names and states, long content, and public documentation before committing the feature in coherent steps.
