import { Directive, input, InputSignal } from '@angular/core';
import { KbdSize } from './kbd.interfaces';

@Directive({
  selector: 'kbd[suiKbd]',
  host: {
    class: 'kbd sui-kbd cursor-pointer select-none',

    '[class.kbd-xs]': 'size() === "xs"',
    '[class.kbd-sm]': 'size() === "sm"',
    '[class.kbd-md]': 'size() === "md"',
    '[class.kbd-lg]': 'size() === "lg"',
    '[class.kbd-xl]': 'size() === "xl"',

    '(mousedown)': '$event.preventDefault()',
  },
})
export class Kbd {
  public readonly size: InputSignal<KbdSize> = input<KbdSize>('md');
}
