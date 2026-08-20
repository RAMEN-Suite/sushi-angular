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
import { Checkbox } from '../checkbox';
import { FormControlSeverity, FormControlSize, FormControlState } from '../form-control';
import { compareSelectionValues, selectionOverlayPositions, SELECTION_BELOW, SELECTION_ABOVE } from '../selection';
import { Spinner } from '../spinner';
import {
  MultiSelectCompareWith,
  MultiSelectGroupContext,
  MultiSelectHeaderContext,
  MultiSelectItemContext,
  MultiSelectLoadingContext,
  MultiSelectModelValue,
  MultiSelectOption,
  MultiSelectSelectedItemsContext,
  MultiSelectValue,
  MultiSelectVariant,
} from './multi-select.interfaces';
import {
  MultiSelectCheckmarkIconTemplate,
  MultiSelectClearIconTemplate,
  MultiSelectDropdownIconTemplate,
  MultiSelectEmptyTemplate,
  MultiSelectFooterTemplate,
  MultiSelectGroupTemplate,
  MultiSelectHeaderTemplate,
  MultiSelectItemTemplate,
  MultiSelectLoadingIconTemplate,
  MultiSelectLoadingTemplate,
  MultiSelectSelectedItemsTemplate,
} from './multi-select.templates';

/** Selects multiple values from a fixed list with keyboard-accessible popup behavior. */
@Component({
  selector: 'sui-multi-select',
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
    Checkbox,
    Spinner,
  ],
  templateUrl: './multi-select.component.html',
  host: { class: 'inline-block max-w-full', '[class.w-full]': 'fluid()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelect extends FormControlState implements FormValueControl<MultiSelectModelValue> {
  /** Selected option values in option order. */
  public readonly value: ModelSignal<MultiSelectModelValue> = model<MultiSelectModelValue>([]);

  /** Fixed options available for multiple selection. */
  public readonly options: InputSignal<readonly MultiSelectOption[]> = input.required<readonly MultiSelectOption[]>();
  /** Compares object values when reference identity is not sufficient. Primitive values use the default comparator. */
  public readonly compareWith: InputSignal<MultiSelectCompareWith> = input<MultiSelectCompareWith>(compareSelectionValues);

  /** Text shown while no options are selected. */
  public readonly placeholder: InputSignal<string> = input<string>('Select options');
  /** Message shown when no options are available. */
  public readonly emptyMessage: InputSignal<string> = input<string>('No options available');
  /** Message shown while options are loading. */
  public readonly loadingMessage: InputSignal<string> = input<string>('Loading options');
  /** Label displayed beside the select-all checkbox. */
  public readonly selectAllLabel: InputSignal<string> = input<string>('Select all');

  /** Limits the popup height in pixels before it scrolls. */
  public readonly scrollHeight: InputSignalWithTransform<number, unknown> = input(240, { transform: numberAttribute });
  /** Sets the minimum height of each option in pixels. */
  public readonly optionHeight: InputSignalWithTransform<number, unknown> = input(44, { transform: numberAttribute });
  /** Sets the control dimensions. */
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
  /** Applies one semantic color to the control. */
  public readonly severity: InputSignal<FormControlSeverity | null> = input<FormControlSeverity | null>(null);
  /** Uses the filled control appearance. */
  public readonly variant: InputSignal<MultiSelectVariant | null> = input<MultiSelectVariant | null>(null);

  /** ID assigned to the combobox control. */
  public readonly id: InputSignal<string | null> = input<string | null>(null);
  /** Accessible label used when no visible label is available. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the element that labels the control. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** IDs of elements that describe the control. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);

  /** Shows a keyboard-accessible clear icon when values exist. */
  public readonly showClear: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Shows a control for selecting or clearing all enabled options. */
  public readonly showSelectAll: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Expands the control to the available width. */
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Prevents focus and interaction. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Marks the control as required for accessibility and forms. */
  public readonly required: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Shows the loading state and prevents option selection. */
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Emits when the user closes the popup after interaction. */
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly itemTemplate: Signal<TemplateRef<MultiSelectItemContext> | undefined> = contentChild(
    MultiSelectItemTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly selectedItemsTemplate: Signal<TemplateRef<MultiSelectSelectedItemsContext> | undefined> = contentChild(
    MultiSelectSelectedItemsTemplate,
    { read: TemplateRef },
  );
  protected readonly headerTemplate: Signal<TemplateRef<MultiSelectHeaderContext> | undefined> = contentChild(
    MultiSelectHeaderTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly footerTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MultiSelectFooterTemplate, {
    read: TemplateRef,
  });
  protected readonly emptyTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MultiSelectEmptyTemplate, {
    read: TemplateRef,
  });
  protected readonly groupTemplate: Signal<TemplateRef<MultiSelectGroupContext> | undefined> = contentChild(
    MultiSelectGroupTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly loadingTemplate: Signal<TemplateRef<MultiSelectLoadingContext> | undefined> = contentChild(
    MultiSelectLoadingTemplate,
    { read: TemplateRef },
  );
  protected readonly loadingIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MultiSelectLoadingIconTemplate, {
    read: TemplateRef,
  });
  protected readonly dropdownIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MultiSelectDropdownIconTemplate, {
    read: TemplateRef,
  });
  protected readonly clearIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MultiSelectClearIconTemplate, {
    read: TemplateRef,
  });
  protected readonly checkmarkIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(
    MultiSelectCheckmarkIconTemplate,
    {
      read: TemplateRef,
    },
  );

  protected readonly combobox: Signal<Combobox> = viewChild.required(Combobox);
  protected readonly listbox: Signal<Listbox<MultiSelectValue> | undefined> = viewChild(Listbox);

  protected readonly expanded: WritableSignal<boolean> = signal(false);
  protected readonly positions: WritableSignal<ConnectedPosition[]> = signal([SELECTION_BELOW, SELECTION_ABOVE]);

  protected readonly selectedOptions: Signal<readonly MultiSelectOption[]> = computed(() =>
    this.options().filter((option: MultiSelectOption): boolean => this.isSelected(option)),
  );
  protected readonly displayValue: Signal<string> = computed(() => {
    const options: readonly MultiSelectOption[] = this.selectedOptions();
    if (!options.length) return this.placeholder();
    return options.length === 1 ? options[0].label : `${options[0].label} +${options.length - 1}`;
  });
  protected readonly enabledOptions: Signal<readonly MultiSelectOption[]> = computed(() =>
    this.options().filter((option: MultiSelectOption): boolean => !option.disabled),
  );
  protected readonly allSelected: Signal<boolean> = computed(() => {
    const options: readonly MultiSelectOption[] = this.enabledOptions();
    return options.length > 0 && options.every((option: MultiSelectOption): boolean => this.isSelected(option));
  });
  protected readonly partiallySelected: Signal<boolean> = computed(
    () => !this.allSelected() && this.enabledOptions().some((option: MultiSelectOption): boolean => this.isSelected(option)),
  );
  protected readonly listboxValue: Signal<MultiSelectValue[]> = computed(() =>
    this.value().map(
      (value: MultiSelectValue): MultiSelectValue =>
        this.options().find((option: MultiSelectOption): boolean => this.compareWith()(option.value, value))?.value ?? value,
    ),
  );
  protected readonly selectedContext: Signal<MultiSelectSelectedItemsContext> = computed(() => ({
    $implicit: this.selectedOptions(),
    options: this.selectedOptions(),
    remove: (option: MultiSelectOption): void => this.handleRemove(option),
    disabled: this.disabled(),
  }));
  protected readonly headerContext: Signal<MultiSelectHeaderContext> = computed(() => ({
    $implicit: this.enabledOptions(),
    options: this.enabledOptions(),
    selectedCount: this.selectedOptions().length,
    allSelected: this.allSelected(),
    disabled: this.disabled(),
    toggleAll: (): void => this.handleToggleAll(),
  }));
  protected readonly selectionAnnouncement: Signal<string> = computed(() => `${this.selectedOptions().length} options selected`);

  public constructor() {
    super();
    afterRenderEffect({
      write: () => {
        if (!this.expanded()) return;
        const listbox: Listbox<MultiSelectValue> | undefined = this.listbox();
        if (!listbox?.activeDescendant()) return;
        listbox.scrollActiveItemIntoView();
      },
    });
  }

  /** Moves focus to the combobox unless disabled. */
  public focus(): void {
    if (!this.disabled()) this.combobox().element.focus();
  }

  /** Clears all selected values and closes the popup. */
  public reset(): void {
    this.value.set([]);
    this.expanded.set(false);
  }

  protected handleExpanded(expanded: boolean): void {
    if (this.expanded() === expanded) return;
    if (expanded) this.preferAvailableSpace();
    this.expanded.set(expanded);
    if (expanded) return;
    this.touch.emit();
  }

  protected handleSelection(values: MultiSelectValue[]): void {
    this.value.set(
      values.map(
        (value: MultiSelectValue): MultiSelectValue =>
          this.value().find((selected: MultiSelectValue): boolean => this.compareWith()(selected, value)) ?? value,
      ),
    );
  }

  protected handleClear(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled()) return;
    this.value.set([]);
  }

  protected handleToggleAll(): void {
    if (this.disabled()) return;
    this.value.set(
      this.allSelected() ? [] : this.enabledOptions().map((option: MultiSelectOption): MultiSelectValue => option.value),
    );
  }

  protected handleRemove(option: MultiSelectOption): void {
    if (this.disabled()) return;
    this.value.set(this.value().filter((value: MultiSelectValue): boolean => !this.compareWith()(option.value, value)));
    this.focus();
  }

  protected isSelected(option: MultiSelectOption): boolean {
    return this.value().some((value: MultiSelectValue): boolean => this.compareWith()(option.value, value));
  }

  protected itemContext(option: MultiSelectOption, index: number): MultiSelectItemContext {
    return { $implicit: option, option, selected: this.isSelected(option), disabled: Boolean(option.disabled), index };
  }

  private preferAvailableSpace(): void {
    const optionHeight: number = this.options().length
      ? Math.min(this.scrollHeight(), this.options().length * this.optionHeight() + 8)
      : 56;
    const panelHeight: number =
      optionHeight + (this.headerTemplate() || this.showSelectAll() ? 52 : 0) + (this.footerTemplate() ? 52 : 0);
    this.positions.set(selectionOverlayPositions(this.combobox().element, panelHeight));
  }
}
