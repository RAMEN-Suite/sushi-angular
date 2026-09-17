# @sushi-kit/angular

Accessible, themeable Angular 22 components with typed signal APIs, Angular Aria, and the Angular CDK.

## Install

```bash
npm install @sushi-kit/angular
```

Import SUSHI KIT once from the application's global stylesheet:

```css
@import '@sushi-kit/angular/styles.css';
```

The package includes the compiled CSS required by SUSHI components.

## Use a component

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

`sushi` is the default theme; `sushi-dark` follows the operating-system dark preference. An application can select either explicitly through `data-theme="sushi"` or `data-theme="sushi-dark"` on an ancestor.

The repository's [styling and themes guide](https://github.com/sebenns/SUSHI/blob/main/docs/styling-and-themes.md) explains theme tokens, component tokens, recommended Tailwind usage, and custom themes.

Complete examples, generated API references, theming tokens, and contribution guidance are available in the [SUSHI KIT repository](https://github.com/sebenns/SUSHI).

SUSHI KIT is released under the MIT License.
