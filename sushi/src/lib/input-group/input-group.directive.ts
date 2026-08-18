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
/** Connects inputs, add-ons, and actions as one visual field group. */
export class InputGroup {
  /** Controls whether items flow horizontally, vertically, or responsively. */
  public readonly orientation: InputSignal<InputGroupOrientation> = input<InputGroupOrientation>('horizontal');
}
