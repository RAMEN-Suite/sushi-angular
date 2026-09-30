# Sushi in Angular

Accessible, themeable Angular components for Ramen Suite, published as `@sushi-kit/angular`.

## Compatibility

| Sushi Kit | Angular |
| --------- | ------- |
| `0.1.x`   | `22.x`  |

The package peer dependencies are the source of truth for the supported Angular range.

## Install

```bash
npm install @sushi-kit/angular
```

Load the component styles once in the application's global stylesheet:

```css
@import '@sushi-kit/angular/styles.css';
```

## Use a component

Sushi declarations are standalone. Import only what the consuming component uses:

```ts
import { Component } from '@angular/core';
import { Button } from '@sushi-kit/angular';

@Component({
  selector: 'app-checkout',
  imports: [Button],
  template: `<button suiButton severity="primary">Place order</button>`,
})
export class Checkout {}
```

## Themes

`sushi` is the default light theme. Use `sushi-dark` for the dark theme:

```html
<html data-theme="sushi-dark"></html>
```

Theme tokens, component APIs, and examples are documented in the [Sushi Playground](https://ramen-suite.github.io/sushi-angular/).

## License

[MIT](https://github.com/ramen-suite/sushi-angular/blob/main/LICENSE)
