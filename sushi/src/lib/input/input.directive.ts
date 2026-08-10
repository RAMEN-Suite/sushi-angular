import { booleanAttribute, Directive, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { FormControlState } from '../form-control';
import { InputSeverity, InputSize } from './input.interfaces';

@Directive({
  selector: 'input[suiInput]',
  host: {
    class: 'input sui-input sui-form-control',

    '[class.input-primary]': 'severity() === "primary"',
    '[class.input-secondary]': 'severity() === "secondary"',
    '[class.input-accent]': 'severity() === "accent"',
    '[class.input-neutral]': 'severity() === "neutral"',
    '[class.input-info]': 'severity() === "info"',
    '[class.input-success]': 'severity() === "success"',
    '[class.input-warning]': 'severity() === "warning"',
    '[class.input-error]': 'severity() === "error" || isInvalid()',

    '[class.input-xs]': 'size() === "xs"',
    '[class.input-sm]': 'size() === "sm"',
    '[class.input-md]': 'size() === "md"',
    '[class.input-lg]': 'size() === "lg"',
    '[class.input-xl]': 'size() === "xl"',

    '[class.sui-input--clear-hidden]': '!showClear()',

    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
export class Input extends FormControlState {
  /** Applies a semantic border color to the native input. */
  public readonly severity: InputSignal<InputSeverity | null> = input<InputSeverity | null>(null);

  /** Sets the control height and text size. */
  public readonly size: InputSignal<InputSize> = input<InputSize>('md');

  /** Keeps the browser-provided clear affordance visible for supported input types. */
  public readonly showClear: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
}
