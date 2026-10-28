import { Directive } from '@angular/core';

/** Styles the native legend that names a fieldset. */
@Directive({
  selector: 'legend[suiFieldsetLegend]',
  host: { class: 'fieldset-legend sui-fieldset__legend' },
})
export class FieldsetLegend {}
