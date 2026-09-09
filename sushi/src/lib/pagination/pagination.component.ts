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
  Signal,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { LucideChevronLeft, LucideChevronRight, LucideChevronsLeft, LucideChevronsRight } from '@lucide/angular';
import { AutoFocus } from '../auto-focus';
import { Button } from '../button';
import { Input } from '../input';
import { integerAtLeast, nonNegativeInteger, positiveInteger } from '../number.transforms';
import { Select } from '../select';
import type { SelectModelValue, SelectOption } from '../select';
import type {
  PaginationLabels,
  PaginationNavigation,
  PaginationNavigationContext,
  PaginationPageContext,
  PaginationReportContext,
  PaginationSeverity,
  PaginationSize,
  PaginationState,
  PaginationVariant,
} from './pagination.interfaces';
import { PaginationNavigationTemplate, PaginationPageTemplate, PaginationReportTemplate } from './pagination.templates';

const DEFAULT_LABELS: PaginationLabels = {
  first: 'First page',
  previous: 'Previous page',
  next: 'Next page',
  last: 'Last page',
  pageInput: 'Edit current page',
  pageSize: 'Items per page',
  page: (page: number): string => `Page ${page}`,
};

/** Navigates a one-based page model across a known collection size. */
@Component({
  selector: 'sui-pagination',
  imports: [
    AutoFocus,
    Button,
    Input,
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronsLeft,
    LucideChevronsRight,
    NgTemplateOutlet,
    Select,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  host: {
    class: 'sui-pagination flex max-w-full flex-wrap items-center justify-between gap-3',
    role: 'navigation',
    '[class.sui-pagination--plain]': 'variant() === "plain"',
    '[class.sui-pagination--joined]': 'variant() === "joined"',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  /** Requested one-based page. Rendered navigation clamps it to the available range. */
  public readonly page: ModelSignal<number> = model<number>(1);
  /** Controlled number of items represented by one page. */
  public readonly pageSize: ModelSignal<number> = model<number>(10);

  /** Total number of items across every page. */
  public readonly totalItems: InputSignalWithTransform<number, unknown> = input(0, { transform: nonNegativeInteger });
  /** Maximum number of consecutive numbered page actions. */
  public readonly pageLinkSize: InputSignalWithTransform<number, unknown> = input(5, { transform: positiveInteger });
  /** Available item counts shown in the optional page-size selector. */
  public readonly pageSizeOptions: InputSignal<readonly number[]> = input<readonly number[]>([]);
  /** Shows a checkmark beside the selected page size. */
  public readonly pageSizeCheckmark: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });

  /** Controls the dimensions of every pagination action. */
  public readonly size: InputSignal<PaginationSize> = input<PaginationSize>('md');
  /** Applies one semantic color to the current page. */
  public readonly severity: InputSignal<PaginationSeverity> = input<PaginationSeverity>('primary');
  /** Displays separate round actions or one connected button group. */
  public readonly variant: InputSignal<PaginationVariant> = input<PaginationVariant>('plain');
  /** Accessible name used when no visible label names the navigation. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>('Pagination');
  /** ID of an element that names the navigation. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** Accessible labels for navigation and page actions. */
  public readonly labels: InputSignal<PaginationLabels> = input<PaginationLabels>(DEFAULT_LABELS);

  /** Shows direct links to a moving window of pages. */
  public readonly showPageLinks: InputSignalWithTransform<boolean, unknown> = input(true, {
    transform: booleanAttribute,
  });
  /** Shows actions that move directly to the first and last pages. */
  public readonly showFirstLast: InputSignalWithTransform<boolean, unknown> = input(true, {
    transform: booleanAttribute,
  });
  /** Shows the current item range and total item count. */
  public readonly showReport: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });
  /** Makes the current page action editable for direct navigation. */
  public readonly showPageInput: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });
  /** Prevents navigation while keeping pagination actions focusable. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });

  protected readonly pageTemplate: Signal<TemplateRef<PaginationPageContext> | undefined> = contentChild(PaginationPageTemplate, {
    read: TemplateRef,
  });
  protected readonly navigationTemplate: Signal<TemplateRef<PaginationNavigationContext> | undefined> = contentChild(
    PaginationNavigationTemplate,
    { read: TemplateRef },
  );
  protected readonly reportTemplate: Signal<TemplateRef<PaginationReportContext> | undefined> = contentChild(
    PaginationReportTemplate,
    { read: TemplateRef },
  );
  protected readonly editingPage: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly normalizedPageSize: Signal<number> = computed(() => integerAtLeast(this.pageSize(), 1));
  protected readonly normalizedPageSizes: Signal<readonly number[]> = computed(() => {
    const sizes: readonly number[] = this.pageSizeOptions().map((size: number): number => integerAtLeast(size, 1));
    return [...new Set<number>([...sizes, this.normalizedPageSize()])];
  });
  protected readonly pageSizeSelectOptions: Signal<readonly SelectOption[]> = computed(() =>
    this.normalizedPageSizes().map((pageSize: number): SelectOption => ({ label: pageSize.toString(), value: pageSize })),
  );
  protected readonly pageCount: Signal<number> = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.normalizedPageSize())),
  );
  protected readonly currentPage: Signal<number> = computed(() => this.clamp(this.page()));
  protected readonly state: Signal<PaginationState> = computed(() => {
    const page: number = this.currentPage();
    const totalItems: number = this.totalItems();
    const pageSize: number = this.normalizedPageSize();
    const firstItem: number = totalItems ? (page - 1) * pageSize + 1 : 0;
    return {
      page,
      pageCount: this.pageCount(),
      pageSize,
      totalItems,
      firstItem,
      lastItem: Math.min(page * pageSize, totalItems),
    };
  });
  protected readonly visiblePages: Signal<readonly number[]> = computed(() => {
    const count: number = Math.min(this.pageLinkSize(), this.pageCount());
    const centeredStart: number = this.currentPage() - Math.floor(count / 2);
    const start: number = Math.min(Math.max(1, centeredStart), this.pageCount() - count + 1);
    return Array.from({ length: count }, (_value: unknown, index: number): number => start + index);
  });
  protected readonly displayedPages: Signal<readonly number[]> = computed(() =>
    this.showPageLinks() ? this.visiblePages() : [this.currentPage()],
  );

  protected selectPage(page: number): void {
    if (this.disabled()) return;
    const nextPage: number = this.clamp(page);
    if (nextPage !== this.page()) this.page.set(nextPage);
  }

  protected activatePage(page: number): void {
    if (page === this.currentPage() && this.showPageInput() && !this.disabled()) {
      this.editingPage.set(true);
      return;
    }
    this.selectPage(page);
  }

  protected pageContext(page: number): PaginationPageContext {
    const state: PaginationState = this.state();
    return {
      ...state,
      $implicit: page,
      current: page === state.page,
    };
  }

  protected navigationContext(navigation: PaginationNavigation): PaginationNavigationContext {
    return {
      ...this.state(),
      $implicit: navigation,
      navigation,
      label: this.labels()[navigation],
    };
  }

  protected navigationDisabled(navigation: PaginationNavigation): boolean {
    if (this.disabled()) return true;

    const atStart: boolean = this.currentPage() === 1;
    const atEnd: boolean = this.currentPage() === this.pageCount();
    return navigation === 'first' || navigation === 'previous' ? atStart : atEnd;
  }

  protected commitPageInput(inputElement: HTMLInputElement, event?: Event): void {
    event?.preventDefault();
    if (!this.disabled()) this.selectPage(Number(inputElement.value));
    this.editingPage.set(false);
  }

  protected cancelPageInput(event: Event, inputElement: HTMLInputElement): void {
    event.preventDefault();
    inputElement.value = this.currentPage().toString();
    this.editingPage.set(false);
  }

  protected handlePageSize(value: SelectModelValue): void {
    if (this.disabled() || typeof value !== 'number') return;
    this.pageSize.set(integerAtLeast(value, 1));
    this.page.set(1);
  }

  private clamp(page: number): number {
    return Math.min(this.pageCount(), Math.max(1, Math.floor(page) || 1));
  }
}
