import { Directive, input, InputSignal } from '@angular/core';
import { MaskHalf, MaskShape } from './mask.interfaces';

@Directive({
  selector: '[suiMask]',
  host: {
    class: 'sui-mask',
    '[class.mask]': 'suiMask() !== null',
    '[class.mask-squircle]': 'suiMask() === "squircle"',
    '[class.mask-heart]': 'suiMask() === "heart"',
    '[class.mask-hexagon]': 'suiMask() === "hexagon"',
    '[class.mask-hexagon-2]': 'suiMask() === "hexagon-2"',
    '[class.mask-decagon]': 'suiMask() === "decagon"',
    '[class.mask-pentagon]': 'suiMask() === "pentagon"',
    '[class.mask-diamond]': 'suiMask() === "diamond"',
    '[class.mask-square]': 'suiMask() === "square"',
    '[class.mask-circle]': 'suiMask() === "circle"',
    '[class.mask-star]': 'suiMask() === "star"',
    '[class.mask-star-2]': 'suiMask() === "star-2"',
    '[class.mask-triangle]': 'suiMask() === "triangle"',
    '[class.mask-triangle-2]': 'suiMask() === "triangle-2"',
    '[class.mask-triangle-3]': 'suiMask() === "triangle-3"',
    '[class.mask-triangle-4]': 'suiMask() === "triangle-4"',
    '[class.mask-half-1]': 'suiMask() !== null && maskHalf() === "first"',
    '[class.mask-half-2]': 'suiMask() !== null && maskHalf() === "second"',
  },
})
/** Crops an image or other element to a built-in shape. */
export class Mask {
  /** Shape applied to the host element. Pass null to remove masking. */
  public readonly suiMask: InputSignal<MaskShape | null> = input.required<MaskShape | null>();
  /** Optionally retains only the first or second half of the selected shape. */
  public readonly maskHalf: InputSignal<MaskHalf | null> = input<MaskHalf | null>(null);
}
