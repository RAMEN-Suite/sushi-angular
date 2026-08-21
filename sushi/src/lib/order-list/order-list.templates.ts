import { Directive } from '@angular/core';
import { OrderListFilterContext, OrderListItemContext } from './order-list.interfaces';

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
export class OrderListItemTemplate {
  public static ngTemplateContextGuard(_directive: OrderListItemTemplate, _context: unknown): _context is OrderListItemContext {
    return true;
  }
}

/** Adds content above the filter and ordered collection. */
@Directive({ selector: 'ng-template[suiOrderListHeader]' })
export class OrderListHeaderTemplate {}
