import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Button } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-badge-context-example',
  imports: [Badge, Button],
  templateUrl: './context.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeContextExample {}
