import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, Skeleton } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-skeleton-card-example',
  imports: [Card, Skeleton],
  templateUrl: './card.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonCardExample {}
