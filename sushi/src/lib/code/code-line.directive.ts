import { Directive, input, InputSignal } from '@angular/core';

@Directive({
  selector: '[suiCodeLine]',
  standalone: true,
  host: {
    '[attr.data-prefix]': 'prefix()',
  },
})
export class SuiCodeLine {
  public readonly prefix: InputSignal<string | number | null> = input<string | number | null>(null);
}
