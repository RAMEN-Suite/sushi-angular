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
  numberAttribute,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  TemplateRef,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { LucideCheck, LucideChevronDown, LucideX } from '@lucide/angular';
import { FormControlSeverity, FormControlSize, FormControlState } from '../form-control';
import {
  compareSelectionValues,
  filterSelectionOption,
  selectionOverlayPositions,
  SELECTION_ABOVE,
  SELECTION_BELOW,
} from '../selection';
import { Spinner } from '../spinner';
import {
  SelectCompareWith,
  SelectGroupContext,
  SelectItemContext,
  SelectLoadingContext,
  SelectModelValue,
  SelectOption,
  SelectSelectedItemContext,
  SelectValue,
  SelectVariant,
} from './select.interfaces';
import {
  SelectClearIconTemplate,
  SelectCheckmarkIconTemplate,
  SelectDropdownIconTemplate,
  SelectEmptyTemplate,
  SelectFooterTemplate,
  SelectGroupTemplate,
  SelectHeaderTemplate,
  SelectItemTemplate,
  SelectLoadingIconTemplate,
  SelectLoadingTemplate,
  SelectSelectedItemTemplate,
} from './select.templates';

/** Selects one value from a fixed list with keyboard-accessible popup behavior. */
@Component({
  selector: 'sui-select',
  imports: [
    NgTemplateOutlet,
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    Listbox,
    Option,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    LucideCheck,
    LucideChevronDown,
    LucideX,
    Spinner,
  ],
  templateUrl: './select.component.html',
  host: { class: 'inline-block max-w-full', '[class.w-full]': 'fluid()', '[class.cursor-not-allowed]': 'disabled()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select extends FormControlState implements FormValueControl<SelectModelValue> {
  /** Selected option value or `null` when empty. */
  public readonly value: ModelSignal<SelectModelValue> = model<SelectModelValue>(null);

  /** Fixed options available for selection. */
  public readonly options: InputSignal<readonly SelectOption[]> = input.required<readonly SelectOption[]>();
  /** Compares object values when reference identity is not sufficient. Primitive values use the default comparator. */
  public readonly compareWith: InputSignal<SelectCompareWith> = input<SelectCompareWith>(compareSelectionValues);

  /** Text shown while no option is selected. */
  public readonly placeholder: InputSignal<string> = input<string>('Select an option');
  /** Shows a search field in the popup. Defaults to false; filtering never changes the selected value. */
  public readonly filter: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Placeholder for the optional search field. */
  public readonly filterPlaceholder: InputSignal<string> = input<string>('Filter options');
  /** Accessible name of the optional search field. */
  public readonly filterLabel: InputSignal<string> = input<string>('Filter options');
  /** Message displayed when the search matches no options. */
  public readonly emptyFilterMessage: InputSignal<string> = input<string>('No matching options');
  /** Message shown when no options are available. */
  public readonly emptyMessage: InputSignal<string> = input<string>('No options available');
  /** Message shown while options are loading. */
  public readonly loadingMessage: InputSignal<string> = input<string>('Loading options');

  /** Limits the popup height in pixels before it scrolls. */
  public readonly scrollHeight: InputSignalWithTransform<number, unknown> = input(240, { transform: numberAttribute });
  /** Sets the minimum height of each option in pixels. */
  public readonly optionHeight: InputSignalWithTransform<number, unknown> = input(44, { transform: numberAttribute });
  /** Sets the control dimensions. */
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
  /** Applies one semantic color to the control. */
  public readonly severity: InputSignal<FormControlSeverity | null> = input<FormControlSeverity | null>(null);
  /** Uses the filled control appearance. */
  public readonly variant: InputSignal<SelectVariant | null> = input<SelectVariant | null>(null);

  /** ID assigned to the combobox control. */
  public readonly id: InputSignal<string | null> = input<string | null>(null);
  /** Accessible label used when no visible label is available. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the element that labels the control. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** IDs of elements that describe the control. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);

  /** Shows a keyboard-accessible clear icon when a value exists. */
  public readonly showClear: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Shows a checkmark beside the selected option. */
  public readonly checkmark: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Expands the control to the available width. */
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Prevents interaction and removes the combobox from sequential focus. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Marks the control as required for accessibility and forms. */
  public readonly required: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Shows the loading state and prevents option selection. */
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Emits when the user closes the popup after interaction. */
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly itemTemplate: Signal<TemplateRef<SelectItemContext> | undefined> = contentChild(SelectItemTemplate, {
    read: TemplateRef,
  });
  protected readonly selectedItemTemplate: Signal<TemplateRef<SelectSelectedItemContext> | undefined> = contentChild(
    SelectSelectedItemTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly headerTemplate: Signal<TemplateRef<void> | undefined> = contentChild(SelectHeaderTemplate, {
    read: TemplateRef,
  });
  protected readonly footerTemplate: Signal<TemplateRef<void> | undefined> = contentChild(SelectFooterTemplate, {
    read: TemplateRef,
  });
  protected readonly emptyTemplate: Signal<TemplateRef<void> | undefined> = contentChild(SelectEmptyTemplate, {
    read: TemplateRef,
  });
  protected readonly groupTemplate: Signal<TemplateRef<SelectGroupContext> | undefined> = contentChild(SelectGroupTemplate, {
    read: TemplateRef,
  });
  protected readonly loadingTemplate: Signal<TemplateRef<SelectLoadingContext> | undefined> = contentChild(
    SelectLoadingTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly loadingIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(SelectLoadingIconTemplate, {
    read: TemplateRef,
  });
  protected readonly dropdownIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(SelectDropdownIconTemplate, {
    read: TemplateRef,
  });
  protected readonly clearIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(SelectClearIconTemplate, {
    read: TemplateRef,
  });
  protected readonly checkmarkIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(SelectCheckmarkIconTemplate, {
    read: TemplateRef,
  });

  protected readonly combobox: Signal<Combobox> = viewChild.required(Combobox);
  protected readonly listbox: Signal<Listbox<SelectValue> | undefined> = viewChild(Listbox);

  protected readonly expanded: WritableSignal<boolean> = signal(false);
  protected readonly filterInput: Signal<ElementRef<HTMLInputElement> | undefined> = viewChild('filterInput');
  protected readonly filterQuery: WritableSignal<string> = signal('');
  protected readonly visibleOptions: Signal<readonly SelectOption[]> = computed(() =>
    this.options().filter((option: SelectOption): boolean => filterSelectionOption(option, this.filterQuery())),
  );
  protected readonly interactivePopup: Signal<boolean> = computed(
    () => this.filter() || Boolean(this.headerTemplate()) || Boolean(this.footerTemplate()),
  );

  protected readonly selectedOption: Signal<SelectOption | undefined> = computed(() => {
    const value: SelectModelValue = this.value();
    return value === null
      ? undefined
      : this.options().find((option: SelectOption): boolean => this.compareWith()(option.value, value));
  });
  protected readonly listboxValue: Signal<SelectValue[]> = computed(() => {
    const option: SelectOption | undefined = this.selectedOption();
    return option ? [option.value] : [];
  });
  protected readonly selectedContext: Signal<SelectSelectedItemContext | undefined> = computed(() => {
    const option: SelectOption | undefined = this.selectedOption();
    return option ? { $implicit: option, option } : undefined;
  });
  protected readonly positions: WritableSignal<ConnectedPosition[]> = signal([SELECTION_BELOW, SELECTION_ABOVE]);

  private readonly focusFilter: WritableSignal<boolean> = signal(false);

  private readonly centerSelected: WritableSignal<boolean> = signal(false);

  public constructor() {
    super();
    afterRenderEffect({
      write: () => {
        if (!this.expanded()) return;
        if (this.focusFilter() && this.filterInput()) {
          this.focusFilter.set(false);
          this.filterInput()?.nativeElement.focus();
        }
        const listbox: Listbox<SelectValue> | undefined = this.listbox();
        if (!listbox?.activeDescendant()) return;
        const center: boolean = this.centerSelected();
        listbox.scrollActiveItemIntoView({ block: center ? 'center' : 'nearest' });
        if (center) this.centerSelected.set(false);
      },
    });
  }

  /** Moves focus to the combobox. */
  public focus(): void {
    if (this.disabled()) return;
    this.combobox().element.focus();
  }

  /** Clears the selection and closes the popup. */
  public reset(): void {
    this.value.set(null);
    this.expanded.set(false);
    this.filterQuery.set('');
  }

  protected handleExpanded(expanded: boolean): void {
    if (expanded && (this.disabled() || this.loading())) return;
    if (this.expanded() === expanded) return;
    if (expanded) {
      this.filterQuery.set('');
      this.focusFilter.set(this.filter());
      this.preferAvailableSpace();
      this.centerSelected.set(Boolean(this.selectedOption()));
    }
    this.expanded.set(expanded);
    if (expanded) return;
    this.touch.emit();
  }

  protected handleFilter(event: Event): void {
    if (!(event.target instanceof HTMLInputElement) || this.disabled() || this.loading()) return;
    this.filterQuery.set(event.target.value);
  }

  protected handlePopupKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.handleExpanded(false);
      this.focus();
      return;
    }
    const fromFilter: boolean = event.target === this.filterInput()?.nativeElement;
    const fromRelay: boolean = event.target === event.currentTarget;
    if (!fromRelay && (!fromFilter || !['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key))) return;
    const listbox: Listbox<SelectValue> | undefined = this.listbox();
    if (!listbox) return;
    event.preventDefault();
    event.stopPropagation();
    listbox.element.dispatchEvent(new KeyboardEvent('keydown', event));
  }

  protected handleSelection(values: SelectValue[]): void {
    if (this.disabled() || this.loading()) return;
    const value: SelectValue | undefined = values.at(0);
    if (value === undefined) return;
    this.value.set(value);
    this.handleExpanded(false);
    this.focus();
  }

  protected handleClear(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled()) return;
    this.value.set(null);
    this.handleExpanded(false);
  }

  protected isSelected(option: SelectOption): boolean {
    const value: SelectModelValue = this.value();
    return value !== null && this.compareWith()(option.value, value);
  }

  protected itemContext(option: SelectOption, index: number): SelectItemContext {
    return { $implicit: option, option, selected: this.isSelected(option), disabled: Boolean(option.disabled), index };
  }

  private preferAvailableSpace(): void {
    // Angular Aria can complete popup content after the CDK's initial fit check.
    const optionHeight: number = this.options().length
      ? Math.min(this.scrollHeight(), this.options().length * this.optionHeight() + 8)
      : 56;
    const panelHeight: number =
      optionHeight + (this.filter() ? 60 : 0) + (this.headerTemplate() ? 52 : 0) + (this.footerTemplate() ? 52 : 0);
    this.positions.set(selectionOverlayPositions(this.combobox().element, panelHeight));
  }
}
