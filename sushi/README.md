# Sushi Angular

[![npm version](https://img.shields.io/npm/v/%40sushi-kit%2Fangular)](https://www.npmjs.com/package/@sushi-kit/angular)
[![CI](https://github.com/ramen-suite/sushi-angular/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/ramen-suite/sushi-angular/actions/workflows/ci.yml?query=branch%3Amain)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/ramen-suite/sushi-angular/blob/main/LICENSE)
[![Playground](https://img.shields.io/badge/docs-Playground-f2b66d)](https://ramen-suite.github.io/sushi-angular/)

Sushi is an open-source UI component library for Angular applications, published as `@sushi-kit/angular`. It provides standalone components for forms, navigation, data display, and overlays, with typed signal APIs and customizable light and dark themes.

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
