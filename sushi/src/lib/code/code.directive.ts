import { Directive, input, InputSignal } from '@angular/core';
import { SuiCodeVariant } from './code.interfaces';

@Directive({
  selector: '[suiCode]',
  standalone: true,
  host: {
    class: 'mockup-code sui-code-control',

    '[class.border]': 'variant() === "border"',
    '[class.border-base-300]': 'variant() === "border"',

    '[class.bg-base-200]': 'variant() === "filled"',
  },
})
export class SuiCode {
  public readonly variant: InputSignal<SuiCodeVariant> = input<SuiCodeVariant>('default');
}
