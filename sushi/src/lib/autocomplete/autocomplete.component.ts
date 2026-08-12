import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  inject,
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
import { FormControlSeverity, FormControlSize, FormControlState } from '../form-control';
import { compareSelectionValues, filterSelectionOption } from '../selection';
import { Spinner } from '../spinner';
import {
  AutocompleteCompareWith,
  AutocompleteFilter,
  AutocompleteItemContext,
  AutocompleteOption,
  AutocompleteStatusContext,
  AutocompleteValue,
} from './autocomplete.interfaces';
import {
  AutocompleteEmptyTemplate,
  AutocompleteErrorTemplate,
  AutocompleteItemTemplate,
  AutocompleteLoadingTemplate,
  AutocompletePrefixTemplate,
} from './autocomplete.templates';

@Component({
  selector: 'sui-autocomplete',
  imports: [
    NgTemplateOutlet,
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    Listbox,
    Option,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    Spinner,
  ],
  templateUrl: './autocomplete.component.html',
  host: { class: 'inline-block max-w-full', '[class.w-full]': 'fluid()', '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autocomplete extends FormControlState implements FormValueControl<AutocompleteValue> {
  /** Selected option value, free-text value, or `null` when empty. */
  public readonly value: ModelSignal<AutocompleteValue> = model<AutocompleteValue>(null);

  /** Suggestions available to filtering and keyboard selection. */
  public readonly options: InputSignal<readonly AutocompleteOption[]> = input.required<readonly AutocompleteOption[]>();
  /** Compares option values when reference identity is not sufficient. */
  public readonly compareWith: InputSignal<AutocompleteCompareWith> = input<AutocompleteCompareWith>(compareSelectionValues);
  /** Filters suggestions for the current query. */
  public readonly filterWith: InputSignal<AutocompleteFilter> = input<AutocompleteFilter>(filterSelectionOption);

  /** Text shown while the input is empty. */
  public readonly placeholder: InputSignal<string> = input<string>('Search');
  /** Message shown when no suggestion matches. */
  public readonly emptyMessage: InputSignal<string> = input<string>('No suggestions found');
  /** Message shown while suggestions are loading. */
  public readonly loadingMessage: InputSignal<string> = input<string>('Loading suggestions');
  /** Message shown instead of suggestions when loading failed. */
  public readonly errorMessage: InputSignal<string | null> = input<string | null>(null);

  /** Sets the control dimensions. */
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
  /** Applies one semantic color to the control. */
  public readonly severity: InputSignal<FormControlSeverity | null> = input<FormControlSeverity | null>(null);
  /** Limits the popup height in pixels before it scrolls. */
  public readonly scrollHeight: InputSignalWithTransform<number, unknown> = input(240, { transform: numberAttribute });
  /** Sets the minimum height of each suggestion in pixels. */
  public readonly optionHeight: InputSignalWithTransform<number, unknown> = input(44, { transform: numberAttribute });
  /** Minimum query length required before suggestions open. */
  public readonly minQueryLength: InputSignalWithTransform<number, unknown> = input(1, { transform: numberAttribute });
  /** Delay in milliseconds before `queryChange` emits and the popup opens. */
  public readonly delay: InputSignalWithTransform<number, unknown> = input(300, { transform: numberAttribute });

  /** ID assigned to the native search input. */
  public readonly id: InputSignal<string | null> = input<string | null>(null);
  /** Accessible label used when no visible label is available. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the element that labels the input. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** IDs of elements that describe the input. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);

  /** Prevents focus and interaction. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Shows the loading state and prevents suggestion selection. */
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Marks the input as required for accessibility and forms. */
  public readonly required: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Restricts the model to values from `options`. */
  public readonly forceSelection: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Expands the control to the available width. */
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Emits the debounced query used to fetch or replace suggestions. */
  public readonly queryChange: OutputEmitterRef<string> = output<string>();
  /** Emits when the user completes an interaction. */
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly itemTemplate: Signal<TemplateRef<AutocompleteItemContext> | undefined> = contentChild(
    AutocompleteItemTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly emptyTemplate: Signal<TemplateRef<AutocompleteStatusContext> | undefined> = contentChild(
    AutocompleteEmptyTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly prefixTemplate: Signal<TemplateRef<void> | undefined> = contentChild(AutocompletePrefixTemplate, {
    read: TemplateRef,
  });
  protected readonly loadingTemplate: Signal<TemplateRef<AutocompleteStatusContext> | undefined> = contentChild(
    AutocompleteLoadingTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly errorTemplate: Signal<TemplateRef<AutocompleteStatusContext> | undefined> = contentChild(
    AutocompleteErrorTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly combobox: Signal<Combobox> = viewChild.required(Combobox);
  protected readonly listbox: Signal<Listbox<AutocompleteValue> | undefined> = viewChild(Listbox);

  protected readonly query: WritableSignal<string> = signal<string>('');
  protected readonly expanded: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly selectedOption: Signal<AutocompleteOption | undefined> = computed(() => {
    const value: AutocompleteValue = this.value();
    return value === null
      ? undefined
      : this.options().find((option: AutocompleteOption): boolean => this.compareWith()(option.value, value));
  });
  protected readonly inputValue: Signal<string> = computed(() => {
    const query: string = this.query();
    return query.length > 0 ? query : (this.selectedOption()?.label ?? '');
  });
  protected readonly filteredOptions: Signal<readonly AutocompleteOption[]> = computed(() =>
    this.options().filter((option: AutocompleteOption): boolean => this.filterWith()(option, this.inputValue())),
  );
  protected readonly matchedOption: Signal<AutocompleteOption | undefined> = computed(() => {
    const query: string = this.inputValue().trim().toLocaleLowerCase();
    if (!query) return undefined;
    return this.options().find((option: AutocompleteOption): boolean => option.label.trim().toLocaleLowerCase() === query);
  });
  protected readonly listboxValue: Signal<AutocompleteValue[]> = computed(() => {
    const option: AutocompleteOption | undefined = this.selectedOption();
    return option ? [option.value] : [];
  });
  protected readonly emptyContext: Signal<AutocompleteStatusContext> = computed(() => ({
    $implicit: this.emptyMessage(),
    message: this.emptyMessage(),
    query: this.inputValue(),
  }));
  protected readonly loadingContext: Signal<AutocompleteStatusContext> = computed(() => ({
    $implicit: this.loadingMessage(),
    message: this.loadingMessage(),
    query: this.inputValue(),
  }));
  protected readonly errorContext: Signal<AutocompleteStatusContext> = computed(() => {
    const message: string = this.errorMessage() ?? '';
    return { $implicit: message, message, query: this.inputValue() };
  });
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ];

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private queryTimer: ReturnType<typeof setTimeout> | undefined;

  public constructor() {
    super();
    this.destroyRef.onDestroy(() => clearTimeout(this.queryTimer));
    afterRenderEffect({
      write: () => {
        if (!this.expanded()) return;
        const listbox: Listbox<AutocompleteValue> | undefined = this.listbox();
        if (!listbox?.activeDescendant()) return;
        listbox.scrollActiveItemIntoView();
      },
    });
  }

  /** Moves focus to the search input unless disabled. */
  public focus(): void {
    if (!this.disabled()) this.combobox().element.focus();
  }

  /** Clears the value, query, pending delay, and popup. */
  public reset(): void {
    clearTimeout(this.queryTimer);
    this.value.set(null);
    this.query.set('');
    this.expanded.set(false);
  }

  protected handleInput(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    const query: string = event.target.value;

    clearTimeout(this.queryTimer);
    this.query.set(query);
    if (!query) this.value.set(null);
    else if (this.selectedOption()?.label !== query) this.value.set(this.forceSelection() ? null : query);
    if (this.disabled()) return;
    if (query.length < this.minQueryLength()) {
      this.expanded.set(false);
      if (!query) this.queryChange.emit('');
      return;
    }
    this.scheduleQuery(query);
  }

  protected handleBlur(): void {
    if (this.expanded()) return;
    if (this.forceSelection()) this.query.set(this.selectedOption()?.label ?? '');
    this.touch.emit();
  }

  protected handleSelection(values: AutocompleteValue[]): void {
    clearTimeout(this.queryTimer);
    const value: AutocompleteValue = values.at(0) ?? null;
    if (value === null) {
      this.handleExpanded(false);
      return;
    }
    this.value.set(value);
    this.query.set(
      this.options().find((option: AutocompleteOption): boolean => this.compareWith()(option.value, value))?.label ?? '',
    );
    this.handleExpanded(false);
  }

  protected handleExpanded(expanded: boolean): void {
    if (this.expanded() === expanded) return;
    this.expanded.set(expanded);
    if (expanded) return;
    if (this.forceSelection()) this.query.set(this.selectedOption()?.label ?? '');
    this.touch.emit();
  }

  protected handleEscape(event: Event): void {
    const query: string = event.target instanceof HTMLInputElement ? event.target.value : this.inputValue();
    event.preventDefault();
    event.stopImmediatePropagation();
    this.handleExpanded(false);
    if (!this.forceSelection()) this.query.set(query);
  }

  protected itemContext(option: AutocompleteOption, index: number): AutocompleteItemContext {
    const value: AutocompleteValue = this.value();
    return {
      $implicit: option,
      option,
      selected: value !== null && this.compareWith()(option.value, value),
      matched: this.matchedOption() === option,
      disabled: Boolean(option.disabled),
      index,
    };
  }

  private scheduleQuery(query: string): void {
    const complete = (): void => {
      this.queryChange.emit(query);
      this.expanded.set(true);
    };
    const delay: number = Math.max(0, this.delay());
    if (delay === 0) complete();
    else this.queryTimer = setTimeout(complete, delay);
  }
}
