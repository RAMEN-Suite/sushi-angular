import { booleanAttribute, Directive, input, InputSignalWithTransform } from '@angular/core';
import { FormControlState } from '../form-control';

@Directive({
  selector: 'input[suiInputSurfaceControl]',
  host: {
    class: 'grow sui-input-surface__control',
    '[class.sui-input--clear-hidden]': '!showClear()',
    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
/** Marks the native input that owns value, form state, and native attributes inside an input surface. */
export class InputSurfaceControl extends FormControlState {
  /** Shows the browser clear affordance for supported native input types. */
  public readonly showClear: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
}
