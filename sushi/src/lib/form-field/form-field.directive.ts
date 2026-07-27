import { booleanAttribute, Directive, input } from '@angular/core';
import { BooleanInputValue, BooleanSignal } from '../sushi.types';

@Directive({
  selector: '[suiFormField]',
  host: {
    class: 'sui-form-field',
    '[class.sui-form-field--floating]': 'floating()',
    '[class.sui-form-field--animated]': 'floating() && animated()',
  },
})
export class FormField {
  public readonly floating: BooleanSignal = input<boolean, BooleanInputValue>(true, { transform: booleanAttribute });
  public readonly animated: BooleanSignal = input<boolean, BooleanInputValue>(false, { transform: booleanAttribute });
}
