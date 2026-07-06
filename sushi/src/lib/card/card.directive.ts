import { Directive, input, InputSignal } from '@angular/core';
import { SuiCardSize, SuiCardVariant } from './card.interfaces';

@Directive({
  selector: '[suiCard]',
  standalone: true,
  host: {
    class: 'card sui-card-control',

    '[class.card-border]': 'variant() === "border"',
    '[class.card-dash]': 'variant() === "dash"',

    '[class.card-xs]': 'size() === "xs"',
    '[class.card-sm]': 'size() === "sm"',
    '[class.card-md]': 'size() === "md"',
    '[class.card-lg]': 'size() === "lg"',
    '[class.card-xl]': 'size() === "xl"',
  },
})
export class SuiCard {
  public readonly variant: InputSignal<SuiCardVariant> = input<SuiCardVariant>('border');
  public readonly size: InputSignal<SuiCardSize> = input<SuiCardSize>('md');
}
