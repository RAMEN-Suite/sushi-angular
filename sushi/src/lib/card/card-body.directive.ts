import { Directive } from '@angular/core';

@Directive({ selector: '[suiCardBody]', host: { class: 'card-body sui-card-body' } })
export class CardBody {}
