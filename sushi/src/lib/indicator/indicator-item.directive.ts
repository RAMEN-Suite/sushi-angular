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
export class IndicatorItem {
  public readonly horizontal: InputSignal<IndicatorHorizontalPosition> = input<IndicatorHorizontalPosition>('end');
  public readonly vertical: InputSignal<IndicatorVerticalPosition> = input<IndicatorVerticalPosition>('top');
}
