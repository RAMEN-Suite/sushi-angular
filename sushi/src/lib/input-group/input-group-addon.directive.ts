import { Directive } from '@angular/core';

@Directive({
  selector: '[suiInputGroupAddon]',
  host: {
    class: 'join-item sui-input-group-addon inline-flex min-h-10 items-center px-3.5 pointer-events-none',
  },
})
/** Marks non-interactive prefix or suffix content inside an input group. */
export class InputGroupAddon {}
