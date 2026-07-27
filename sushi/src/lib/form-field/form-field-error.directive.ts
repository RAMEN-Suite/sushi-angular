import { Directive } from '@angular/core';

@Directive({ selector: '[suiFormFieldError]', host: { class: 'sui-form-field__error', 'aria-live': 'polite' } })
export class FormFieldError {}
