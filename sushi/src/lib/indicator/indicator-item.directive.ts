import { Directive, input, InputSignal } from '@angular/core';
import { IndicatorHorizontalPosition, IndicatorVerticalPosition } from './indicator.interfaces';

@Directive({
  selector: '[suiIndicatorItem]',
  host: {
    class: 'indicator-item sui-indicator-item',
    '[class.indicator-start]': 'horizontal() === "start"',
    '[class.indicator-center]': 'horizontal() === "center"',
    '[class.indicator-end]': 'horizontal() === "end"',
    '[class.indicator-top]': 'vertical() === "top"',
    '[class.indicator-middle]': 'vertical() === "middle"',
    '[class.indicator-bottom]': 'vertical() === "bottom"',
  },
})
/** Positions projected content relative to its indicator target. */
export class IndicatorItem {
  /** Aligns the item along the horizontal axis. */
  public readonly horizontal: InputSignal<IndicatorHorizontalPosition> = input<IndicatorHorizontalPosition>('end');
  /** Aligns the item along the vertical axis. */
  public readonly vertical: InputSignal<IndicatorVerticalPosition> = input<IndicatorVerticalPosition>('top');
}
