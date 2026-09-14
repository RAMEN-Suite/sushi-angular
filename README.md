# SUSHI KIT

Accessible, themeable Angular components with typed signal APIs. SUSHI KIT favors native HTML semantics and composes Angular Aria, the Angular CDK, DaisyUI, and Tailwind CSS where they provide established behavior or styling primitives.

## Install

SUSHI KIT currently targets Angular 22.

```bash
npm install @sushi-kit/angular
```

Import the global stylesheet once in the application's main stylesheet:

```css
@import '@sushi-kit/angular/sushi.css';
```

## Use a component

Public declarations are standalone and can be imported where they are used:

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

The library includes form controls, navigation, overlays, feedback, data display, layout utilities, image presentation, generated API references, and documented CSS tokens. Browse the local playground for complete examples and consumer API documentation.

## Develop locally

```bash
npm install
npm run start:playground
```

The reusable library lives in `sushi/`; the documentation application lives in `playground/`. Keep playground and documentation tooling outside the published package boundary.

Use `npm test` for quick unit feedback. Before handing off a change, run the complete repository gate:

```bash
npm run verify
```

## Contribute

- [Contribution workflow](CONTRIBUTING.md)
- [Create or change a component](docs/component-development.md)
- [Coding conventions](docs/coding-conventions.md)
- [Testing conventions](docs/testing-conventions.md)
- [AI conventions](docs/ai-conventions.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)

Issues and pull requests should describe the consumer-visible problem, accessibility implications, and any public API, theming, dependency, or package changes.

## License

SUSHI KIT is available under the [MIT License](LICENSE). Third-party software remains subject to its respective license terms.
