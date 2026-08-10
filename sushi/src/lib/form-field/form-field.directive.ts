import { Directive } from '@angular/core';

@Directive({
  selector: '[suiFormField]',
  host: { class: 'sui-form-field' },
})
export class FormField {}
