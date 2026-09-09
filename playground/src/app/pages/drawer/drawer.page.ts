import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import { DrawerNavigationExample } from './examples/navigation/navigation.example';
import navigationHtml from './examples/navigation/navigation.example.html';
import * as navigationTs from './examples/navigation/navigation.example.ts' with { loader: 'text' };
import { DrawerCartExample } from './examples/cart/cart.example';
import cartHtml from './examples/cart/cart.example.html';
import * as cartTs from './examples/cart/cart.example.ts' with { loader: 'text' };

@Component({
  selector: 'pg-drawer-page',
  imports: [Badge, DrawerCartExample, DrawerNavigationExample, ExampleCode, ExamplePreview],
  templateUrl: './drawer.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerPage {
  protected readonly examples: Readonly<Record<'cart' | 'navigation', ExampleSource>> = {
    cart: { html: cartHtml, typescript: textSource(cartTs) },
    navigation: { html: navigationHtml, typescript: textSource(navigationTs) },
  };
}
