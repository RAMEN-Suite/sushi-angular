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
import { FormControlSeverity, FormControlSize, FormControlState } from '../form-control';
import { compareSelectionValues } from '../selection';
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
  host: { class: 'inline-block max-w-full', '[class.w-full]': 'fluid()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select extends FormControlState implements FormValueControl<SelectModelValue> {
  public readonly value: ModelSignal<SelectModelValue> = model<SelectModelValue>(null);

  public readonly options: InputSignal<readonly SelectOption[]> = input.required<readonly SelectOption[]>();
  public readonly compareWith: InputSignal<SelectCompareWith> = input<SelectCompareWith>(compareSelectionValues);

  public readonly placeholder: InputSignal<string> = input<string>('Select an option');
  public readonly emptyMessage: InputSignal<string> = input<string>('No options available');
  public readonly loadingMessage: InputSignal<string> = input<string>('Loading options');

  public readonly scrollHeight: InputSignalWithTransform<number, unknown> = input(240, { transform: numberAttribute });
  public readonly optionHeight: InputSignalWithTransform<number, unknown> = input(44, { transform: numberAttribute });
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
  public readonly severity: InputSignal<FormControlSeverity | null> = input<FormControlSeverity | null>(null);
  public readonly variant: InputSignal<SelectVariant | null> = input<SelectVariant | null>(null);

  public readonly id: InputSignal<string | null> = input<string | null>(null);
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);

  public readonly showClear: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly checkmark: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly required: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

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

  protected readonly selectedOption: Signal<SelectOption | undefined> = computed(() => {
    const value: SelectModelValue = this.value();
    return value === null ? undefined : this.options().find((option) => this.compareWith()(option.value, value));
  });
  protected readonly listboxValue: Signal<SelectValue[]> = computed(() => {
    const option: SelectOption | undefined = this.selectedOption();
    return option ? [option.value] : [];
  });
  protected readonly selectedContext: Signal<SelectSelectedItemContext | undefined> = computed(() => {
    const option: SelectOption | undefined = this.selectedOption();
    return option ? { $implicit: option, option } : undefined;
  });
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ];

  public constructor() {
    super();
    afterRenderEffect({
      write: () => {
        if (!this.expanded()) return;
        const listbox: Listbox<SelectValue> | undefined = this.listbox();
        if (!listbox?.activeDescendant()) return;
        listbox.scrollActiveItemIntoView();
      },
    });
  }

  public focus(): void {
    if (!this.disabled()) this.combobox().element.focus();
  }

  public reset(): void {
    this.value.set(null);
    this.expanded.set(false);
  }

  protected handleExpanded(expanded: boolean): void {
    if (this.expanded() === expanded) return;
    this.expanded.set(expanded);
    if (expanded) return;
    this.touch.emit();
  }

  protected select(values: SelectValue[]): void {
    const value: SelectValue | undefined = values.at(0);
    if (value !== undefined) this.value.set(value);
    this.handleExpanded(false);
  }

  protected clear(event: Event): void {
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
}
