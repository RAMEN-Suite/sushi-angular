import { Directive } from '@angular/core';
import { SelectionControlState } from '../form-control';

/** Styles a native radio control and exposes consistent form state. */
@Directive({
  selector: 'input[type="radio"][suiRadio]',
  host: {
    class: 'radio sui-radio',
    '[class.radio-primary]': 'severity() === "primary"',
    '[class.radio-secondary]': 'severity() === "secondary"',
    '[class.radio-accent]': 'severity() === "accent"',
    '[class.radio-neutral]': 'severity() === "neutral"',
    '[class.radio-info]': 'severity() === "info"',
    '[class.radio-success]': 'severity() === "success"',
    '[class.radio-warning]': 'severity() === "warning"',
    '[class.radio-error]': 'severity() === "error" || isInvalid()',
    '[class.radio-xs]': 'size() === "xs"',
    '[class.radio-sm]': 'size() === "sm"',
    '[class.radio-md]': 'size() === "md"',
    '[class.radio-lg]': 'size() === "lg"',
    '[class.radio-xl]': 'size() === "xl"',
    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
export class Radio extends SelectionControlState {}
