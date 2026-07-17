import { Directive, input, InputSignal } from '@angular/core';
import { BadgeSeverity, BadgeSize, BadgeVariant } from './badge.interfaces';

@Directive({
  selector: '[suiBadge]',
  standalone: true,
  host: {
    class: 'badge sui-badge',

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
export class Badge {
  public readonly severity: InputSignal<BadgeSeverity> = input<BadgeSeverity>('primary');
  public readonly variant: InputSignal<BadgeVariant | null> = input<BadgeVariant | null>(null);
  public readonly size: InputSignal<BadgeSize> = input<BadgeSize>('md');
}
