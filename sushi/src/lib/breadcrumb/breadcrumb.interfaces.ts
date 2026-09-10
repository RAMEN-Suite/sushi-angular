/** One destination in a Breadcrumb trail. */
export interface BreadcrumbItem<T = string> {
  /** Consumer value exposed to templates and selection logic. */
  readonly value: T;
  /** Visible destination label. */
  readonly label: string;
  /** Angular Router destination for application navigation. */
  readonly routerLink?: string | readonly string[];
  /** Native URL for document or external navigation. */
  readonly href?: string;
  /** Marks the item as the current page. The last item is current by default. */
  readonly current?: boolean;
}

/** Data exposed to a custom Breadcrumb item template. */
export interface BreadcrumbItemContext<T> {
  /** Current item, available as the implicit template value. */
  readonly $implicit: BreadcrumbItem<T>;
  /** Current item. */
  readonly item: BreadcrumbItem<T>;
  /** Zero-based position in the trail. */
  readonly index: number;
  /** Whether this item represents the current page. */
  readonly current: boolean;
}
