import { ComponentSize } from '../sushi.types';

/** Size scale available to table cells. */
export type TableSize = ComponentSize;

/** Horizontal alignment of a column's header and cells. */
export type TableAlignment = 'start' | 'center' | 'end';

/** Direction requested for a sortable column. */
export type TableSortDirection = 'ascending' | 'descending';

/** Controlled sorting state emitted by a Table. */
export interface TableSort {
  /** Stable key of the sorted column. */
  readonly key: string;
  /** Requested sorting direction. */
  readonly direction: TableSortDirection;
}

/** Describes one rendered table column. */
export interface TableColumn<T> {
  /** Stable column identity used by sorting and templates. */
  readonly key: string;
  /** Visible column heading. */
  readonly header: string;
  /** Resolves the default cell content from a row. Omit for template-only columns. */
  readonly value?: (row: T) => unknown;
  /** Enables the controlled sorting action for this column. */
  readonly sortable?: boolean;
  /** Aligns the column's heading and cell content. */
  readonly align?: TableAlignment;
  /** Minimum column width used before horizontal scrolling begins. */
  readonly minWidth?: string;
  /** Preferred column width passed to the native header and body cells. */
  readonly width?: string;
  /** Renders body cells as native row headings with `scope="row"`. */
  readonly rowHeader?: boolean;
}

/** Identifies a rendered row across collection updates. */
export type TableTrackBy<T> = (index: number, row: T) => unknown;

/** Column data exposed to a custom header template. */
export interface TableHeaderContext<T> {
  /** Current column. */
  readonly $implicit: TableColumn<T>;
  /** Current column. */
  readonly column: TableColumn<T>;
  /** Zero-based column index. */
  readonly index: number;
  /** Active direction, or null when the column is not sorted. */
  readonly direction: TableSortDirection | null;
}

/** Row and column data exposed to a custom cell template. */
export interface TableCellContext<T> {
  /** Resolved cell value. */
  readonly $implicit: unknown;
  /** Resolved cell value. */
  readonly value: unknown;
  /** Current row. */
  readonly row: T;
  /** Current column. */
  readonly column: TableColumn<T>;
  /** Zero-based row index. */
  readonly rowIndex: number;
  /** Zero-based column index. */
  readonly columnIndex: number;
}

/** Row data exposed when replacing the complete native body row. */
export interface TableRowContext<T> {
  /** Current row. */
  readonly $implicit: T;
  /** Current row. */
  readonly row: T;
  /** Configured columns. */
  readonly columns: readonly TableColumn<T>[];
  /** Zero-based row index. */
  readonly rowIndex: number;
}

/** Collection data exposed to structural table templates. */
export interface TableCollectionContext<T> {
  /** Currently rendered rows. */
  readonly $implicit: readonly T[];
  /** Currently rendered rows. */
  readonly rows: readonly T[];
  /** Configured columns. */
  readonly columns: readonly TableColumn<T>[];
}
