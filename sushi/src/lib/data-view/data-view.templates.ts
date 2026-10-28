import { Directive, input, type InputSignal } from '@angular/core';
import { type DataViewCollectionContext, type DataViewItemContext, type DataViewLoadMoreContext } from './data-view.interfaces';

/** Renders every item and exposes its layout and page position. */
@Directive({ selector: 'ng-template[suiDataViewItem]' })
export class DataViewItemTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiDataViewItem',
  });

  public static ngTemplateContextGuard<T>(
    _directive: DataViewItemTemplate<T>,
    _context: unknown,
  ): _context is DataViewItemContext<T> {
    return true;
  }
}

/** Replaces the content above the collection. */
@Directive({ selector: 'ng-template[suiDataViewHeader]' })
export class DataViewHeaderTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiDataViewHeader',
  });

  public static ngTemplateContextGuard<T>(
    _directive: DataViewHeaderTemplate<T>,
    _context: unknown,
  ): _context is DataViewCollectionContext<T> {
    return true;
  }
}

/** Replaces the empty collection state. */
@Directive({ selector: 'ng-template[suiDataViewEmpty]' })
export class DataViewEmptyTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiDataViewEmpty',
  });

  public static ngTemplateContextGuard<T>(
    _directive: DataViewEmptyTemplate<T>,
    _context: unknown,
  ): _context is DataViewCollectionContext<T> {
    return true;
  }
}

/** Replaces the loading collection state. */
@Directive({ selector: 'ng-template[suiDataViewLoading]' })
export class DataViewLoadingTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiDataViewLoading',
  });

  public static ngTemplateContextGuard<T>(
    _directive: DataViewLoadingTemplate<T>,
    _context: unknown,
  ): _context is DataViewCollectionContext<T> {
    return true;
  }
}

/** Replaces the control shown at the infinite-scroll boundary. */
@Directive({ selector: 'ng-template[suiDataViewLoadMore]' })
export class DataViewLoadMoreTemplate {
  public static ngTemplateContextGuard(
    _directive: DataViewLoadMoreTemplate,
    _context: unknown,
  ): _context is DataViewLoadMoreContext {
    return true;
  }
}

/** Renders optional content below the collection. */
@Directive({ selector: 'ng-template[suiDataViewFooter]' })
export class DataViewFooterTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiDataViewFooter',
  });

  public static ngTemplateContextGuard<T>(
    _directive: DataViewFooterTemplate<T>,
    _context: unknown,
  ): _context is DataViewCollectionContext<T> {
    return true;
  }
}
