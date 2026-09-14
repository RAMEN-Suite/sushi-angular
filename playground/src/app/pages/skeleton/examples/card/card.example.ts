import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, Skeleton } from '@sushi-kit/angular';

@Component({
  selector: 'pg-skeleton-card-example',
  imports: [Card, Skeleton],
  templateUrl: './card.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonCardExample {}
