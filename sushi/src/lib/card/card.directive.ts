import { Directive, input, InputSignal } from '@angular/core';
import { CardSize, CardVariant } from './card.interfaces';

@Directive({
  selector: '[suiCard]',
  standalone: true,
  host: {
    class: 'card sui-card',

    '[class.card-border]': 'variant() === "border"',
    '[class.card-dash]': 'variant() === "dash"',

    '[class.card-xs]': 'size() === "xs"',
    '[class.card-sm]': 'size() === "sm"',
    '[class.card-md]': 'size() === "md"',
    '[class.card-lg]': 'size() === "lg"',
    '[class.card-xl]': 'size() === "xl"',
  },
})
export class Card {
  public readonly variant: InputSignal<CardVariant> = input<CardVariant>('border');
  public readonly size: InputSignal<CardSize | null> = input<CardSize | null>(null);
}
