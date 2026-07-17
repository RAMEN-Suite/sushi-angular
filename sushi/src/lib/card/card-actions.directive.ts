import { Directive } from '@angular/core';

@Directive({
  selector: '[suiCardActions]',
  standalone: true,
  host: {
    class: 'card-actions sui-card-actions',
  },
})
export class CardActions {}
