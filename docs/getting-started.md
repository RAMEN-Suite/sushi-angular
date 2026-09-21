# Getting started

Sushi requires Angular 22.

## 1. Install

```bash
npm install @sushi-kit/angular
```

npm installs the Angular, CDK, Aria, Router, RxJS, Lucide, and PhotoSwipe peer dependencies required by the package.

## 2. Load the styles

Import the compiled stylesheet once in `src/styles.css`:

```css
@import '@sushi-kit/angular/styles.css';
```

Alternatively, add it before the application stylesheet in `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": ["node_modules/@sushi-kit/angular/styles.css", "src/styles.css"]
          }
        }
      }
    }
  }
}
```

Choose one method. The consumer does not need a Sushi-specific PostCSS configuration.

## 3. Use a component

Import each standalone declaration used by a component:

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

## Choose a theme

The light `sushi` theme is active by default. `sushi-dark` follows the operating-system dark preference. Set `data-theme` to select one explicitly:

```html
<html data-theme="sushi-dark">
  <!-- application -->
</html>
```

## Next steps

Continue with [styling and themes](styling-and-themes.md) for custom themes and recommended Tailwind usage. Component pages contain examples, interfaces, and tokens. Contributors should continue with the [contribution guide](../CONTRIBUTING.md).
