import { booleanAttribute, Directive, input, InputSignalWithTransform } from '@angular/core';
import { SelectionControlState } from '../form-control';

@Directive({
  selector: 'input[type="checkbox"][suiCheckbox]',
  host: {
    class: 'checkbox sui-checkbox',
    '[class.checkbox-primary]': 'severity() === "primary"',
    '[class.checkbox-secondary]': 'severity() === "secondary"',
    '[class.checkbox-accent]': 'severity() === "accent"',
    '[class.checkbox-neutral]': 'severity() === "neutral"',
    '[class.checkbox-info]': 'severity() === "info"',
    '[class.checkbox-success]': 'severity() === "success"',
    '[class.checkbox-warning]': 'severity() === "warning"',
    '[class.checkbox-error]': 'severity() === "error" || isInvalid()',

    '[class.checkbox-xs]': 'size() === "xs"',
    '[class.checkbox-sm]': 'size() === "sm"',
    '[class.checkbox-md]': 'size() === "md"',
    '[class.checkbox-lg]': 'size() === "lg"',
    '[class.checkbox-xl]': 'size() === "xl"',

    '[indeterminate]': 'indeterminate()',
    '[attr.aria-checked]': 'indeterminate() ? "mixed" : null',
    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
export class Checkbox extends SelectionControlState {
  /** Shows the native mixed state and exposes `aria-checked="mixed"`. */
  public readonly indeterminate: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
}
