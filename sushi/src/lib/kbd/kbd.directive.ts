import { Directive, input, type InputSignal } from '@angular/core';
import { type KbdSize } from './kbd.interfaces';

/** Styles a semantic keyboard key without introducing button behavior. */
@Directive({
  selector: 'kbd[suiKbd]',
  host: {
    class: 'kbd sui-kbd select-none',

    '[class.kbd-xs]': 'size() === "xs"',
    '[class.kbd-sm]': 'size() === "sm"',
    '[class.kbd-md]': 'size() === "md"',
    '[class.kbd-lg]': 'size() === "lg"',
    '[class.kbd-xl]': 'size() === "xl"',
  },
})
export class Kbd {
  /** Controls the key dimensions and text size. */
  public readonly size: InputSignal<KbdSize> = input<KbdSize>('md');
}
