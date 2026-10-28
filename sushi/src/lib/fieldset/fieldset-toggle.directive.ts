import { Directive, inject } from '@angular/core';
import { Fieldset } from './fieldset.directive';

/** Turns a legend button into the controller for a collapsible fieldset. Use it only when `collapsible` is enabled. */
@Directive({
  selector: 'button[suiFieldsetToggle]',
  host: {
    class: 'sui-fieldset__toggle',
    type: 'button',
    '[attr.aria-expanded]': 'fieldset.expanded()',
    '[attr.aria-disabled]': 'fieldset.collapsible() ? null : "true"',
    '(click)': 'fieldset.toggle()',
  },
})
export class FieldsetToggle {
  protected readonly fieldset: Fieldset = inject(Fieldset);
}
