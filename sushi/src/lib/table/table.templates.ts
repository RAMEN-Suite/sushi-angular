import { Directive, input, type InputSignal } from '@angular/core';
import {
  type TableCellContext,
  type TableCollectionContext,
  type TableHeaderContext,
  type TableRowContext,
} from './table.interfaces';

/** Replaces the native caption and exposes the rendered collection. */
@Directive({ selector: 'ng-template[suiTableCaption]' })
export class TableCaptionTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiTableCaption',
  });

  public static ngTemplateContextGuard<T>(
    _directive: TableCaptionTemplate<T>,
    _context: unknown,
  ): _context is TableCollectionContext<T> {
    return true;
  }
}

/** Replaces every column heading and exposes its sort direction. */
@Directive({ selector: 'ng-template[suiTableHeader]' })
export class TableHeaderTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiTableHeader',
  });

  public static ngTemplateContextGuard<T>(
    _directive: TableHeaderTemplate<T>,
    _context: unknown,
  ): _context is TableHeaderContext<T> {
    return true;
  }
}

/** Replaces every body cell and exposes its row, column, value, and indexes. */
@Directive({ selector: 'ng-template[suiTableCell]' })
export class TableCellTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiTableCell',
  });

  public static ngTemplateContextGuard<T>(_directive: TableCellTemplate<T>, _context: unknown): _context is TableCellContext<T> {
    return true;
  }
}

/** Replaces every complete body row for advanced selection, expansion, or editing layouts. */
@Directive({ selector: 'ng-template[suiTableRow]' })
export class TableRowTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiTableRow',
  });

  public static ngTemplateContextGuard<T>(_directive: TableRowTemplate<T>, _context: unknown): _context is TableRowContext<T> {
    return true;
  }
}

/** Replaces the empty collection row. */
@Directive({ selector: 'ng-template[suiTableEmpty]' })
export class TableEmptyTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiTableEmpty',
  });

  public static ngTemplateContextGuard<T>(
    _directive: TableEmptyTemplate<T>,
    _context: unknown,
  ): _context is TableCollectionContext<T> {
    return true;
  }
}

/** Replaces the loading row. */
@Directive({ selector: 'ng-template[suiTableLoading]' })
export class TableLoadingTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiTableLoading',
  });

  public static ngTemplateContextGuard<T>(
    _directive: TableLoadingTemplate<T>,
    _context: unknown,
  ): _context is TableCollectionContext<T> {
    return true;
  }
}

/** Renders an optional footer spanning the complete table. */
@Directive({ selector: 'ng-template[suiTableFooter]' })
export class TableFooterTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiTableFooter',
  });

  public static ngTemplateContextGuard<T>(
    _directive: TableFooterTemplate<T>,
    _context: unknown,
  ): _context is TableCollectionContext<T> {
    return true;
  }
}
