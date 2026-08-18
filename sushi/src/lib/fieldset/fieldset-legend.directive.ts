import { Directive } from '@angular/core';

@Directive({
  selector: 'legend[suiFieldsetLegend]',
  host: { class: 'fieldset-legend sui-fieldset__legend' },
})
/** Styles the native legend that names a fieldset. */
export class FieldsetLegend {}
