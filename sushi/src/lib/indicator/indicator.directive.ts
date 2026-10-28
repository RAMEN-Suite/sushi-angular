import { Directive } from '@angular/core';

/** Establishes the positioning context for one or more indicator items. */
@Directive({
  selector: '[suiIndicator]',
  host: {
    class: 'indicator sui-indicator',
  },
})
export class Indicator {}
