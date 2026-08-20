import { Directive, input, InputSignal } from '@angular/core';
import { BadgeSeverity, BadgeSize, BadgeVariant } from './badge.interfaces';

/** Styles compact, non-interactive labels for status or metadata. */
@Directive({
  selector: '[suiBadge]',
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

    '[class.badge-xs]': 'size() === "xs"',
    '[class.badge-sm]': 'size() === "sm"',
    '[class.badge-md]': 'size() === "md"',
    '[class.badge-lg]': 'size() === "lg"',
    '[class.badge-xl]': 'size() === "xl"',
  },
})
export class Badge {
  /** Controls the semantic color of the static badge. */
  public readonly severity: InputSignal<BadgeSeverity> = input<BadgeSeverity>('primary');
  /** Controls the visual treatment without adding interaction. */
  public readonly variant: InputSignal<BadgeVariant | null> = input<BadgeVariant | null>(null);
  /** Controls the badge height, spacing, and text size. */
  public readonly size: InputSignal<BadgeSize> = input<BadgeSize>('md');
}
