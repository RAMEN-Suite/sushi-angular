import { Directive } from '@angular/core';

@Directive({ selector: '[suiFormFieldLabel]', host: { class: 'label sui-form-field__label' } })
export class FormFieldLabel {}
