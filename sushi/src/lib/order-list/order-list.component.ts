import { NgTemplateOutlet } from '@angular/common';
import { Listbox as AriaListbox, Option as AriaOption } from '@angular/aria/listbox';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  afterRenderEffect,
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
  output,
  OutputEmitterRef,
  Signal,
  signal,
  TemplateRef,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { LucideChevronDown, LucideChevronUp, LucideChevronsDown, LucideChevronsUp, LucideSearch } from '@lucide/angular';
import { Button } from '../button';
import { FormControlState } from '../form-control';
import { InputSurface, InputSurfaceControl } from '../input-surface';
import { filterSelectionOption } from '../selection';
import { OrderListFilterContext, OrderListItemContext, OrderListOption, OrderListValue } from './order-list.interfaces';
import { OrderListFilterTemplate, OrderListHeaderTemplate, OrderListItemTemplate } from './order-list.templates';

/** Sorts a collection with selection controls or optional drag and drop. */
@Component({
  selector: 'sui-order-list',
  imports: [
    AriaListbox,
    AriaOption,
    Button,
    CdkDrag,
    CdkDropList,
    CdkScrollable,
    InputSurface,
    InputSurfaceControl,
    LucideChevronDown,
    LucideChevronUp,
    LucideChevronsDown,
    LucideChevronsUp,
    LucideSearch,
    NgTemplateOutlet,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
  host: { class: 'sui-order-list block max-w-full', '[class.cursor-not-allowed]': 'disabled()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderList<T extends OrderListOption = OrderListOption>
  extends FormControlState
  implements FormValueControl<readonly T[]>
{
  /** Ordered collection controlled directly or through Signal Forms. */
  public readonly value: ModelSignal<readonly T[]> = model<readonly T[]>([]);

  /** Shows a text filter above the collection. */
  public readonly filter: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Placeholder displayed by the text filter. */
  public readonly filterPlaceholder: InputSignal<string> = input<string>('Filter items');
  /** Enables pointer and touch reordering. */
  public readonly dragDrop: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Limits the visible collection height in pixels before it scrolls. */
  public readonly scrollHeight: InputSignalWithTransform<number, unknown> = input(320, { transform: numberAttribute });

  /** ID assigned to the listbox. */
  public readonly id: InputSignal<string | null> = input<string | null>(null);
  /** Accessible label used when no visible label is available. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the element that labels the listbox. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** IDs of elements that describe the listbox. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);

  /** Prevents filtering, selection, and reordering and removes controls from sequential focus. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Emits when interaction with the collection completes. */
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly headerTemplate: Signal<TemplateRef<void> | undefined> = contentChild(OrderListHeaderTemplate, {
    read: TemplateRef,
  });
  protected readonly filterTemplate: Signal<TemplateRef<OrderListFilterContext> | undefined> = contentChild(
    OrderListFilterTemplate,
    { read: TemplateRef },
  );
  protected readonly itemTemplate: Signal<TemplateRef<OrderListItemContext<T>> | undefined> = contentChild(
    OrderListItemTemplate,
    { read: TemplateRef },
  );
  protected readonly listbox: Signal<AriaListbox<OrderListValue>> = viewChild.required(AriaListbox);

  protected readonly query: WritableSignal<string> = signal('');
  protected readonly selection: WritableSignal<readonly OrderListValue[]> = signal([]);
  protected readonly announcement: WritableSignal<string> = signal('');
  protected readonly updateFilter: (query: string) => void = (query: string): void => {
    if (!this.disabled()) this.query.set(query);
  };
  protected readonly filterContext: Signal<OrderListFilterContext> = computed((): OrderListFilterContext => ({
    $implicit: this.query(),
    query: this.query(),
    placeholder: this.filterPlaceholder(),
    disabled: this.disabled(),
    readOnly: false,
    update: this.updateFilter,
  }));
  protected readonly ariaSelection: Signal<OrderListValue[]> = computed((): OrderListValue[] => [...this.selection()]);
  protected readonly visibleItems: Signal<readonly T[]> = computed((): readonly T[] => {
    const query: string = this.query();
    return query ? this.value().filter((item: T): boolean => filterSelectionOption(item, query)) : this.value();
  });
  protected readonly selectedIndexes: Signal<readonly number[]> = computed((): readonly number[] => {
    const selected: ReadonlySet<OrderListValue> = new Set(this.selection());
    return this.value().flatMap((item: T, index: number): readonly number[] =>
      selected.has(item.value) && !item.disabled ? [index] : [],
    );
  });
  protected readonly canMoveTop: Signal<boolean> = computed((): boolean =>
    this.selectedIndexes().some((index: number, position: number): boolean => index !== position),
  );
  protected readonly canMoveUp: Signal<boolean> = computed((): boolean => {
    const selected: ReadonlySet<number> = new Set(this.selectedIndexes());
    return this.selectedIndexes().some((index: number): boolean => index > 0 && !selected.has(index - 1));
  });
  protected readonly canMoveDown: Signal<boolean> = computed((): boolean => {
    const selected: ReadonlySet<number> = new Set(this.selectedIndexes());
    return this.selectedIndexes().some((index: number): boolean => index < this.value().length - 1 && !selected.has(index + 1));
  });
  protected readonly canMoveBottom: Signal<boolean> = computed((): boolean => {
    const indexes: readonly number[] = this.selectedIndexes();
    const offset: number = this.value().length - indexes.length;
    return indexes.some((index: number, position: number): boolean => index !== offset + position);
  });

  private readonly refocusAfterRender: WritableSignal<boolean> = signal(false);

  public constructor() {
    super();
    afterRenderEffect({
      write: (): void => {
        // Re-run after reordered rows render even when the active value stays unchanged.
        this.value();
        if (this.refocusAfterRender()) {
          this.refocusAfterRender.set(false);
          this.focus();
        }
        if (this.listbox().activeDescendant()) this.listbox().scrollActiveItemIntoView();
      },
    });
  }

  /** Moves focus to the ordered collection. */
  public focus(): void {
    if (this.disabled()) return;
    this.listbox().element.focus();
  }

  protected moveToTop(): void {
    if (this.disabled() || !this.canMoveTop()) return;
    const selected: ReadonlySet<OrderListValue> = new Set(this.selection());
    this.commit([
      ...this.value().filter((item: T): boolean => selected.has(item.value)),
      ...this.value().filter((item: T): boolean => !selected.has(item.value)),
    ]);
  }

  protected moveUp(): void {
    if (this.disabled() || !this.canMoveUp()) return;
    const items: T[] = [...this.value()];
    const selected: ReadonlySet<OrderListValue> = new Set(this.selection());
    for (const index of this.selectedIndexes()) {
      if (index > 0 && !selected.has(items[index - 1].value)) moveItemInArray(items, index, index - 1);
    }
    this.commit(items);
  }

  protected moveDown(): void {
    if (this.disabled() || !this.canMoveDown()) return;
    const items: T[] = [...this.value()];
    const selected: ReadonlySet<OrderListValue> = new Set(this.selection());
    for (const index of [...this.selectedIndexes()].reverse()) {
      if (index < items.length - 1 && !selected.has(items[index + 1].value)) moveItemInArray(items, index, index + 1);
    }
    this.commit(items);
  }

  protected moveToBottom(): void {
    if (this.disabled() || !this.canMoveBottom()) return;
    const selected: ReadonlySet<OrderListValue> = new Set(this.selection());
    this.commit([
      ...this.value().filter((item: T): boolean => !selected.has(item.value)),
      ...this.value().filter((item: T): boolean => selected.has(item.value)),
    ]);
  }

  protected handleSelection(values: OrderListValue[]): void {
    if (this.disabled()) return;
    this.selection.set(values);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (!event.altKey || this.disabled()) return;

    switch (event.key) {
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'Home':
        this.moveToTop();
        break;
      case 'End':
        this.moveToBottom();
        break;
      default:
        return;
    }

    this.refocusAfterRender.set(true);
    event.preventDefault();
    event.stopPropagation();
  }

  protected handleFilter(event: Event): void {
    this.updateFilter((event.target as HTMLInputElement).value);
  }

  protected handleDrop(event: CdkDragDrop<readonly T[]>): void {
    if (this.disabled()) return;
    if (event.previousIndex === event.currentIndex) return;
    const source: T | undefined = this.visibleItems().at(event.previousIndex);
    const target: T | undefined = this.visibleItems().at(event.currentIndex);
    if (!source || !target || source.disabled) return;

    const items: T[] = [...this.value()];
    moveItemInArray(items, items.indexOf(source), items.indexOf(target));
    this.commit(items, `Moved ${source.label} to position ${items.indexOf(source) + 1}`);
  }

  protected handleFocusout(event: FocusEvent): void {
    const currentTarget: HTMLElement = event.currentTarget as HTMLElement;
    if (!currentTarget.contains(event.relatedTarget as Node | null)) this.touch.emit();
  }

  protected itemContext(item: T, index: number): OrderListItemContext<T> {
    return {
      $implicit: item,
      option: item,
      index,
      selected: this.selection().includes(item.value),
    };
  }

  private commit(items: readonly T[], message: string = 'Order updated'): void {
    this.value.set(items);
    this.announcement.set(message);
    this.touch.emit();
  }
}
