import { Directive } from '@angular/core';

@Directive({ selector: '[suiCardTitle]', host: { class: 'card-title sui-card-title' } })
export class CardTitle {}
