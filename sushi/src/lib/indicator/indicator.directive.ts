import { Directive } from '@angular/core';

@Directive({
  selector: '[suiIndicator]',
  host: {
    class: 'indicator sui-indicator',
  },
})
export class Indicator {}
