import { Directive, input, InputSignal } from '@angular/core';
import { JoinOrientation } from '../join';

export type InputGroupOrientation = JoinOrientation | 'responsive';

@Directive({
  selector: '[suiInputGroup]',
  host: {
    class: 'join sui-input-group',
    '[class.join-horizontal]': 'orientation() === "horizontal"',
    '[class.join-vertical]': 'orientation() !== "horizontal"',
    '[class.sui-input-group--responsive]': 'orientation() === "responsive"',
  },
})
export class InputGroup {
  public readonly orientation: InputSignal<InputGroupOrientation> = input<InputGroupOrientation>('horizontal');
}
