import { Directive } from '@angular/core';

@Directive({
  selector: '[suiJoinItem]',
  host: { class: 'join-item sui-join-item' },
})
/** Marks a direct child as part of a join. */
export class JoinItem {}
