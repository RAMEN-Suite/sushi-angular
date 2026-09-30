# Sushi Kit for Angular

[![License: MIT](https://img.shields.io/badge/license-MIT-7a0712?labelColor=282a36)](https://github.com/ramen-suite/sushi-angular/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/%40sushi-kit%2Fangular?labelColor=282a36&color=7a0712)](https://www.npmjs.com/package/@sushi-kit/angular)
[![npm downloads](https://img.shields.io/npm/dm/%40sushi-kit%2Fangular?labelColor=282a36&color=7a0712)](https://www.npmjs.com/package/@sushi-kit/angular)
[![CI](https://img.shields.io/github/actions/workflow/status/ramen-suite/sushi-angular/ci.yml?branch=main&label=CI&labelColor=282a36)](https://github.com/ramen-suite/sushi-angular/actions/workflows/ci.yml?query=branch%3Amain)
[![Playground](https://img.shields.io/badge/docs-Playground-996400?labelColor=282a36)](https://ramen-suite.github.io/sushi-angular/)

Sushi Kit is an open-source UI component library for Angular applications, published as `@sushi-kit/angular`. It provides standalone components for forms, navigation, data display, and overlays, with typed signal APIs and customizable light and dark themes.

Interactions build on native HTML semantics, Angular Aria, and the CDK. Component styles are included; customize their appearance with CSS tokens to match your application.

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

See [Getting started](https://ramen-suite.github.io/sushi-angular/getting-started) for the complete setup.

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

Browse component examples and APIs in the [Sushi Playground](https://ramen-suite.github.io/sushi-angular/). See [Styling and themes](https://ramen-suite.github.io/sushi-angular/styling-and-themes) for customization and the [theme token reference](https://ramen-suite.github.io/sushi-angular/theme-tokens) for built-in values.

## License

[MIT](https://github.com/ramen-suite/sushi-angular/blob/main/LICENSE). Third-party notices are included with the published package.
