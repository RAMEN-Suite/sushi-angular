import { Directive, input, InputSignal } from '@angular/core';
import { DividerOrientation, DividerPlacement, DividerSeverity } from './divider.interfaces';

@Directive({
  selector: '[suiDivider]',
  host: {
    class: 'divider sui-divider',

    '[class.divider-primary]': 'severity() === "primary"',
    '[class.divider-secondary]': 'severity() === "secondary"',
    '[class.divider-neutral]': 'severity() === "neutral"',
    '[class.divider-accent]': 'severity() === "accent"',
    '[class.divider-info]': 'severity() === "info"',
    '[class.divider-success]': 'severity() === "success"',
    '[class.divider-warning]': 'severity() === "warning"',
    '[class.divider-error]': 'severity() === "error"',

    '[class.divider-horizontal]': 'orientation() === "vertical"',

    '[class.divider-start]': 'placement() === "start"',
    '[class.divider-end]': 'placement() === "end"',
  },
})
/** Separates related content horizontally or vertically with an optional label. */
export class Divider {
  /** Applies a semantic line and label color. */
  public readonly severity: InputSignal<DividerSeverity | null> = input<DividerSeverity | null>(null);
  /** Controls the divider axis. */
  public readonly orientation: InputSignal<DividerOrientation> = input<DividerOrientation>('horizontal');
  /** Positions the optional label along the divider. */
  public readonly placement: InputSignal<DividerPlacement> = input<DividerPlacement>('center');
}
