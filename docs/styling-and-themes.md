# Styling and themes

Sushi ships compiled component CSS and two themes. Its styling implementation builds on [DaisyUI](https://daisyui.com/), but DaisyUI is not part of the Sushi consumer API. The stylesheet does not include Tailwind's global Preflight reset.

## Choose the right styling level

1. Use a component input for a supported state or appearance.
2. Use a documented `--sui-*` token to change one component.
3. Change semantic theme tokens for an application-wide design decision.
4. Use [Tailwind CSS](https://tailwindcss.com/) utilities for consumer-owned layout and responsive composition.

We do not recommend targeting a Sushi component's internal elements or classes.

## Customize one component

Each component's Theming page lists its tokens. Set them on the component or a consumer-owned class:

```html
<sui-dialog class="checkout-dialog">...</sui-dialog>
```

```css
.checkout-dialog {
  --sui-dialog-width: 44rem;
  --sui-dialog-header-background: var(--color-accent);
  --sui-dialog-header-color: var(--color-accent-content);
}
```

## Create a custom theme

Override semantic tokens after importing the Sushi stylesheet:

```css
@import '@sushi-kit/angular/styles.css';

[data-theme='brand'] {
  color-scheme: light;

  --color-base-100: #ffffff;
  --color-base-200: #f5f3ff;
  --color-base-300: #ddd6fe;
  --color-base-content: #20143a;

  --color-primary: #6d28d9;
  --color-primary-content: #ffffff;
  --color-accent: #db2777;
  --color-accent-content: #ffffff;

  --radius-field: 0.5rem;
  --radius-box: 0.75rem;
}
```

Activate it on the document or one application region:

```html
<html data-theme="brand">
  <!-- application -->
</html>
```

A nested `data-theme` applies another theme to that region. Keep foreground and background pairs accessible.

## Theme contract

Sushi exposes semantic color roles for the application palette. They follow [DaisyUI's color system](https://daisyui.com/docs/colors/); pair each background role with its matching `*-content` foreground.

| Role                                                                  | Purpose                                           |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| `--color-base-100`, `--color-base-200`, `--color-base-300`            | Layered application surfaces                      |
| `--color-base-content`                                                | Default content on base surfaces                  |
| `--color-primary`, `--color-secondary`, `--color-accent`              | Brand and emphasis colors                         |
| `--color-neutral`                                                     | Neutral controls and emphasis                     |
| `--color-info`, `--color-success`, `--color-warning`, `--color-error` | Feedback states                                   |
| `--*-content`                                                         | Accessible foreground for the corresponding color |

Sushi derives shared interaction and overlay styles from these semantic tokens. Override them when a theme needs a different treatment instead of changing several components:

| Token                    | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `--sui-color-border`     | Default component border                                   |
| `--sui-color-muted`      | Secondary text and actions                                 |
| `--sui-color-subtle`     | Low-emphasis labels                                        |
| `--sui-color-hover`      | Neutral hover surface                                      |
| `--sui-color-overlay`    | Popup, dialog and popover surface                          |
| `--sui-focus-ring-color` | Optional global focus color; otherwise follows the control |
| `--sui-shadow-overlay`   | Popup, dialog and popover elevation                        |
| `--sui-disabled-opacity` | Shared disabled-state opacity                              |

Component tokens remain the correct choice for a local exception. For example, `--sui-popover-shadow` defaults to `--sui-shadow-overlay` but can be changed on one popover.

See the [theme token reference](theme-tokens.md) for every built-in light and dark value.

## Typography

Use the `--sui-font-size-*` tokens (`xs`, `sm`, `md`, `lg`, `xl`) for field and action text, and `--sui-font-size-body` for body text. Sized controls and their selection popups share these tokens. Badge and Chip labels retain a compact scale independent of body text; OTP digits use a larger scale. Navbar sizes control height and List sizes control spacing; their built-in text uses the medium text token at every density. Navbar projection and custom item templates retain inherited typography, as do DataView, Listbox and FileDrop templates.

Override the tokens in your theme or on a public component host:

```css
[data-theme='custom'] {
  --sui-font-size-md: 1rem;
  --sui-font-size-body: 1.125rem;
}
```

## Tailwind recommendation

[Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides/angular) is the recommended way to compose application layout around Sushi components. Install it when the application needs utilities:

```bash
npm install --save-dev tailwindcss @tailwindcss/postcss postcss
```

Configure Tailwind for Angular, then use utilities for consumer-owned layout:

```html
<section class="grid gap-6 md:grid-cols-2">
  <sui-card>Menu</sui-card>
  <sui-card>Order summary</sui-card>
</section>
```

Tailwind is not needed to render Sushi components. Avoid utilities that depend on a component's internal DOM.

## Built-in themes

The `sushi` and `sushi-dark` themes define the complete theme contract. Override theme tokens for application-wide changes and component tokens for exceptions.

In the light theme, colored roles use white content text. When replacing a role color, keep its `*-content` token legible against the new background.
