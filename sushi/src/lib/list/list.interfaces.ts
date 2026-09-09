import { ComponentSize } from '../sushi.types';

/** Size scale controlling list row density. */
export type ListSize = ComponentSize;

/** Identifies a rendered item across collection updates. */
export type ListTrackBy<T> = (index: number, item: T) => unknown;

/** Item and position data exposed to the list item template. */
export interface ListItemContext<T> {
  /** Current item, available as the implicit template value. */
  readonly $implicit: T;
  /** Current item. */
  readonly item: T;
  /** Zero-based item index. */
  readonly index: number;
  /** Number of rendered items. */
  readonly count: number;
  /** Whether this is the first rendered item. */
  readonly first: boolean;
  /** Whether this is the last rendered item. */
  readonly last: boolean;
  /** Whether the item has an even zero-based index. */
  readonly even: boolean;
  /** Whether the item has an odd zero-based index. */
  readonly odd: boolean;
}
