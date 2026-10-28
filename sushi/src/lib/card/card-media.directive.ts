import { Directive } from '@angular/core';

/** Marks media that participates in a card layout. */
@Directive({ selector: '[suiCardMedia]', host: { class: 'sui-card__media' } })
export class CardMedia {}
