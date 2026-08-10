import { booleanAttribute, Directive, input, InputSignalWithTransform } from '@angular/core';
import { FormControlState } from '../form-control';

@Directive({
  selector: 'input[suiInputWrapperControl]',
  host: {
    class: 'grow sui-input-wrapper__control',
    '[class.sui-input--clear-hidden]': '!showClear()',
    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
export class InputWrapperControl extends FormControlState {
  public readonly showClear: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
}
