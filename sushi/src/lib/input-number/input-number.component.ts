import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
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
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { LucideMinus, LucidePlus } from '@lucide/angular';
import { Button } from '../button';
import { FormControlSize } from '../form-control';

const optionalNumber: (value: unknown) => number | undefined = (value: unknown): number | undefined =>
  value === null || value === undefined || value === '' ? undefined : numberAttribute(value);

@Component({
  selector: 'sui-input-number',
  imports: [LucideMinus, LucidePlus, Button],
  templateUrl: './input-number.component.html',
  host: { class: 'inline-block max-w-full', '[class.w-full]': 'fluid()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumber implements FormValueControl<number | null> {
  /** Current numeric value. */
  public readonly value: ModelSignal<number | null> = model<number | null>(null);
  /** Placeholder shown when no value is present. */
  public readonly placeholder: InputSignal<string> = input<string>('');

  /** Locale used to format the resting value. */
  public readonly locale: InputSignal<string> = input<string>('en');
  /** Optional ISO 4217 currency code used for currency formatting. */
  public readonly currency: InputSignal<string | null> = input<string | null>(null);

  /** Text displayed before the formatted value. */
  public readonly prefix: InputSignal<string> = input<string>('');
  /** Text displayed after the formatted value. */
  public readonly suffix: InputSignal<string> = input<string>('');

  /** Smallest permitted value. */
  public readonly min: InputSignalWithTransform<number | undefined, unknown> = input<number | undefined, unknown>(undefined, {
    transform: optionalNumber,
  });
  /** Largest permitted value. */
  public readonly max: InputSignalWithTransform<number | undefined, unknown> = input<number | undefined, unknown>(undefined, {
    transform: optionalNumber,
  });

  /** Minimum number of displayed fraction digits. */
  public readonly minFractionDigits: InputSignalWithTransform<number, unknown> = input(0, { transform: numberAttribute });
  /** Maximum number of displayed fraction digits. */
  public readonly maxFractionDigits: InputSignalWithTransform<number, unknown> = input(3, { transform: numberAttribute });
  /** Amount added or subtracted by the step controls and arrow keys. */
  public readonly step: InputSignalWithTransform<number, unknown> = input(1, { transform: numberAttribute });

  /** Accessible name for the internal spin-button. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** Sets the control height and text size. */
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
  /** Shows increment and decrement controls. */
  public readonly showButtons: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Expands the component to the available width. */
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Prevents editing and step actions. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Applies invalid semantics and styling. */
  public readonly invalid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Emits when the user completes an interaction. */
  public readonly touch: OutputEmitterRef<void> = output();

  private readonly inputElement: Signal<ElementRef<HTMLInputElement>> = viewChild.required('inputElement');

  protected readonly formatter: Signal<Intl.NumberFormat> = computed(
    () =>
      new Intl.NumberFormat(this.locale(), {
        style: this.currency() ? 'currency' : 'decimal',
        currency: this.currency() ?? undefined,
        minimumFractionDigits: this.minFractionDigits(),
        maximumFractionDigits: this.maxFractionDigits(),
      }),
  );
  protected readonly displayValue: Signal<string> = computed((): string => {
    const value: number | null = this.value();
    if (value === null) return '';
    return this.editing() ? String(value) : this.formatter().format(value);
  });

  private readonly editing: WritableSignal<boolean> = signal(false);

  /** Moves focus to the internal spinbutton. */
  public focus(): void {
    this.inputElement().nativeElement.focus();
  }

  /** Leaves editing mode so the current value is formatted again. */
  public reset(): void {
    this.editing.set(false);
  }

  protected handleFocus(): void {
    this.editing.set(true);
  }

  protected handleInput(event: Event): void {
    const input: HTMLInputElement = event.currentTarget as HTMLInputElement;
    const parts: Intl.NumberFormatPart[] = this.formatter().formatToParts(12345.6);
    const group: string = parts.find((part): boolean => part.type === 'group')?.value ?? ',';
    const decimal: string = parts.find((part): boolean => part.type === 'decimal')?.value ?? '.';

    const normalized: string = input.value
      .replaceAll(group, '')
      .replace(decimal, '.')
      .replace(/[^\d+-.]/g, '');
    const parsed: number = Number(normalized);

    this.value.set(normalized && Number.isFinite(parsed) ? this.clamp(parsed) : null);
  }

  protected adjust(direction: 1 | -1): void {
    this.value.set(this.clamp((this.value() ?? 0) + this.step() * direction));
  }

  protected handleStep(direction: 1 | -1): void {
    this.adjust(direction);
    this.touch.emit();
  }

  protected handleBlur(): void {
    this.editing.set(false);
    this.touch.emit();
  }

  private clamp(value: number): number {
    return Math.min(this.max() ?? Infinity, Math.max(this.min() ?? -Infinity, value));
  }
}
