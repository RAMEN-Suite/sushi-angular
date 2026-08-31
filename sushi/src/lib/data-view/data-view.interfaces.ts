/** Layout used to arrange DataView items. */
export type DataViewLayout = 'list' | 'grid';

/** Position of the optional pagination controls. */
export type DataViewPaginatorPosition = 'top' | 'bottom' | 'both';

/** Identifies a rendered item across collection updates. */
export type DataViewTrackBy<T> = (index: number, item: T) => unknown;

/** Item data exposed to the repeated DataView template. */
export interface DataViewItemContext<T> {
  /** Current item. */
  readonly $implicit: T;
  /** Current item. */
  readonly item: T;
  /** Active collection layout. */
  readonly layout: DataViewLayout;
  /** Zero-based index within the rendered collection. */
  readonly index: number;
  /** Number of currently rendered items. */
  readonly count: number;
  /** Whether this is the first rendered item. */
  readonly first: boolean;
  /** Whether this is the last rendered item. */
  readonly last: boolean;
}

/** Collection state exposed to structural DataView templates. */
export interface DataViewCollectionContext<T> {
  /** Items currently rendered after local pagination. */
  readonly $implicit: readonly T[];
  /** Items currently rendered after local pagination. */
  readonly items: readonly T[];
  /** Complete input collection when pagination is local. */
  readonly source: readonly T[];
  /** Active collection layout. */
  readonly layout: DataViewLayout;
  /** One-based current page. */
  readonly page: number;
  /** Number of items requested per page. */
  readonly pageSize: number;
  /** Total number of available items. */
  readonly totalItems: number;
}

/** State and action exposed to a custom infinite-scroll control. */
export interface DataViewLoadMoreContext {
  /** Whether the next collection segment is loading. */
  readonly loading: boolean;
  /** Whether another collection segment is available. */
  readonly hasMore: boolean;
  /** Requests the next collection segment. */
  readonly load: () => void;
}
