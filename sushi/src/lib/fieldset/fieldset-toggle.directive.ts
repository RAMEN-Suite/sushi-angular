import { Directive, inject } from '@angular/core';
import { Fieldset } from './fieldset.directive';

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
/** Turns a legend button into the controller for its collapsible fieldset. */
export class FieldsetToggle {
  protected readonly fieldset: Fieldset = inject(Fieldset);
}
