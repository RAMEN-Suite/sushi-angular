import { Directive } from '@angular/core';

@Directive({
  selector: '[suiCardActions]',
  standalone: true,
  host: {
    class: 'card-actions sui-card-actions-control',
  },
})
export class SuiCardActions {}
