import { Directive } from '@angular/core';

@Directive({
  selector: '[suiCardBody]',
  standalone: true,
  host: {
    class: 'card-body sui-card-body',
  },
})
export class CardBody {}
