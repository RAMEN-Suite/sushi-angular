import { NgTemplateOutlet } from '@angular/common';
import { CdkDrag, type CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  model,
  type ModelSignal,
  output,
  type OutputEmitterRef,
  type Signal,
  signal,
  TemplateRef,
  viewChild,
  viewChildren,
  type WritableSignal,
} from '@angular/core';
import { type FormValueControl } from '@angular/forms/signals';
import { LucideGripVertical } from '@lucide/angular';
import { FormControlState } from '../form-control';
import { Menu, type MenuItem, MenuTrigger } from '../menu';
import {
  type OrderListItemContext,
  type OrderListLabels,
  type OrderListOption,
  type OrderListReorderEvent,
  type OrderListSize,
  type OrderListValue,
} from './order-list.interfaces';
import { OrderListItemTemplate } from './order-list.templates';

type MoveAction = 'up' | 'down' | 'top' | 'bottom';

interface FocusRequest {
  readonly value: OrderListValue;
  readonly scroll: boolean;
}

const DEFAULT_LABELS: OrderListLabels = {
  reorder: (item: OrderListOption): string => `Reorder ${item.label}`,
  moveUp: 'Move up',
  moveDown: 'Move down',
  moveToTop: 'Move to top',
  moveToBottom: 'Move to bottom',
  empty: 'No items available',
  instructions:
    'Click the handle for move actions. Alt (Option on Mac) + Up/Down moves one position; add Shift to move to the start/end.',
  moved: (event: OrderListReorderEvent, count: number): string =>
    `Moved ${event.item.label} to position ${event.currentIndex + 1} of ${count}`,
};

let nextOrderListId: number = 0;

/** Reorders complete rich rows using a handle, movement menu or Alt keyboard shortcuts. Scrolling belongs to the container. */
@Component({
  selector: 'sui-order-list',
  imports: [CdkDrag, CdkDragHandle, CdkDropList, LucideGripVertical, Menu, MenuTrigger, NgTemplateOutlet],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
  host: {
    class: 'sui-order-list block min-w-0',
    '[attr.data-size]': 'size()',
    '[attr.data-disabled]': 'disabled() || null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderList<I extends OrderListOption = OrderListOption>
  extends FormControlState
  implements FormValueControl<readonly I[]>
{
  /** Complete collection with unique stable values. Moves emit a new array without mutating the input. */
  public readonly value: ModelSignal<readonly I[]> = model<readonly I[]>([]);
  /** Row density shared with List. */
  public readonly size: InputSignal<OrderListSize> = input<OrderListSize>('sm');
  /** Allows movement by every input method. False leaves custom row content usable. */
  public readonly reorderable: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Enables dragging from the handle. Menu and keyboard moves remain available when false. */
  public readonly dragDrop: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Disables interaction in the entire list, including custom row controls. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** ID of the native ordered list. */
  public readonly id: InputSignal<string | null> = input<string | null>(null);
  /** Accessible name when no visible heading labels the list. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the visible heading that labels the list. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** IDs of additional descriptions of the list. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);
  /** Partial translations of movement labels, instructions and announcements. */
  public readonly labels: InputSignal<Partial<OrderListLabels<I>>> = input<Partial<OrderListLabels<I>>>({});
  /** Emits after an actual move, with indexes in the complete collection. */
  public readonly reordered: OutputEmitterRef<OrderListReorderEvent<I>> = output();
  /** Emits when movement completes or focus leaves the collection. */
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly itemTemplate: Signal<TemplateRef<OrderListItemContext<I>> | undefined> = contentChild(
    OrderListItemTemplate,
    { read: TemplateRef },
  );
  private readonly list: Signal<ElementRef<HTMLOListElement>> = viewChild.required('list');
  private readonly handles: Signal<readonly ElementRef<HTMLButtonElement>[]> = viewChildren('handle', { read: ElementRef });
  private readonly menus: Signal<readonly Menu[]> = viewChildren(Menu);

  protected readonly text: Signal<OrderListLabels<I>> = computed((): OrderListLabels<I> => ({
    ...DEFAULT_LABELS,
    ...this.labels(),
  }));
  protected readonly announcement: WritableSignal<string> = signal('');
  protected readonly instructionsId: string = `sui-order-list-instructions-${++nextOrderListId}`;
  protected readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly pendingFocus: WritableSignal<FocusRequest | null> = signal(null);

  public constructor() {
    super();
    afterRenderEffect({ write: (): void => this.restoreMovedFocus() });
    afterRenderEffect({
      write: (): void => {
        if (this.disabled() || !this.reorderable()) this.menus().forEach((menu: Menu): void => menu.close(false));
      },
    });
  }

  /** Focuses the first movable handle, or the list when none is available. */
  public focus(): void {
    if (this.disabled()) return;
    const index: number = this.value().findIndex((item: I): boolean => this.canReorder(item));
    (this.handles()[index]?.nativeElement ?? this.list().nativeElement).focus();
  }

  protected canReorder(item: I): boolean {
    return !this.disabled() && this.reorderable() && !item.disabled;
  }

  protected actions(item: I, index: number): readonly MenuItem<MoveAction>[] {
    const blocked: boolean = !this.canReorder(item);
    const last: number = this.value().length - 1;
    const text: OrderListLabels<I> = this.text();
    return [
      { label: text.moveUp, value: 'up', disabled: blocked || index === 0 },
      { label: text.moveToTop, value: 'top', disabled: blocked || index === 0 },
      { label: text.moveDown, value: 'down', disabled: blocked || index === last },
      { label: text.moveToBottom, value: 'bottom', disabled: blocked || index === last },
    ];
  }

  protected handleAction(item: I, action: MoveAction): void {
    const index: number = this.value().findIndex((entry: I): boolean => Object.is(entry.value, item.value));
    const destinations: Readonly<Record<MoveAction, number>> = {
      up: index - 1,
      down: index + 1,
      top: 0,
      bottom: this.value().length - 1,
    };

    this.move(item, destinations[action], true);
  }

  protected handleKeydown(event: KeyboardEvent, item: I): void {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
    const actions: Readonly<Record<string, MoveAction | undefined>> = {
      ArrowUp: event.shiftKey ? 'top' : 'up',
      ArrowDown: event.shiftKey ? 'bottom' : 'down',
      Home: 'top',
      End: 'bottom',
    };
    const action: MoveAction | undefined = actions[event.key];
    if (!action || !this.canReorder(item)) return;

    event.preventDefault();
    event.stopPropagation();
    this.handleAction(item, action);
  }

  protected handleDrop(event: CdkDragDrop<readonly I[], readonly I[], I>): void {
    // CDK temporarily detaches the row even when the drop is cancelled.
    this.pendingFocus.set({ value: event.item.data.value, scroll: false });
    if (!event.isPointerOverContainer || !this.dragDrop()) return;

    this.move(event.item.data, event.currentIndex, false);
    // Commit the new DOM order before the browser paints CDK's restored original row.
    this.changeDetector.detectChanges();
  }

  protected handleFocusout(event: FocusEvent): void {
    if (!(event.relatedTarget instanceof Node) || !this.host.contains(event.relatedTarget)) this.touch.emit();
  }

  protected itemContext(item: I, index: number): OrderListItemContext<I> {
    const count: number = this.value().length;
    return {
      $implicit: item,
      item,
      index,
      count,
      first: index === 0,
      last: index === count - 1,
      even: index % 2 === 0,
      odd: index % 2 !== 0,
      disabled: this.disabled(),
      reorderable: this.canReorder(item),
    };
  }

  private move(item: I, currentIndex: number, scroll: boolean): void {
    const previousIndex: number = this.value().findIndex((entry: I): boolean => Object.is(entry.value, item.value));
    const source: I | undefined = this.value()[previousIndex];
    if (
      !source ||
      !this.canReorder(source) ||
      previousIndex === currentIndex ||
      currentIndex < 0 ||
      currentIndex >= this.value().length
    )
      return;

    const items: I[] = [...this.value()];
    moveItemInArray(items, previousIndex, currentIndex);
    const event: OrderListReorderEvent<I> = { item: source, previousIndex, currentIndex };

    this.pendingFocus.set({ value: source.value, scroll });
    this.value.set(items);
    this.announcement.set(this.text().moved(event, items.length));
    this.reordered.emit(event);
    this.touch.emit();
  }

  private restoreMovedFocus(): void {
    const items: readonly I[] = this.value();
    const request: FocusRequest | null = this.pendingFocus();
    if (request === null) return;

    this.pendingFocus.set(null);
    if (this.disabled()) return;
    const index: number = items.findIndex((item: I): boolean => Object.is(item.value, request.value));
    const handle: HTMLButtonElement | undefined = this.handles()[index]?.nativeElement;
    handle?.focus({ preventScroll: true });
    if (request.scroll) handle?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}
