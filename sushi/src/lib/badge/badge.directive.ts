import { Directive, input, InputSignal } from '@angular/core';
import { SuiBadgeSeverity, SuiBadgeSize, SuiBadgeVariant } from './badge.interfaces';

@Directive({
  selector: '[suiBadge]',
  standalone: true,
  host: {
    class: 'badge sui-badge-control',

    '[class.badge-primary]': 'severity() === "primary"',
    '[class.badge-secondary]': 'severity() === "secondary"',
    '[class.badge-neutral]': 'severity() === "neutral"',
    '[class.badge-accent]': 'severity() === "accent"',
    '[class.badge-info]': 'severity() === "info"',
    '[class.badge-success]': 'severity() === "success"',
    '[class.badge-warning]': 'severity() === "warning"',
    '[class.badge-error]': 'severity() === "error"',

    '[class.badge-outline]': 'variant() === "outlined"',
    '[class.badge-soft]': 'variant() === "soft"',
    '[class.badge-dash]': 'variant() === "dash"',
    '[class.badge-ghost]': 'variant() === "ghost"',

    '[class.badge-xs]': 'size() === "xs"',
    '[class.badge-sm]': 'size() === "sm"',
    '[class.badge-md]': 'size() === "md"',
    '[class.badge-lg]': 'size() === "lg"',
    '[class.badge-xl]': 'size() === "xl"',
  },
})
export class SuiBadge {
  public readonly severity: InputSignal<SuiBadgeSeverity> = input<SuiBadgeSeverity>('primary');
  public readonly variant: InputSignal<SuiBadgeVariant | null> = input<SuiBadgeVariant | null>(null);
  public readonly size: InputSignal<SuiBadgeSize> = input<SuiBadgeSize>('md');
}
