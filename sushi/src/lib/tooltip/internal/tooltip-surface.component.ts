import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { TooltipPlacement } from '../tooltip.interfaces';

@Component({
  selector: 'sui-tooltip-surface',
  template: `<div class="sui-tooltip" role="tooltip" [attr.data-placement]="placement()" [id]="surfaceId()">{{ text() }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** @internal */
export class TooltipSurface {
  /** @internal */
  public readonly text: InputSignal<string> = input.required<string>();
  /** @internal */
  public readonly surfaceId: InputSignal<string> = input.required<string>();
  /** @internal */
  public readonly placement: InputSignal<TooltipPlacement> = input.required<TooltipPlacement>();
}
