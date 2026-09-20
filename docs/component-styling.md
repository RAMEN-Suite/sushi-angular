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
/** @group Brand | Primary actions and selection. */
--color-primary: #7a0712;
```

`npm run generate:api` reads both themes, produces the Light and Dark columns, and fails when documentation or the matching dark value is missing.

## DaisyUI and Tailwind

Library styles are authored in `sushi/src/styles/sushi.source.css`. It imports Tailwind utilities, the SUSHI themes and core styles, and the DaisyUI primitives used by the library.

When a component uses a DaisyUI primitive that is not already included, add its name to the `include` list in `sushi/src/styles/sushi.source.css`. Ordinary component and utility changes require no build configuration change.

The package build compiles this source into the published `styles.css`. The playground imports the same source through `playground/src/playground.source.css`, so style changes update during development.

## Rules

- Prefer a SUSHI component, then a DaisyUI primitive, then Tailwind utilities, then feature CSS.
- Keep the public API independent of DaisyUI and Tailwind class names.
- Put consumer-layout utilities on consumer-owned elements.
- Avoid `!important`, broad selectors, duplicated theme colors, and fixed overlay positioning.
- Respect `prefers-reduced-motion`.
- Check light and dark themes, long content, zoom, and narrow viewports.
