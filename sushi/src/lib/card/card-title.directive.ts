import { Directive } from '@angular/core';

@Directive({ selector: '[suiCardTitle]', host: { class: 'card-title sui-card-title' } })
/** Applies card title typography to a semantic heading. */
export class CardTitle {}
