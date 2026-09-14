import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, Skeleton } from '@sushi-kit/angular';

@Component({
  selector: 'pg-skeleton-list-example',
  imports: [Card, Skeleton],
  templateUrl: './list.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonListExample {
  protected readonly rows: readonly number[] = [1, 2, 3];
}
