import { booleanAttribute, Directive, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { InputSeverity, InputSize } from '../input';

@Directive({
  selector: 'label[suiInputWrapper]',
  host: {
    class: 'input sui-input-wrapper',
    '[class.input-primary]': 'severity() === "primary"',
    '[class.input-secondary]': 'severity() === "secondary"',
    '[class.input-accent]': 'severity() === "accent"',
    '[class.input-neutral]': 'severity() === "neutral"',
    '[class.input-info]': 'severity() === "info"',
    '[class.input-success]': 'severity() === "success"',
    '[class.input-warning]': 'severity() === "warning"',
    '[class.input-error]': 'severity() === "error" || invalid()',
    '[class.input-xs]': 'size() === "xs"',
    '[class.input-sm]': 'size() === "sm"',
    '[class.input-md]': 'size() === "md"',
    '[class.input-lg]': 'size() === "lg"',
    '[class.input-xl]': 'size() === "xl"',
  },
})
export class InputWrapper {
  public readonly severity: InputSignal<InputSeverity | null> = input<InputSeverity | null>(null);
  public readonly size: InputSignal<InputSize> = input<InputSize>('md');
  public readonly invalid: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
}
