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
/** Groups related content, media, and actions in one visual surface. */
export class Card {
  /** Changes the card border treatment. */
  public readonly variant: InputSignal<CardVariant> = input<CardVariant>('border');
  /** Controls card spacing and responsive typography. */
  public readonly size: InputSignal<CardSize> = input<CardSize>('md');
}
