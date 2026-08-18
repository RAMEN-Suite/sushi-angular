import { Directive, input, InputSignal } from '@angular/core';
import { JoinOrientation } from './join.interfaces';

@Directive({
  selector: '[suiJoin]',
  host: {
    class: 'join sui-join',
    '[class.join-horizontal]': 'orientation() === "horizontal"',
    '[class.join-vertical]': 'orientation() === "vertical"',
  },
})
/** Visually connects related controls without changing their semantics. */
export class Join {
  /** Sets the direction in which child items are connected. */
  public readonly orientation: InputSignal<JoinOrientation> = input<JoinOrientation>('horizontal');
}
