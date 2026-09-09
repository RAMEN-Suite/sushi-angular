import { NgTemplateOutlet } from '@angular/common';
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
import { Listbox as AriaListbox, Option as AriaOption } from '@angular/aria/listbox';
import { LucideCheck, LucideSearch } from '@lucide/angular';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { FormControlState } from '../form-control';
import { InputSurface, InputSurfaceControl } from '../input-surface';
import { filterSelectionOption } from '../selection';
import { Spinner } from '../spinner';
import {
  ListboxFilterContext,
  ListboxGroupContext,
  ListboxItemContext,
  ListboxModelValue,
  ListboxOption,
  ListboxValue,
} from './listbox.interfaces';
import {
  ListboxEmptyFilterTemplate,
  ListboxEmptyTemplate,
  ListboxFilterTemplate,
  ListboxFooterTemplate,
  ListboxGroupTemplate,
  ListboxHeaderTemplate,
  ListboxItemTemplate,
} from './listbox.templates';

function isMultipleValue(value: ListboxModelValue): value is readonly ListboxValue[] {
  return Array.isArray(value);
}

/** Presents a persistent collection from which one or more options can be selected. */
@Component({
  selector: 'sui-listbox',
  imports: [
    AriaListbox,
    AriaOption,
    Button,
    Checkbox,
    InputSurface,
    InputSurfaceControl,
    LucideCheck,
    LucideSearch,
    NgTemplateOutlet,
    Spinner,
  ],
  templateUrl: './listbox.component.html',
  host: { class: 'sui-listbox block max-w-full', '[class.cursor-not-allowed]': 'disabled()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Listbox<O extends ListboxOption = ListboxOption>
  extends FormControlState
  implements FormValueControl<ListboxModelValue>
{
  /** Selected value in single mode or selected values in multiple mode. */
  public readonly value: ModelSignal<ListboxModelValue> = model<ListboxModelValue>(null);

  /** Fixed options available for selection. */
  public readonly options: InputSignal<readonly O[]> = input.required<readonly O[]>();
  /** Enables selection of more than one option. */
  public readonly multiple: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Limits the visible list height in pixels before it scrolls. */
  public readonly scrollHeight: InputSignalWithTransform<number, unknown> = input(320, { transform: numberAttribute });
  /** Shows a text filter above the options. */
  public readonly filter: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Placeholder displayed by the text filter. */
  public readonly filterPlaceholder: InputSignal<string> = input<string>('Filter options');
  /** Shows checkbox controls for multiple selection. */
  public readonly checkbox: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Shows a select-all action in multiple mode. */
  public readonly selectAll: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Requests more options when the loaded collection reaches its scroll boundary. */
  public readonly lazy: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Shows that another option page is loading. */
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** ID assigned to the listbox. */
  public readonly id: InputSignal<string | null> = input<string | null>(null);
  /** Accessible label used when no visible label is available. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the element that labels the listbox. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** IDs of elements that describe the listbox. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);

  /** Prevents filtering and selection and removes the listbox from sequential focus. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Keeps options focusable without allowing selection changes. */
  public readonly readOnly: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Marks the listbox as requiring a selection. */
  public readonly required: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Emits when focus leaves the listbox after interaction. */
  public readonly touch: OutputEmitterRef<void> = output();
  /** Emits the next option offset when lazy loading reaches the scroll boundary. */
  public readonly loadMore: OutputEmitterRef<number> = output<number>();

  protected readonly headerTemplate: Signal<TemplateRef<void> | undefined> = contentChild(ListboxHeaderTemplate, {
    read: TemplateRef,
  });
  protected readonly filterTemplate: Signal<TemplateRef<ListboxFilterContext> | undefined> = contentChild(ListboxFilterTemplate, {
    read: TemplateRef,
  });
  protected readonly groupTemplate: Signal<TemplateRef<ListboxGroupContext> | undefined> = contentChild(ListboxGroupTemplate, {
    read: TemplateRef,
  });
  protected readonly itemTemplate: Signal<TemplateRef<ListboxItemContext<O>> | undefined> = contentChild(ListboxItemTemplate, {
    read: TemplateRef,
  });
  protected readonly emptyTemplate: Signal<TemplateRef<void> | undefined> = contentChild(ListboxEmptyTemplate, {
    read: TemplateRef,
  });
  protected readonly emptyFilterTemplate: Signal<TemplateRef<void> | undefined> = contentChild(ListboxEmptyFilterTemplate, {
    read: TemplateRef,
  });
  protected readonly footerTemplate: Signal<TemplateRef<void> | undefined> = contentChild(ListboxFooterTemplate, {
    read: TemplateRef,
  });
  protected readonly listbox: Signal<AriaListbox<ListboxValue>> = viewChild.required(AriaListbox);

  protected readonly query: WritableSignal<string> = signal('');
  protected readonly updateFilter: (query: string) => void = (query: string): void => {
    if (!this.disabled() && !this.readOnly()) this.query.set(query);
  };
  protected readonly filterContext: Signal<ListboxFilterContext> = computed((): ListboxFilterContext => ({
    $implicit: this.query(),
    query: this.query(),
    placeholder: this.filterPlaceholder(),
    disabled: this.disabled(),
    readOnly: this.readOnly(),
    update: this.updateFilter,
  }));
  protected readonly listboxValue: Signal<ListboxValue[]> = computed((): ListboxValue[] => {
    const value: ListboxModelValue = this.value();
    if (isMultipleValue(value)) return [...value];
    return value === null ? [] : [value];
  });
  protected readonly visibleOptions: Signal<readonly O[]> = computed((): readonly O[] => {
    const query: string = this.query();
    return query ? this.options().filter((option: O): boolean => filterSelectionOption(option, query)) : this.options();
  });
  protected readonly allSelected: Signal<boolean> = computed((): boolean => {
    const available: readonly O[] = this.visibleOptions().filter((option: O): boolean => !option.disabled);
    return available.length > 0 && available.every((option: O): boolean => this.listboxValue().includes(option.value));
  });

  private readonly loadedOffset: WritableSignal<number> = signal(-1);

  public constructor() {
    super();
    afterRenderEffect({
      write: (): void => {
        if (this.listbox().activeDescendant()) this.listbox().scrollActiveItemIntoView();
      },
    });
  }

  /** Moves focus to the listbox. */
  public focus(): void {
    if (this.disabled()) return;
    this.listbox().element.focus();
  }

  protected handleSelection(values: ListboxValue[]): void {
    if (this.disabled() || this.readOnly()) return;
    this.value.set(this.multiple() ? values : (values.at(0) ?? null));
  }

  protected handleFocusout(event: FocusEvent): void {
    const currentTarget: HTMLElement = event.currentTarget as HTMLElement;
    if (!currentTarget.contains(event.relatedTarget as Node | null)) this.touch.emit();
  }

  protected handleFilter(event: Event): void {
    this.updateFilter((event.target as HTMLInputElement).value);
  }

  protected handleSelectAll(): void {
    if (!this.multiple() || this.disabled() || this.readOnly()) return;
    const available: readonly ListboxValue[] = this.visibleOptions()
      .filter((option: O): boolean => !option.disabled)
      .map((option: O): ListboxValue => option.value);
    const selected: readonly ListboxValue[] = this.listboxValue();
    const clear: boolean = this.allSelected();
    const next: ReadonlySet<ListboxValue> = new Set(
      clear ? selected.filter((value: ListboxValue): boolean => !available.includes(value)) : [...selected, ...available],
    );
    this.value.set(
      this.options().flatMap((option: O): readonly ListboxValue[] => (next.has(option.value) ? [option.value] : [])),
    );
  }

  protected handleScroll(event: Event): void {
    if (!this.lazy() || this.loading()) return;
    const element: HTMLElement = event.currentTarget as HTMLElement;
    if (element.scrollHeight - element.scrollTop - element.clientHeight > 48) return;
    const offset: number = this.options().length;
    if (this.loadedOffset() === offset) return;
    this.loadedOffset.set(offset);
    this.loadMore.emit(offset);
  }

  protected itemContext(option: O, index: number, active: boolean): ListboxItemContext<O> {
    return {
      $implicit: option,
      option,
      index,
      active,
      selected: this.listboxValue().includes(option.value),
      disabled: Boolean(option.disabled),
    };
  }

  protected groupContext(option: O): ListboxGroupContext {
    return { $implicit: option.group ?? '', group: option.group ?? '' };
  }
}
