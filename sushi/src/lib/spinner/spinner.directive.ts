import { Directive, input, InputSignal } from '@angular/core';
import { SpinnerSize, SpinnerType } from './spinner.interfaces';

@Directive({
  selector: 'span[suiSpinner]',
  host: {
    class: 'loading sui-spinner',

    '[class.loading-spinner]': 'type() === "spinner"',
    '[class.loading-dots]': 'type() === "dots"',
    '[class.loading-ring]': 'type() === "ring"',
    '[class.loading-ball]': 'type() === "ball"',
    '[class.loading-bars]': 'type() === "bars"',
    '[class.loading-infinity]': 'type() === "infinity"',

    '[class.loading-xs]': 'size() === "xs"',
    '[class.loading-sm]': 'size() === "sm"',
    '[class.loading-md]': 'size() === "md"',
    '[class.loading-lg]': 'size() === "lg"',
    '[class.loading-xl]': 'size() === "xl"',

    '[attr.aria-hidden]': '"true"',
  },
})
/** Renders an assistive-technology-hidden loading animation that must be paired with accessible status text. */
export class Spinner {
  /** Selects the loading animation. */
  public readonly type: InputSignal<SpinnerType> = input<SpinnerType>('spinner');
  /** Controls the spinner dimensions. */
  public readonly size: InputSignal<SpinnerSize> = input<SpinnerSize>('md');
}
