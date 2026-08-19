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
/** Styles a semantic keyboard key without introducing button behavior. */
export class Kbd {
  /** Controls the key dimensions and text size. */
  public readonly size: InputSignal<KbdSize> = input<KbdSize>('md');
}
