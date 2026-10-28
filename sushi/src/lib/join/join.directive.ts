import { Directive, input, type InputSignal } from '@angular/core';
import { type JoinOrientation } from './join.interfaces';

/** Visually connects related controls without changing their semantics. */
@Directive({
  selector: '[suiJoin]',
  host: {
    class: 'join sui-join',
    '[class.join-horizontal]': 'orientation() === "horizontal"',
    '[class.join-vertical]': 'orientation() === "vertical"',
  },
})
export class Join {
  /** Sets the direction in which child items are connected. */
  public readonly orientation: InputSignal<JoinOrientation> = input<JoinOrientation>('horizontal');
}
