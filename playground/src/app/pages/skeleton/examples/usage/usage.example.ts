import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '@sushi-kit/angular';
@Component({
  selector: 'pg-skeleton-usage-example',
  imports: [Skeleton],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonUsageExample {}
