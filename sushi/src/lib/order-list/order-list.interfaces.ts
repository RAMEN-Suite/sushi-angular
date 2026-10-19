import { type ListItemContext, type ListSize } from '../list';
import { type SelectionValue } from '../sushi.types';

/** Stable identity of an OrderList item. Object values must retain their reference. */
export type OrderListValue = SelectionValue;

/** Reorderable item. Values must be unique; disabled items cannot be moved directly, but are not pinned. */
export interface OrderListOption {
  /** Visible text used by the default row and movement announcements. */
  readonly label: string;
  /** Unique stable identity used to preserve the row and its content when moving. */
  readonly value: OrderListValue;
  /** Prevents moving this item directly. Other items can still move past it. */
  readonly disabled?: boolean;
}

/** Row density shared with List. */
export type OrderListSize = ListSize;

/** Context of a rich row. Sorting never selects or activates its content. */
export interface OrderListItemContext<I extends OrderListOption = OrderListOption> extends ListItemContext<I> {
  /** Whether the entire control is disabled. Consumers can bind this to their own controls. */
  readonly disabled: boolean;
  /** Whether this item can currently be moved. */
  readonly reorderable: boolean;
}

/** Result of moving one item within the supplied collection. Positions are zero-based. */
export interface OrderListReorderEvent<I extends OrderListOption = OrderListOption> {
  /** Item that moved. */
  readonly item: I;
  /** Previous index in the complete collection. */
  readonly previousIndex: number;
  /** New index in the complete collection. */
  readonly currentIndex: number;
}

/** Localisable text and formatters. Override only the entries needed by the application. */
export interface OrderListLabels<I extends OrderListOption = OrderListOption> {
  /** Accessible name of the combined drag handle and movement menu. */
  readonly reorder: (item: I) => string;
  /** Menu action that moves an item one position earlier. */
  readonly moveUp: string;
  /** Menu action that moves an item one position later. */
  readonly moveDown: string;
  /** Menu action that moves an item to the beginning. */
  readonly moveToTop: string;
  /** Menu action that moves an item to the end. */
  readonly moveToBottom: string;
  /** Message displayed for an empty collection. */
  readonly empty: string;
  /** Instructions associated with each handle. */
  readonly instructions: string;
  /** Live announcement after a move. */
  readonly moved: (event: OrderListReorderEvent<I>, count: number) => string;
}
