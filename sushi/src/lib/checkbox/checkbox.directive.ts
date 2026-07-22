import { booleanAttribute, Directive, input } from '@angular/core';
import { SelectionControl } from '../selection-control/selection-control';
import { BooleanInput, BooleanInputValue } from '../sushi.types';

@Directive({
  selector: 'input[type="checkbox"][suiCheckbox]',
  standalone: true,
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
export class Checkbox extends SelectionControl {
  public readonly indeterminate: BooleanInput = input<boolean, BooleanInputValue>(false, { transform: booleanAttribute });
}
