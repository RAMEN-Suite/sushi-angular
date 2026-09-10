import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '@ramen-suite/sushi';
@Component({
  selector: 'pg-skeleton-usage-example',
  imports: [Skeleton],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonUsageExample {}
