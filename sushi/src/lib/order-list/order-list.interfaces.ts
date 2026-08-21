import { SelectionFilterContext, SelectionOption } from '../selection';
import { SelectionValue } from '../sushi.types';

/** Value that uniquely identifies an order-list item. */
export type OrderListValue = SelectionValue;

/** Item displayed and reordered by an order list. Values must be unique. */
export type OrderListOption = SelectionOption;

/** Context exposed when replacing the order-list filter control. */
export type OrderListFilterContext = SelectionFilterContext;

/** Context exposed to the order-list item template. */
export interface OrderListItemContext<T extends OrderListOption = OrderListOption> {
  readonly $implicit: T;
  readonly option: T;
  readonly index: number;
  readonly selected: boolean;
}
