import { Directive } from '@angular/core';
import { TableCellContext, TableCollectionContext, TableHeaderContext, TableRowContext } from './table.interfaces';

/** Replaces the native caption and exposes the rendered collection. */
@Directive({ selector: 'ng-template[suiTableCaption]' })
export class TableCaptionTemplate {
  declare public static readonly ngTemplateContextType: TableCollectionContext<unknown>;
}

/** Replaces every column heading and exposes its sort direction. */
@Directive({ selector: 'ng-template[suiTableHeader]' })
export class TableHeaderTemplate {
  declare public static readonly ngTemplateContextType: TableHeaderContext<unknown>;
}

/** Replaces every body cell and exposes its row, column, value, and indexes. */
@Directive({ selector: 'ng-template[suiTableCell]' })
export class TableCellTemplate {
  declare public static readonly ngTemplateContextType: TableCellContext<unknown>;
}

/** Replaces every complete body row for advanced selection, expansion, or editing layouts. */
@Directive({ selector: 'ng-template[suiTableRow]' })
export class TableRowTemplate {
  declare public static readonly ngTemplateContextType: TableRowContext<unknown>;
}

/** Replaces the empty collection row. */
@Directive({ selector: 'ng-template[suiTableEmpty]' })
export class TableEmptyTemplate {
  declare public static readonly ngTemplateContextType: TableCollectionContext<unknown>;
}

/** Replaces the loading row. */
@Directive({ selector: 'ng-template[suiTableLoading]' })
export class TableLoadingTemplate {
  declare public static readonly ngTemplateContextType: TableCollectionContext<unknown>;
}

/** Renders an optional footer spanning the complete table. */
@Directive({ selector: 'ng-template[suiTableFooter]' })
export class TableFooterTemplate {
  declare public static readonly ngTemplateContextType: TableCollectionContext<unknown>;
}
