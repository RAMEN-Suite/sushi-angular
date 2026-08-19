import { Directive } from '@angular/core';

@Directive({ selector: '[suiCardActions]', host: { class: 'card-actions sui-card-actions' } })
/** Aligns related actions inside a card. */
export class CardActions {}
