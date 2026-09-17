# Styling and themes

SUSHI KIT ships compiled component CSS and two themes. Its styling implementation builds on DaisyUI, but DaisyUI is not part of the SUSHI consumer API. The stylesheet does not include Tailwind's global Preflight reset.

## Choose the right styling level

1. Use a component input for a supported state or appearance.
2. Use a documented `--sui-*` token to change one component.
3. Change semantic theme tokens for an application-wide design decision.
4. Use Tailwind utilities for consumer-owned layout and responsive composition.

Do not target a SUSHI component's internal elements or classes.

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

Override semantic tokens after importing the SUSHI stylesheet:

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

## Tailwind recommendation

Tailwind is the recommended way to compose application layout around SUSHI components. Install it when the application needs utilities:

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

Tailwind is not needed to render SUSHI components. Avoid utilities that depend on a component's internal DOM.

## Built-in themes

The `sushi` and `sushi-dark` themes define the complete theme contract. Override theme tokens for application-wide changes and component tokens for exceptions.
