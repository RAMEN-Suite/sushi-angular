import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  numberAttribute,
  Signal,
  TemplateRef,
} from '@angular/core';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown } from '@lucide/angular';
import { Button } from '../button';
import { Spinner } from '../spinner';
import {
  TableCellContext,
  TableCollectionContext,
  TableColumn,
  TableHeaderContext,
  TableRowContext,
  TableSize,
  TableSort,
  TableSortDirection,
  TableTrackBy,
} from './table.interfaces';
import {
  TableCaptionTemplate,
  TableCellTemplate,
  TableEmptyTemplate,
  TableFooterTemplate,
  TableHeaderTemplate,
  TableLoadingTemplate,
  TableRowTemplate,
} from './table.templates';

/** Renders a typed collection as a native data table with controlled sorting. */
@Component({
  selector: 'sui-table',
  imports: [Button, LucideArrowDown, LucideArrowUp, LucideArrowUpDown, NgTemplateOutlet, Spinner],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  host: { class: 'sui-table block w-full min-w-0 max-w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table<T> {
  /** Controlled sorting request. Consumers apply it to local or remote rows. */
  public readonly sort: ModelSignal<TableSort | null> = model<TableSort | null>(null);

  /** Collection rendered in source order. */
  public readonly rows: InputSignal<readonly T[]> = input.required<readonly T[]>();
  /** Column definitions rendered in source order. */
  public readonly columns: InputSignal<readonly TableColumn<T>[]> = input.required<readonly TableColumn<T>[]>();
  /** Returns a stable identity for one row. */
  public readonly trackBy: InputSignal<TableTrackBy<T>> = input<TableTrackBy<T>>((_index: number, row: T): T => row);

  /** Native table caption used when no caption template is provided. */
  public readonly caption: InputSignal<string | null> = input<string | null>(null);
  /** Message shown when the collection is empty. */
  public readonly emptyMessage: InputSignal<string> = input<string>('No records found');
  /** Message announced while rows are loading. */
  public readonly loadingMessage: InputSignal<string> = input<string>('Loading records');
  /** Accessible name used when the table has no caption. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of an element that names the table. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);

  /** Controls table cell density. */
  public readonly size: InputSignal<TableSize> = input<TableSize>('md');
  /** Alternates body row backgrounds. */
  public readonly zebra: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Draws borders between table cells. */
  public readonly showGridlines: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });
  /** Applies the DaisyUI hover treatment to generated body rows. */
  public readonly rowHover: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Keeps the heading visible within a vertically scrolling parent. */
  public readonly stickyHeader: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Keeps the first column visible while the table scrolls horizontally. */
  public readonly pinFirstColumn: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });
  /** Maximum table viewport height in pixels when the heading is sticky. */
  public readonly scrollHeight: InputSignalWithTransform<number, unknown> = input(320, { transform: numberAttribute });
  /** Shows the loading state instead of body rows. */
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  protected readonly captionTemplate: Signal<TemplateRef<TableCollectionContext<T>> | undefined> = contentChild(
    TableCaptionTemplate,
    { read: TemplateRef },
  );
  protected readonly headerTemplate: Signal<TemplateRef<TableHeaderContext<T>> | undefined> = contentChild(TableHeaderTemplate, {
    read: TemplateRef,
  });
  protected readonly cellTemplate: Signal<TemplateRef<TableCellContext<T>> | undefined> = contentChild(TableCellTemplate, {
    read: TemplateRef,
  });
  protected readonly rowTemplate: Signal<TemplateRef<TableRowContext<T>> | undefined> = contentChild(TableRowTemplate, {
    read: TemplateRef,
  });
  protected readonly emptyTemplate: Signal<TemplateRef<TableCollectionContext<T>> | undefined> = contentChild(
    TableEmptyTemplate,
    { read: TemplateRef },
  );
  protected readonly loadingTemplate: Signal<TemplateRef<TableCollectionContext<T>> | undefined> = contentChild(
    TableLoadingTemplate,
    { read: TemplateRef },
  );
  protected readonly footerTemplate: Signal<TemplateRef<TableCollectionContext<T>> | undefined> = contentChild(
    TableFooterTemplate,
    { read: TemplateRef },
  );

  protected readonly collectionContext: Signal<TableCollectionContext<T>> = computed((): TableCollectionContext<T> => ({
    $implicit: this.rows(),
    rows: this.rows(),
    columns: this.columns(),
  }));
  protected readonly columnCount: Signal<number> = computed((): number => Math.max(1, this.columns().length));

  protected trackRow(index: number, row: T): unknown {
    return this.trackBy()(index, row);
  }

  protected alignment(column: TableColumn<T>): string {
    return `sui-table__cell--${column.align ?? 'start'}`;
  }

  protected direction(column: TableColumn<T>): TableSortDirection | null {
    const sort: TableSort | null = this.sort();
    return sort?.key === column.key ? sort.direction : null;
  }

  protected ariaSort(column: TableColumn<T>): TableSortDirection | 'none' | null {
    return column.sortable ? (this.direction(column) ?? 'none') : null;
  }

  protected toggleSort(column: TableColumn<T>): void {
    if (!column.sortable || this.loading()) return;
    const current: TableSortDirection | null = this.direction(column);
    if (current === 'descending') {
      this.sort.set(null);
      return;
    }
    this.sort.set({ key: column.key, direction: current === 'ascending' ? 'descending' : 'ascending' });
  }

  protected headerContext(column: TableColumn<T>, index: number): TableHeaderContext<T> {
    return { $implicit: column, column, index, direction: this.direction(column) };
  }

  protected cellContext(row: T, column: TableColumn<T>, rowIndex: number, columnIndex: number): TableCellContext<T> {
    const value: unknown = column.value?.(row);
    return { $implicit: value, value, row, column, rowIndex, columnIndex };
  }

  protected rowContext(row: T, rowIndex: number): TableRowContext<T> {
    return { $implicit: row, row, columns: this.columns(), rowIndex };
  }
}
