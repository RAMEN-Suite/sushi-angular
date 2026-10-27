# Component styling

This page covers styling inside the library. Consumer theme setup is documented in [Styling and themes](styling-and-themes.md).

## Choose where a style belongs

| Style                                    | Location                                         |
| ---------------------------------------- | ------------------------------------------------ |
| Markup owned by one component            | Adjacent `<feature>.component.css`               |
| Shared or consumer-owned `.sui-*` markup | `sushi/src/styles/features/<feature>.styles.css` |
| Semantic theme value                     | `sushi/src/styles/sushi.themes.css`              |
| Cross-component foundation               | `sushi/src/styles/sushi.core.css`                |

Do not add a global style when an adjacent component stylesheet can own it.

## Public tokens

Expose a token when consumers need to change a stable visual role. Prefix it with the feature name and document it immediately above the declaration:

```css
:host {
  /** Background color of the note surface. */
  --sui-note-background: var(--color-base-200);

  /** Foreground color of the note content. */
  --sui-note-color: var(--color-base-content);
}
```

Use semantic theme values as defaults. Do not expose tokens named after internal selectors or implementation steps.

The generator places documented `--sui-*` properties on the feature's Theming page. Global `features/<feature>.styles.css` files are associated by filename. If one global stylesheet belongs to several pages, declare them once at the top:

```css
/* @sui-docs autocomplete listbox multi-select order-list select */
```

The global theme reference is generated from `sushi.themes.css`. Document every token in the light theme and define the same token in the dark theme:

```css
/** @group Brand | Primary actions and emphasis. */
--color-primary: #7a0712;
```

`npm run generate:api` reads both themes, produces the Light and Dark columns, and fails when documentation or the matching dark value is missing.

## Text sizes

Use `--sui-font-size-xs` through `--sui-font-size-xl` for size-dependent field text. Their defaults follow the input/action scale, with `md` at `0.875rem`. `--sui-font-size-body` supplies readable `1rem` body text. Selection popups follow their control size; DataView, Listbox, and FileDrop keep host typography inherited so consumer templates retain their surrounding text size. Accordion maps its density to heading/body roles: small uses `md`/`body`, medium `lg`/`body`, and large `xl`/`lg`.

Chip labels retain their compact scale: `sm`, `sm`, `md`, `body`, and `lg` for sizes `xs` through `xl`. Their heights follow `--size-field` and can be overridden with `--sui-chip-height`.

`sui-internal-size-text` is a library implementation detail, not a consumer utility. Customize typography through the documented tokens.

## DaisyUI and Tailwind

Library styles are authored in `sushi/src/styles/sushi.source.css`. It imports Tailwind utilities, the Sushi themes and core styles, and the DaisyUI primitives used by the library.

When a component uses a DaisyUI primitive that is not already included, add its name to the `include` list in `sushi/src/styles/sushi.source.css`. Ordinary component and utility changes require no build configuration change.

The package build compiles this source into the published `styles.css`. The playground imports the same source through `playground/src/playground.source.css`, so style changes update during development.

## Rules

- Prefer a Sushi component, then a DaisyUI primitive, then Tailwind utilities, then feature CSS.
- Keep the public API independent of DaisyUI and Tailwind class names.
- Put consumer-layout utilities on consumer-owned elements.
- Use neutral surfaces for ordinary hover and selection states; reserve the primary color for actions and emphasis.
- Keep option height, padding, borders, and radii consistent with adjacent controls. Make stable component dimensions overridable through documented tokens.
- Show the component by itself in the first Playground example; demonstrate composition separately.
- Avoid `!important`, broad selectors, duplicated theme colors, and fixed overlay positioning.
- Respect `prefers-reduced-motion`.
- Check light and dark themes, long content, zoom, and narrow viewports.
