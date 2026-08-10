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
export class Join {
  public readonly orientation: InputSignal<JoinOrientation> = input<JoinOrientation>('horizontal');
}
