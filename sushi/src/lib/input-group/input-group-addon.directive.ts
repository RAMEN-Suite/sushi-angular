import { Directive } from '@angular/core';

@Directive({
  selector: '[suiInputGroupAddon]',
  host: {
    class:
      'join-item border-base-300 bg-base-200 pointer-events-none inline-flex min-h-10 items-center border px-3.5 sui-input-group-addon',
  },
})
export class InputGroupAddon {}
