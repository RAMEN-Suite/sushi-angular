import { Directive } from '@angular/core';

@Directive({
  selector: 'legend[suiFieldsetLegend]',
  host: { class: 'fieldset-legend sui-fieldset__legend' },
})
export class FieldsetLegend {}
