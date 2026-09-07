import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  TemplateRef,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { Button } from '../button';
import { Input } from '../input';
import { Join, JoinItem } from '../join';
import { ColorPickerPresetContext, ColorPickerPresetSeverity, ColorPickerPresetValue } from './color-picker.interfaces';
import { ColorPickerPresetTemplate } from './color-picker.templates';

interface ColorPickerOption {
  color: string;
  label: string;
  custom: boolean;
  selected: boolean;
  disabled: boolean;
}

const HEX_COLOR_PATTERN: RegExp = /^#[\da-f]{6}$/i;
let nextColorPickerId: number = 0;

/** Selects a color through a native picker, text value, or preset palette. */
@Component({
  selector: 'sui-color-picker',
  imports: [NgTemplateOutlet, Button, Input, Join, JoinItem],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.css',
  host: {
    class: 'sui-color-picker inline-grid max-w-full gap-2',
    '[class.w-full]': 'fluid()',
    '[attr.id]': 'null',
    '[attr.aria-disabled]': 'disabled() || null',
    '(focusout)': 'handleFocusout($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPicker implements FormValueControl<string> {
  /** Current six-digit hex color. */
  public readonly value: ModelSignal<string> = model<string>('#000000');

  /** Optional preset colors rendered after the picker. */
  public readonly presets: InputSignal<readonly ColorPickerPresetValue[]> = input<readonly ColorPickerPresetValue[]>([]);
  /** Semantic color applied to the selected preset action. */
  public readonly presetSeverity: InputSignal<ColorPickerPresetSeverity> = input<ColorPickerPresetSeverity>('primary');

  /** Value restored by `reset()`. */
  public readonly defaultValue: InputSignal<string> = input<string>('#000000');
  /** Validation message shown for an incomplete or invalid hex value. */
  public readonly invalidMessage: InputSignal<string> = input<string>('Enter a valid six-digit hex color, for example #3b82f6.');

  /** ID applied to the primary visible control. */
  public readonly id: InputSignal<string | null> = input<string | null>(null);
  /** Accessible name used when no labelled-by reference is supplied. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Choose color');
  /** ID of an element that labels the picker. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** IDs of elements that describe the picker. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);

  /** Prevents color entry and preset selection while keeping controls focusable. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Expands the editable picker to the available width. */
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Shows the editable hex value beside the native color picker. */
  public readonly showInput: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Applies external form or business-validation semantics and styling in addition to local hex validation. */
  public readonly invalid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Emits when focus leaves the complete picker. */
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly presetTemplate: Signal<TemplateRef<ColorPickerPresetContext> | undefined> = contentChild(
    ColorPickerPresetTemplate,
    {
      read: TemplateRef,
    },
  );
  private readonly picker: Signal<ElementRef<HTMLInputElement>> = viewChild.required('pickerElement');

  protected readonly inputValue: Signal<string> = computed(() => this.draft() ?? this.value().toUpperCase());
  protected readonly controlId: Signal<string> = computed(() => this.id() ?? this.generatedId);
  protected readonly errorId: Signal<string> = computed(() => `${this.controlId()}-error`);
  protected readonly describedBy: Signal<string | null> = computed(() => {
    const ids: string[] = [this.ariaDescribedby(), this.localInvalid() ? this.errorId() : null].filter(
      (id: string | null): id is string => Boolean(id),
    );
    return ids.length ? ids.join(' ') : null;
  });
  protected readonly options: Signal<readonly ColorPickerOption[]> = computed(() => {
    const current: string = this.value();
    const isPreset: boolean = this.isPreset(current);
    const options: ColorPickerOption[] = this.presets().map((preset: ColorPickerPresetValue): ColorPickerOption => {
      const color: string = typeof preset === 'string' ? preset : preset.value;
      return {
        color,
        label: typeof preset === 'string' ? color : preset.label,
        custom: false,
        selected: color.toLowerCase() === current.toLowerCase(),
        disabled: typeof preset === 'string' ? false : Boolean(preset.disabled),
      };
    });
    const customColor: string = isPreset ? this.customColor() : current;
    return [...options, { color: customColor, label: 'Custom', custom: true, selected: !isPreset, disabled: false }];
  });

  protected readonly localInvalid: WritableSignal<boolean> = signal(false);

  private readonly generatedId: string = `sui-color-picker-${nextColorPickerId++}`;
  private readonly draft: WritableSignal<string | null> = signal(null);
  private readonly customColor: WritableSignal<string> = signal('#000000');
  private readonly element: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Moves focus to the native color picker. */
  public focus(): void {
    this.picker().nativeElement.focus();
  }

  /** Restores `defaultValue` and clears local validation state. */
  public reset(): void {
    const value: string = HEX_COLOR_PATTERN.test(this.defaultValue()) ? this.defaultValue() : '#000000';
    this.customColor.set(value);
    this.draft.set(null);
    this.localInvalid.set(false);
    this.value.set(value);
  }

  protected handleColorInput(event: Event): void {
    if (this.disabled()) return;
    const input: HTMLInputElement = event.currentTarget as HTMLInputElement;
    this.draft.set(null);
    this.localInvalid.set(false);
    this.customColor.set(input.value);
    this.value.set(input.value);
  }

  protected handleTextInput(event: Event): void {
    if (this.disabled()) return;
    const input: HTMLInputElement = event.currentTarget as HTMLInputElement;
    this.draft.set(input.value);
    if (!HEX_COLOR_PATTERN.test(input.value)) return;
    this.localInvalid.set(false);
    this.customColor.set(input.value);
    this.value.set(input.value);
  }

  protected validateInput(): void {
    const value: string | null = this.draft();
    if (value === null) return;
    const valid: boolean = HEX_COLOR_PATTERN.test(value);
    this.localInvalid.set(!valid);
    if (valid) this.draft.set(null);
  }

  protected selectOption(option: ColorPickerOption): void {
    if (this.disabled() || option.disabled) return;
    const current: string = this.value();
    if (!this.isPreset(current)) this.customColor.set(current);
    this.draft.set(null);
    this.localInvalid.set(false);
    this.value.set(option.color);
  }

  protected isTabStop(option: ColorPickerOption, index: number): boolean {
    if (option.disabled) return false;
    if (option.selected) return true;
    const options: readonly ColorPickerOption[] = this.options();
    const hasEnabledSelection: boolean = options.some(
      (candidate: ColorPickerOption): boolean => candidate.selected && !candidate.disabled,
    );
    return !hasEnabledSelection && options.findIndex((candidate: ColorPickerOption): boolean => !candidate.disabled) === index;
  }

  protected handlePresetKeydown(event: KeyboardEvent, index: number): void {
    if (this.disabled()) return;
    const keys: readonly string[] = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const options: readonly ColorPickerOption[] = this.options();
    const enabledIndices: number[] = options.reduce<number[]>((indices, option, optionIndex): number[] => {
      if (!option.disabled) indices.push(optionIndex);
      return indices;
    }, []);
    if (!enabledIndices.length) return;

    const currentPosition: number = Math.max(0, enabledIndices.indexOf(index));
    const direction: number = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const nextPosition: number =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? enabledIndices.length - 1
          : (currentPosition + direction + enabledIndices.length) % enabledIndices.length;
    const nextIndex: number = enabledIndices[nextPosition];
    const buttons: NodeListOf<HTMLButtonElement> = this.element.nativeElement.querySelectorAll('[role="radio"]');
    buttons.item(nextIndex).focus();
    this.selectOption(options[nextIndex]);
  }

  protected presetContext(option: ColorPickerOption): ColorPickerPresetContext {
    return {
      $implicit: option.color,
      color: option.color,
      label: option.label,
      custom: option.custom,
      selected: option.selected,
      disabled: this.disabled() || option.disabled,
    };
  }

  protected handleFocusout(event: FocusEvent): void {
    if (!this.element.nativeElement.contains(event.relatedTarget as Node | null)) this.touch.emit();
  }

  protected handleDisabledEvent(event: Event): void {
    if (!this.disabled()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  private isPreset(color: string): boolean {
    return this.presets().some((preset: ColorPickerPresetValue): boolean => {
      const value: string = typeof preset === 'string' ? preset : preset.value;
      return value.toLowerCase() === color.toLowerCase();
    });
  }
}
