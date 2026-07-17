import { Directive, input, InputSignal } from '@angular/core';
import { DividerOrientation, DividerPlacement, DividerSeverity } from './divider.interfaces';

@Directive({
  selector: '[suiDivider]',
  standalone: true,
  host: {
    class: 'divider sui-divider-control',

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
export class Divider {
  public readonly severity: InputSignal<DividerSeverity | null> = input<DividerSeverity | null>(null);
  public readonly orientation: InputSignal<DividerOrientation> = input<DividerOrientation>('horizontal');
  public readonly placement: InputSignal<DividerPlacement> = input<DividerPlacement>('center');
}
