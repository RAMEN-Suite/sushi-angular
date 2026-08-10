import { booleanAttribute, Directive, input, InputSignalWithTransform } from '@angular/core';

@Directive({
  selector: '[suiLabel]',
  host: {
    class: 'sui-form-field sui-label',
    '[class.sui-label--floating]': 'floating()',
  },
})
export class Label {
  public readonly floating: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
}
