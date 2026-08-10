import { NgTemplateOutlet } from '@angular/common';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  Injector,
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
import { LucideCheck, LucideChevronDown, LucideX } from '@lucide/angular';
import { Button } from '../button';
import { FormControlSeverity, FormControlSize, FormControlState } from '../form-control';
import { compareSelectionValues } from '../selection';
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
    Button,
    Spinner,
  ],
  templateUrl: './multi-select.component.html',
  host: { class: 'inline-block max-w-full', '[class.w-full]': 'fluid()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelect extends FormControlState implements FormValueControl<MultiSelectModelValue> {
  public readonly value: ModelSignal<MultiSelectModelValue> = model<MultiSelectModelValue>([]);

  public readonly options: InputSignal<readonly MultiSelectOption[]> = input.required<readonly MultiSelectOption[]>();
  public readonly compareWith: InputSignal<MultiSelectCompareWith> = input<MultiSelectCompareWith>(compareSelectionValues);

  public readonly placeholder: InputSignal<string> = input<string>('Select options');
  public readonly emptyMessage: InputSignal<string> = input<string>('No options available');
  public readonly loadingMessage: InputSignal<string> = input<string>('Loading options');
  public readonly selectAllLabel: InputSignal<string> = input<string>('Select all');
  public readonly clearAllLabel: InputSignal<string> = input<string>('Clear all');

  public readonly scrollHeight: InputSignalWithTransform<number, unknown> = input(240, { transform: numberAttribute });
  public readonly optionHeight: InputSignalWithTransform<number, unknown> = input(44, { transform: numberAttribute });
  public readonly maxSelectedLabels: InputSignalWithTransform<number, unknown> = input(3, { transform: numberAttribute });
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
  public readonly severity: InputSignal<FormControlSeverity | null> = input<FormControlSeverity | null>(null);
  public readonly variant: InputSignal<MultiSelectVariant | null> = input<MultiSelectVariant | null>(null);

  public readonly id: InputSignal<string | null> = input<string | null>(null);
  public readonly ariaLabel: InputSignal<string> = input<string>('Select options');
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);

  public readonly showClear: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  public readonly showSelectAll: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly required: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly itemTemplate: Signal<TemplateRef<MultiSelectItemContext> | undefined> = contentChild(MultiSelectItemTemplate, {
    read: TemplateRef,
  });
  protected readonly selectedItemsTemplate: Signal<TemplateRef<MultiSelectSelectedItemsContext> | undefined> = contentChild(
    MultiSelectSelectedItemsTemplate,
    { read: TemplateRef },
  );
  protected readonly headerTemplate: Signal<TemplateRef<MultiSelectHeaderContext> | undefined> = contentChild(MultiSelectHeaderTemplate, {
    read: TemplateRef,
  });
  protected readonly footerTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MultiSelectFooterTemplate, {
    read: TemplateRef,
  });
  protected readonly emptyTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MultiSelectEmptyTemplate, {
    read: TemplateRef,
  });
  protected readonly groupTemplate: Signal<TemplateRef<MultiSelectGroupContext> | undefined> = contentChild(MultiSelectGroupTemplate, {
    read: TemplateRef,
  });
  protected readonly loadingTemplate: Signal<TemplateRef<MultiSelectLoadingContext> | undefined> = contentChild(
    MultiSelectLoadingTemplate,
    {
      read: TemplateRef,
    },
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
  protected readonly checkmarkIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MultiSelectCheckmarkIconTemplate, {
    read: TemplateRef,
  });

  protected readonly combobox: Signal<Combobox> = viewChild.required(Combobox);
  protected readonly listbox: Signal<Listbox<MultiSelectValue> | undefined> = viewChild(Listbox);

  protected readonly expanded: WritableSignal<boolean> = signal(false);
  protected readonly positioned: WritableSignal<boolean> = signal(false);
  protected readonly keyboardMode: WritableSignal<boolean> = signal(false);

  protected readonly selectedOptions: Signal<readonly MultiSelectOption[]> = computed(() =>
    this.options().filter((option) => this.value().some((value) => this.compareWith()(option.value, value))),
  );
  protected readonly displayValue: Signal<string> = computed(() => {
    const options: readonly MultiSelectOption[] = this.selectedOptions();
    if (!options.length) return this.placeholder();
    if (options.length <= Math.max(1, this.maxSelectedLabels())) return options.map((option) => option.label).join(', ');
    return `${options[0].label} +${options.length - 1}`;
  });
  protected readonly enabledOptions: Signal<readonly MultiSelectOption[]> = computed(() =>
    this.options().filter((option: MultiSelectOption): boolean => !option.disabled),
  );
  protected readonly allSelected: Signal<boolean> = computed(() => {
    const options: readonly MultiSelectOption[] = this.enabledOptions();
    return options.length > 0 && options.every((option: MultiSelectOption): boolean => this.isSelected(option));
  });
  protected readonly listboxValue: Signal<MultiSelectValue[]> = computed(() =>
    this.value().map(
      (value: MultiSelectValue): MultiSelectValue =>
        this.options().find((option: MultiSelectOption): boolean => this.compareWith()(option.value, value))?.value ?? value,
    ),
  );
  protected readonly selectedContext: Signal<MultiSelectSelectedItemsContext> = computed(() => ({
    $implicit: this.selectedOptions(),
    options: this.selectedOptions(),
    remove: (option: MultiSelectOption): void => this.remove(option),
    disabled: this.disabled(),
  }));
  protected readonly headerContext: Signal<MultiSelectHeaderContext> = computed(() => ({
    $implicit: this.enabledOptions(),
    options: this.enabledOptions(),
    selectedCount: this.selectedOptions().length,
    allSelected: this.allSelected(),
    disabled: this.disabled(),
    toggleAll: (): void => this.toggleAll(),
  }));
  protected readonly selectionAnnouncement: Signal<string> = computed(() => `${this.selectedOptions().length} options selected`);
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ];

  private readonly injector: Injector = inject(Injector);

  public focus(): void {
    if (!this.disabled()) this.combobox().element.focus();
  }

  public reset(): void {
    this.value.set([]);
    this.expanded.set(false);
    this.positioned.set(false);
  }

  protected handleExpanded(expanded: boolean): void {
    if (this.expanded() === expanded) return;
    this.expanded.set(expanded);
    if (expanded) {
      this.scrollActiveOption();
      return;
    }
    this.positioned.set(false);
    this.touch.emit();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && this.selectedOptions().length > 0) {
      event.preventDefault();
      const option: MultiSelectOption | undefined = this.selectedOptions().at(-1);
      if (option) this.remove(option);
      return;
    }
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes(event.key)) {
      this.keyboardMode.set(true);
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes(event.key)) return;
    this.scrollActiveOption();
  }

  protected handlePointerInteraction(): void {
    this.keyboardMode.set(false);
  }

  protected handleTriggerClick(event: MouseEvent): void {
    if (event.target instanceof Element && event.target.closest('button')) event.stopImmediatePropagation();
  }

  protected select(values: MultiSelectValue[]): void {
    this.value.set(
      values.map(
        (value: MultiSelectValue): MultiSelectValue =>
          this.value().find((selected: MultiSelectValue): boolean => this.compareWith()(selected, value)) ?? value,
      ),
    );
    this.scrollActiveOption();
  }

  protected clear(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled()) return;
    this.value.set([]);
    this.touch.emit();
  }

  protected toggleAll(): void {
    if (this.disabled()) return;
    this.value.set(this.allSelected() ? [] : this.enabledOptions().map((option: MultiSelectOption): MultiSelectValue => option.value));
    this.touch.emit();
    this.scrollActiveOption();
  }

  protected remove(option: MultiSelectOption): void {
    if (this.disabled()) return;
    this.value.set(this.value().filter((value) => !this.compareWith()(option.value, value)));
    this.touch.emit();
  }

  protected isSelected(option: MultiSelectOption): boolean {
    return this.value().some((value) => this.compareWith()(option.value, value));
  }

  protected itemContext(option: MultiSelectOption, index: number): MultiSelectItemContext {
    return { $implicit: option, option, selected: this.isSelected(option), disabled: Boolean(option.disabled), index };
  }

  protected position(overlay: CdkConnectedOverlay): void {
    afterNextRender(
      {
        write: () => {
          if (!this.expanded()) return;
          overlay.overlayRef.updatePosition();
          this.positioned.set(true);
        },
      },
      { injector: this.injector },
    );
  }

  private scrollActiveOption(): void {
    afterNextRender({ write: () => this.listbox()?.scrollActiveItemIntoView() }, { injector: this.injector });
  }
}
