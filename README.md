# Sushi Angular

Sushi is the Angular component library in Ramen Suite, published as `@sushi-kit/angular`. It provides accessible, themeable components with typed signal APIs. Application state stays in Angular; interactions use native HTML semantics, Angular Aria, and the CDK.

## Requirements

- Angular 22
- A modern browser

Sushi ships the compiled CSS required by its components.

## Install

The [Getting started guide](docs/getting-started.md) contains the same setup as the Playground and is the maintained setup reference.

See [Styling and themes](docs/styling-and-themes.md) for theme tokens, component tokens, recommended Tailwind usage, and custom themes.

```bash
npm install @sushi-kit/angular
```

Import the public stylesheet from the application's global `src/styles.css`:

```css
@import '@sushi-kit/angular/styles.css';
```

No Sushi-specific PostCSS or Tailwind configuration is required.

## Use a component

Every public declaration is standalone. Import only what the consuming component uses:

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

Sushi includes form controls, navigation, overlays, feedback, data display, layout utilities, and image presentation. Consumer APIs use typed Angular inputs, models, outputs, projection, and template contexts rather than internal DOM access or styling hacks.

## Themes

`sushi` is the default light theme and `sushi-dark` follows the operating-system dark preference. Set `data-theme` when the application offers an explicit theme choice:

```html
<html data-theme="sushi-dark">
  <!-- application -->
</html>
```

Shared colors, radii, density, and effects use semantic CSS properties. Component-specific customization uses the documented `--sui-*` tokens shown on each playground Styling page.

## Playground and documentation

The playground is both the visual documentation and the source-level integration application:

```bash
nvm use
npm install
npm start
```

It contains copyable examples plus generated Interface and Theming references. `npm run package:check` builds the playground against the library output and installs the packed tarball in a separate minimal Angular app. This catches package exports, peer-dependency resolution, and stylesheet imports that source-based tests cannot catch.

## Repository checks

Use `npm test` for quick unit feedback. Before handing off a change, run:

```bash
npm run verify
```

This checks formatting and linting, unit coverage, documentation tooling, browser-dependent E2E contracts, both applications, and the packed library contents.

## Contribute

- [Contribution workflow](CONTRIBUTING.md)
- [Create or change a component](docs/component-development.md)
- [Component styling](docs/component-styling.md)
- [Coding conventions](docs/coding-conventions.md)
- [Testing conventions](docs/testing-conventions.md)
- [AI conventions](docs/ai-conventions.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)

The reusable library lives in `sushi/`; the documentation application lives in `playground/`; repository-only tooling lives in `tools/`. Playground and tooling code are excluded from the published package.

## License

Sushi is available under the [MIT License](LICENSE). Third-party software remains subject to its respective license terms.
