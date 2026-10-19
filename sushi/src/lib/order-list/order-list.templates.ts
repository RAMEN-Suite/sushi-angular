import { Directive, input, type InputSignal } from '@angular/core';
import { type OrderListItemContext, type OrderListOption } from './order-list.interfaces';

/** Replaces row content. Buttons, links and inputs are supported; the library owns the separate reorder handle. */
@Directive({ selector: 'ng-template[suiOrderListItem]' })
export class OrderListItemTemplate<I extends OrderListOption = OrderListOption> {
  /** Optional collection used to infer the item type in the template. */
  public readonly items: InputSignal<readonly I[] | '' | undefined> = input<readonly I[] | '' | undefined>(undefined, {
    alias: 'suiOrderListItem',
  });
  public static ngTemplateContextGuard<I extends OrderListOption>(
    _directive: OrderListItemTemplate<I>,
    _context: unknown,
  ): _context is OrderListItemContext<I> {
    return true;
  }
}
