import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { LucideGrid2x2, LucideList } from '@lucide/angular';
import { Button } from '../button';
import { nonNegativeInteger, positiveInteger } from '../number.transforms';
import { Pagination } from '../pagination';
import { SelectButton, SelectButtonOption, SelectButtonOptionTemplate, SelectButtonValue } from '../select-button';
import { Spinner } from '../spinner';
import {
  DataViewCollectionContext,
  DataViewItemContext,
  DataViewLayout,
  DataViewLoadMoreContext,
  DataViewPaginatorPosition,
  DataViewTrackBy,
} from './data-view.interfaces';
import {
  DataViewEmptyTemplate,
  DataViewFooterTemplate,
  DataViewHeaderTemplate,
  DataViewItemTemplate,
  DataViewLoadMoreTemplate,
  DataViewLoadingTemplate,
} from './data-view.templates';

/** Renders a typed collection in switchable list or responsive grid layouts. */
@Component({
  selector: 'sui-data-view',
  imports: [Button, LucideGrid2x2, LucideList, NgTemplateOutlet, Pagination, SelectButton, SelectButtonOptionTemplate, Spinner],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.css',
  host: {
    class: 'sui-data-view block min-w-0 max-w-full',
    '[attr.aria-busy]': 'loading() || loadingMore()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataView<T> {
  /** Active collection layout. */
  public readonly layout: ModelSignal<DataViewLayout> = model<DataViewLayout>('list');
  /** One-based current page. */
  public readonly page: ModelSignal<number> = model<number>(1);
  /** Number of items represented by one page. */
  public readonly pageSize: ModelSignal<number> = model<number>(6);

  /** Source collection, or the current remote page when `lazy` is enabled. */
  public readonly items: InputSignal<readonly T[]> = input.required<readonly T[]>();
  /** Returns a stable identity for one item. */
  public readonly trackBy: InputSignal<DataViewTrackBy<T>> = input<DataViewTrackBy<T>>((_index: number, item: T): T => item);

  /** Layouts available in the built-in layout selector. */
  public readonly layouts: InputSignal<readonly DataViewLayout[]> = input<readonly DataViewLayout[]>(['list']);
  /** Accessible name for the item collection. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of an element that names the item collection. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** Accessible name for the optional layout selector. */
  public readonly layoutLabel: InputSignal<string> = input<string>('Layout');
  /** Message shown when no items are available. */
  public readonly emptyMessage: InputSignal<string> = input<string>('No items found');
  /** Message announced while items are loading. */
  public readonly loadingMessage: InputSignal<string> = input<string>('Loading items');
  /** Minimum responsive width of one grid item. */
  public readonly minItemWidth: InputSignal<string> = input<string>('16rem');
  /** CSS height of an optional independently scrolling collection viewport. */
  public readonly scrollHeight: InputSignal<string | null> = input<string | null>(null);

  /** Enables the built-in Pagination component. */
  public readonly paginate: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Renders pagination above, below, or on both sides of the collection. */
  public readonly paginatorPosition: InputSignal<DataViewPaginatorPosition> = input<DataViewPaginatorPosition>('bottom');
  /** Available item counts in the pagination page-size selector. */
  public readonly pageSizeOptions: InputSignal<readonly number[]> = input<readonly number[]>([]);
  /** Maximum number of consecutive page links. */
  public readonly pageLinkSize: InputSignalWithTransform<number, unknown> = input(5, { transform: positiveInteger });
  /** Treats `items` as one externally loaded page instead of slicing it locally. */
  public readonly lazy: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Total remote collection size used when `lazy` is enabled. */
  public readonly totalItems: InputSignalWithTransform<number, unknown> = input(0, { transform: nonNegativeInteger });
  /** Shows the loading state instead of collection items. */
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Observes the collection boundary for incremental loading and suppresses pagination. */
  public readonly infiniteScroll: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Keeps the infinite-scroll boundary available while another segment exists. */
  public readonly hasMore: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Shows incremental loading and prevents duplicate requests. */
  public readonly loadingMore: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Preload distance in pixels from the active viewport boundary. */
  public readonly loadMoreDistance: InputSignalWithTransform<number, unknown> = input(160, {
    transform: nonNegativeInteger,
  });
  /** Text shown by the default incremental-loading action. */
  public readonly loadMoreLabel: InputSignal<string> = input<string>('Load more');

  /** Emits when the collection needs the next externally managed segment. */
  public readonly loadMore: OutputEmitterRef<void> = output();

  protected readonly itemTemplate: Signal<TemplateRef<DataViewItemContext<T>>> = contentChild.required(DataViewItemTemplate, {
    read: TemplateRef,
  });
  protected readonly headerTemplate: Signal<TemplateRef<DataViewCollectionContext<T>> | undefined> = contentChild(
    DataViewHeaderTemplate,
    { read: TemplateRef },
  );
  protected readonly emptyTemplate: Signal<TemplateRef<DataViewCollectionContext<T>> | undefined> = contentChild(
    DataViewEmptyTemplate,
    { read: TemplateRef },
  );
  protected readonly loadingTemplate: Signal<TemplateRef<DataViewCollectionContext<T>> | undefined> = contentChild(
    DataViewLoadingTemplate,
    { read: TemplateRef },
  );
  protected readonly loadMoreTemplate: Signal<TemplateRef<DataViewLoadMoreContext> | undefined> = contentChild(
    DataViewLoadMoreTemplate,
    { read: TemplateRef },
  );
  protected readonly footerTemplate: Signal<TemplateRef<DataViewCollectionContext<T>> | undefined> = contentChild(
    DataViewFooterTemplate,
    { read: TemplateRef },
  );
  protected readonly scrollViewport: Signal<ElementRef<HTMLElement>> = viewChild.required('scrollViewport');
  protected readonly loadMoreTrigger: Signal<ElementRef<HTMLElement> | undefined> = viewChild('loadMoreTrigger');

  protected readonly layoutOptions: Signal<readonly SelectButtonOption[]> = computed((): readonly SelectButtonOption[] =>
    this.layouts().map((layout: DataViewLayout): SelectButtonOption => ({
      label: layout === 'list' ? 'List' : 'Grid',
      value: layout,
    })),
  );
  protected readonly normalizedPageSize: Signal<number> = computed((): number => positiveInteger(this.pageSize()));
  protected readonly collectionSize: Signal<number> = computed((): number =>
    this.lazy() ? this.totalItems() : this.items().length,
  );
  protected readonly currentPage: Signal<number> = computed((): number => {
    const pageCount: number = Math.max(1, Math.ceil(this.collectionSize() / this.normalizedPageSize()));
    return Math.min(pageCount, Math.max(1, Math.floor(this.page()) || 1));
  });
  protected readonly visibleItems: Signal<readonly T[]> = computed((): readonly T[] => {
    if (!this.paginate() || this.lazy() || this.infiniteScroll()) return this.items();
    const start: number = (this.currentPage() - 1) * this.normalizedPageSize();
    return this.items().slice(start, start + this.normalizedPageSize());
  });
  protected readonly collectionContext: Signal<DataViewCollectionContext<T>> = computed((): DataViewCollectionContext<T> => ({
    $implicit: this.visibleItems(),
    items: this.visibleItems(),
    source: this.items(),
    layout: this.layout(),
    page: this.currentPage(),
    pageSize: this.normalizedPageSize(),
    totalItems: this.collectionSize(),
  }));
  protected readonly loadMoreContext: Signal<DataViewLoadMoreContext> = computed((): DataViewLoadMoreContext => ({
    loading: this.loadingMore(),
    hasMore: this.hasMore(),
    load: (): void => this.handleLoadMore(),
  }));

  private lastAutoLoadSize: number = -1;

  public constructor() {
    afterRenderEffect((onCleanup): void => {
      const trigger: ElementRef<HTMLElement> | undefined = this.loadMoreTrigger();
      if (!trigger || !this.infiniteScroll() || !this.hasMore() || this.loadingMore()) return;
      if (typeof IntersectionObserver === 'undefined') return;

      const observer: IntersectionObserver = new IntersectionObserver(
        (entries: readonly IntersectionObserverEntry[]): void => {
          if (entries.some((entry: IntersectionObserverEntry): boolean => entry.isIntersecting)) this.requestMore(true);
        },
        {
          root: this.scrollHeight() ? this.scrollViewport().nativeElement : null,
          rootMargin: `0px 0px ${this.loadMoreDistance()}px`,
        },
      );
      observer.observe(trigger.nativeElement);
      onCleanup((): void => observer.disconnect());
    });
  }

  protected showPaginator(position: 'top' | 'bottom'): boolean {
    const configured: DataViewPaginatorPosition = this.paginatorPosition();
    return this.paginate() && !this.infiniteScroll() && (configured === position || configured === 'both');
  }

  protected handleLayout(value: SelectButtonValue | null): void {
    if (value === 'list' || value === 'grid') this.layout.set(value);
  }

  protected trackItem(index: number, item: T): unknown {
    return this.trackBy()(index, item);
  }

  protected handleLoadMore(): void {
    this.requestMore(false);
  }

  protected itemContext(item: T, index: number, count: number): DataViewItemContext<T> {
    return {
      $implicit: item,
      item,
      layout: this.layout(),
      index,
      count,
      first: index === 0,
      last: index === count - 1,
    };
  }

  private requestMore(automatic: boolean): void {
    if (!this.infiniteScroll() || !this.hasMore() || this.loadingMore()) return;
    const size: number = this.items().length;
    if (automatic && this.lastAutoLoadSize === size) return;
    this.lastAutoLoadSize = size;
    this.loadMore.emit();
  }
}
