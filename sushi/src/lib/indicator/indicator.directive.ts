import { Directive } from '@angular/core';

@Directive({
  selector: '[suiIndicator]',
  host: {
    class: 'indicator sui-indicator',
  },
})
/** Establishes the positioning context for one or more indicator items. */
export class Indicator {}
