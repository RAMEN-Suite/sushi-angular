import { Directive } from '@angular/core';

@Directive({
  selector: '[suiCardTitle]',
  standalone: true,
  host: {
    class: 'card-title sui-card-title',
  },
})
export class CardTitle {}
