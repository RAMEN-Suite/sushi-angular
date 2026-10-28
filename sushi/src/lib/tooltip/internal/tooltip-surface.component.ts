import { ChangeDetectionStrategy, Component, input, type InputSignal } from '@angular/core';
import { type TooltipPlacement } from '../tooltip.interfaces';

/** @internal */
@Component({
  selector: 'sui-tooltip-surface',
  template: `<div class="sui-tooltip" role="tooltip" [attr.data-placement]="placement()" [id]="surfaceId()">{{ text() }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipSurface {
  /** @internal */
  public readonly text: InputSignal<string> = input.required<string>();
  /** @internal */
  public readonly surfaceId: InputSignal<string> = input.required<string>();
  /** @internal */
  public readonly placement: InputSignal<TooltipPlacement> = input.required<TooltipPlacement>();
}
