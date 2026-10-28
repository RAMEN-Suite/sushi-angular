import { Directive } from '@angular/core';

/** Aligns related actions inside a card. */
@Directive({ selector: '[suiCardActions]', host: { class: 'card-actions sui-card-actions' } })
export class CardActions {}
