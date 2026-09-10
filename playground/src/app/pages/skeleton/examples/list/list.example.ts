import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, Skeleton } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-skeleton-list-example',
  imports: [Card, Skeleton],
  templateUrl: './list.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonListExample {
  protected readonly rows: readonly number[] = [1, 2, 3];
}
