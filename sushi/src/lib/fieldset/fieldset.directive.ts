import { Directive } from '@angular/core';

@Directive({
  selector: 'fieldset[suiFieldset]',
  host: { class: 'fieldset sui-fieldset' },
})
export class Fieldset {}
