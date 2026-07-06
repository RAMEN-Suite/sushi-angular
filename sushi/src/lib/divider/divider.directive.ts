import { Directive, input, InputSignal } from '@angular/core';
import { SuiDividerOrientation, SuiDividerPlacement, SuiDividerSeverity } from './divider.interfaces';

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
export class SuiDivider {
  public readonly severity: InputSignal<SuiDividerSeverity | null> = input<SuiDividerSeverity | null>(null);
  public readonly orientation: InputSignal<SuiDividerOrientation> = input<SuiDividerOrientation>('horizontal');
  public readonly placement: InputSignal<SuiDividerPlacement> = input<SuiDividerPlacement>('center');
}
