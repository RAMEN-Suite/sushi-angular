import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Code, CodeLine } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import { highlightLines } from '../../shared/example-code/example-highlighter';
import { DrawerCartExample } from './examples/cart/cart.example';
import cartHtml from './examples/cart/cart.example.html';
import * as cartTs from './examples/cart/cart.example.ts' with { loader: 'text' };

@Component({
  selector: 'pg-drawer-page',
  imports: [Badge, Code, CodeLine, DrawerCartExample, ExampleCode, ExamplePreview],
  templateUrl: './drawer.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerPage {
  protected readonly triggerLines: readonly string[] = highlightLines(
    `<button suiButton [suiDrawerTrigger]="cartDrawer">Open cart</button>
<sui-drawer #cartDrawer="suiDrawer" placement="end">…</sui-drawer>`,
    'html',
  );
  protected readonly contentLines: readonly string[] = highlightLines(
    `<sui-drawer #cartDrawer="suiDrawer">
  <header suiDrawerHeader>Cart</header>
  <cart-items />
  <footer suiDrawerFooter>Checkout</footer>
</sui-drawer>`,
    'html',
  );
  protected readonly controlLines: readonly string[] = highlightLines(
    `<button suiButton [suiDrawerClose]="cartDrawer">Done</button>

<sui-drawer [(open)]="cartOpen">…</sui-drawer>`,
    'html',
  );
  protected readonly examples: Readonly<Record<'cart', ExampleSource>> = {
    cart: { html: cartHtml, typescript: textSource(cartTs) },
  };
}
