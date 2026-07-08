import { Directive } from '@angular/core';

@Directive({
  selector: '[suiCardTitle]',
  standalone: true,
  host: {
    class: 'card-title sui-card-title-control',
  },
})
export class SuiCardTitle {}

@Directive({
  selector: '[suiCardBody]',
  standalone: true,
  host: {
    class: 'card-body sui-card-body-control',
  },
})
export class SuiCardBody {}

@Directive({
  selector: '[suiCardActions]',
  standalone: true,
  host: {
    class: 'card-actions sui-card-actions-control',
  },
})
export class SuiCardActions {}
