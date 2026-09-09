import { Directive, input, InputSignal } from '@angular/core';
import { OrderListFilterContext, OrderListItemContext, OrderListOption } from './order-list.interfaces';

/** Replaces the filter control and exposes its query, state, and update function. */
@Directive({ selector: 'ng-template[suiOrderListFilter]' })
export class OrderListFilterTemplate {
  public static ngTemplateContextGuard(
    _directive: OrderListFilterTemplate,
    _context: unknown,
  ): _context is OrderListFilterContext {
    return true;
  }
}

/** Replaces each row and exposes its item, index, and selection state. */
@Directive({ selector: 'ng-template[suiOrderListItem]' })
export class OrderListItemTemplate<I extends OrderListOption = OrderListOption> {
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

/** Adds content above the filter and ordered collection. */
@Directive({ selector: 'ng-template[suiOrderListHeader]' })
export class OrderListHeaderTemplate {}
