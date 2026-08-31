import { Directive } from '@angular/core';
import { DataViewCollectionContext, DataViewItemContext, DataViewLoadMoreContext } from './data-view.interfaces';

/** Renders every item and exposes its layout and page position. */
@Directive({ selector: 'ng-template[suiDataViewItem]' })
export class DataViewItemTemplate {
  declare public static readonly ngTemplateContextType: DataViewItemContext<unknown>;
}

/** Replaces the content above the collection. */
@Directive({ selector: 'ng-template[suiDataViewHeader]' })
export class DataViewHeaderTemplate {
  declare public static readonly ngTemplateContextType: DataViewCollectionContext<unknown>;
}

/** Replaces the empty collection state. */
@Directive({ selector: 'ng-template[suiDataViewEmpty]' })
export class DataViewEmptyTemplate {
  declare public static readonly ngTemplateContextType: DataViewCollectionContext<unknown>;
}

/** Replaces the loading collection state. */
@Directive({ selector: 'ng-template[suiDataViewLoading]' })
export class DataViewLoadingTemplate {
  declare public static readonly ngTemplateContextType: DataViewCollectionContext<unknown>;
}

/** Replaces the control shown at the infinite-scroll boundary. */
@Directive({ selector: 'ng-template[suiDataViewLoadMore]' })
export class DataViewLoadMoreTemplate {
  declare public static readonly ngTemplateContextType: DataViewLoadMoreContext;
}

/** Renders optional content below the collection. */
@Directive({ selector: 'ng-template[suiDataViewFooter]' })
export class DataViewFooterTemplate {
  declare public static readonly ngTemplateContextType: DataViewCollectionContext<unknown>;
}
