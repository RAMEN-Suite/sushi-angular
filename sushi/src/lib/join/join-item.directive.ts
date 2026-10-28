import { Directive } from '@angular/core';

/** Marks a direct child as part of a join. */
@Directive({
  selector: '[suiJoinItem]',
  host: { class: 'join-item sui-join-item' },
})
export class JoinItem {}
