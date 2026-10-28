import { Directive } from '@angular/core';

/** Applies card title typography to a semantic heading. */
@Directive({ selector: '[suiCardTitle]', host: { class: 'card-title sui-card-title' } })
export class CardTitle {}
