import { Directive, input, type InputSignal } from '@angular/core';
import { type InputGroupOrientation } from './input-group.interfaces';

@Directive({
  selector: '[suiInputGroup]',
  host: {
    class: 'join sui-input-group',
    '[class.join-horizontal]': 'orientation() === "horizontal"',
    '[class.join-vertical]': 'orientation() !== "horizontal"',
    '[class.sui-input-group--responsive]': 'orientation() === "responsive"',
  },
})
/** Connects inputs, add-ons, and actions as one visual group without changing their semantics. */
export class InputGroup {
  /** Layout direction. Responsive groups stack below 48rem and become horizontal at 48rem. */
  public readonly orientation: InputSignal<InputGroupOrientation> = input<InputGroupOrientation>('horizontal');
}
