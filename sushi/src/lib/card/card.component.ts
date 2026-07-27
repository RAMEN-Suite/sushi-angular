import { ChangeDetectionStrategy, Component, input, InputSignal, ViewEncapsulation } from '@angular/core';
import { CardSize, CardVariant } from './card.interfaces';

@Component({
  selector: 'sui-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Card {
  public readonly variant: InputSignal<CardVariant> = input<CardVariant>('border');
  public readonly size: InputSignal<CardSize> = input<CardSize>('md');
}
