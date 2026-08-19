import { Directive } from '@angular/core';

@Directive({ selector: '[suiCardMedia]', host: { class: 'sui-card__media' } })
/** Marks media that participates in a card layout. */
export class CardMedia {}
