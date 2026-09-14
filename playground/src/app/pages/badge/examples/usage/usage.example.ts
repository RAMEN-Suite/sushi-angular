import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, BadgeSeverity, BadgeSize, BadgeVariant } from '@sushi-kit/angular';

@Component({
  selector: 'pg-badge-usage-example',
  imports: [Badge],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeUsageExample {
  protected readonly severities: readonly BadgeSeverity[] = [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'error',
  ];
  protected readonly variants: readonly BadgeVariant[] = ['outlined', 'soft', 'dash'];
  protected readonly sizes: readonly BadgeSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
}
