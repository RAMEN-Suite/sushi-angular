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
  Signal,
  viewChild,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { FormControlSize } from '../form-control';

/** Edits a fixed-length one-time code through one accessible native input. */
@Component({
  selector: 'sui-input-otp',
  templateUrl: './input-otp.component.html',
  host: { class: 'sui-input-otp inline-block max-w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtp implements FormValueControl<string> {
  /** Current verification code. */
  public readonly value: ModelSignal<string> = model<string>('');

  /** Number of characters accepted and displayed. */
  public readonly length: InputSignalWithTransform<number, unknown> = input(6, { transform: numberAttribute });
  /** Sets the slot height and text size. */
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');

  /** ID forwarded to the native input for label association. */
  public readonly id: InputSignal<string | null> = input<string | null>(null);
  /** Accessible name for the native input. */
  public readonly ariaLabel: InputSignal<string> = input<string>('One-time password');
  /** IDs of elements that label the native input. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** IDs of elements that describe the native input. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);

  /** Disables code entry and focus. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Applies invalid semantics and styling to the complete group. */
  public readonly invalid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Masks entered characters. */
  public readonly masked: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Restricts entry to numeric characters. */
  public readonly numeric: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Connects adjacent slots into one visual group. */
  public readonly joined: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Emits when the native input loses focus. */
  public readonly touch: OutputEmitterRef<void> = output();

  private readonly inputElement: Signal<ElementRef<HTMLInputElement>> = viewChild.required('inputElement');

  protected readonly indices: Signal<readonly number[]> = computed(() =>
    Array.from({ length: this.length() }, (_value: unknown, index: number): number => index),
  );

  /** Moves focus to the native input. */
  public focus(): void {
    if (this.disabled()) return;
    this.inputElement().nativeElement.focus();
  }

  /** Clears the current code. */
  public reset(): void {
    this.value.set('');
  }

  protected handleInput(event: Event): void {
    if (this.disabled()) return;
    const inputElement: HTMLInputElement = event.currentTarget as HTMLInputElement;
    const nextValue: string = (this.numeric() ? inputElement.value.replace(/\D/g, '') : inputElement.value).slice(
      0,
      this.length(),
    );
    inputElement.value = nextValue;
    this.value.set(nextValue);
  }
}
