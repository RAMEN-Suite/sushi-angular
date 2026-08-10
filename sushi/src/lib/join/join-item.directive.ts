import { Directive } from '@angular/core';

@Directive({
  selector: '[suiJoinItem]',
  host: { class: 'join-item sui-join-item' },
})
export class JoinItem {}
