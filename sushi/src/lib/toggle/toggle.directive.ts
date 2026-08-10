import { Directive } from '@angular/core';
import { SelectionControlState } from '../form-control';

@Directive({
  selector: 'input[type="checkbox"][suiToggle]',
  host: {
    class: 'toggle sui-toggle',
    role: 'switch',
    '[class.toggle-primary]': 'severity() === "primary"',
    '[class.toggle-secondary]': 'severity() === "secondary"',
    '[class.toggle-accent]': 'severity() === "accent"',
    '[class.toggle-neutral]': 'severity() === "neutral"',
    '[class.toggle-info]': 'severity() === "info"',
    '[class.toggle-success]': 'severity() === "success"',
    '[class.toggle-warning]': 'severity() === "warning"',
    '[class.toggle-error]': 'severity() === "error" || isInvalid()',
    '[class.toggle-xs]': 'size() === "xs"',
    '[class.toggle-sm]': 'size() === "sm"',
    '[class.toggle-md]': 'size() === "md"',
    '[class.toggle-lg]': 'size() === "lg"',
    '[class.toggle-xl]': 'size() === "xl"',
    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
export class Toggle extends SelectionControlState {}
