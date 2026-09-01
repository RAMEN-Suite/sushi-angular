import { ComponentSize } from '../sushi.types';

/** Size scale controlling list row density. */
export type ListSize = ComponentSize;

/** Identifies a rendered item across collection updates. */
export type ListTrackBy<T> = (index: number, item: T) => unknown;

/** Item and position data exposed to the list item template. */
export interface ListItemContext<T> {
  readonly $implicit: T;
  readonly item: T;
  readonly index: number;
  readonly count: number;
  readonly first: boolean;
  readonly last: boolean;
  readonly even: boolean;
  readonly odd: boolean;
}
