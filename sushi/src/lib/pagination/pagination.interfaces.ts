import { ComponentSize, ThemeSeverity } from '../sushi.types';

/** Size scale available to pagination controls. */
export type PaginationSize = ComponentSize;

/** Semantic colors available to the current page action. */
export type PaginationSeverity = ThemeSeverity;

/** Navigation actions rendered around the numbered page links. */
export type PaginationNavigation = 'first' | 'previous' | 'next' | 'last';

/** Accessible labels used by pagination navigation. */
export interface PaginationLabels {
  /** First-page action. */
  readonly first: string;
  /** Previous-page action. */
  readonly previous: string;
  /** Next-page action. */
  readonly next: string;
  /** Last-page action. */
  readonly last: string;
  /** Editable current-page field. */
  readonly pageInput: string;
  /** Page-size selector. */
  readonly pageSize: string;
  /** Numbered page action. */
  readonly page: (page: number) => string;
}

/** Current pagination boundaries exposed to reports and page templates. */
export interface PaginationState {
  /** Current one-based page. */
  readonly page: number;
  /** Total number of available pages. */
  readonly pageCount: number;
  /** Number of items represented by one page. */
  readonly pageSize: number;
  /** Total number of items in the collection. */
  readonly totalItems: number;
  /** One-based index of the first visible item, or zero for an empty collection. */
  readonly firstItem: number;
  /** One-based index of the last visible item, or zero for an empty collection. */
  readonly lastItem: number;
}

/** Context exposed to a custom numbered page action. */
export interface PaginationPageContext extends PaginationState {
  /** Page rendered by the current template instance. */
  readonly $implicit: number;
  /** Whether the rendered page is current. */
  readonly current: boolean;
}

/** Context exposed to a custom first, previous, next, or last action. */
export interface PaginationNavigationContext extends PaginationState {
  /** Navigation action rendered by the current template instance. */
  readonly $implicit: PaginationNavigation;
  /** Navigation action rendered by the current template instance. */
  readonly navigation: PaginationNavigation;
  /** Accessible label configured for the action. */
  readonly label: string;
}

/** Context exposed to a custom current-page report. */
export type PaginationReportContext = PaginationState;
