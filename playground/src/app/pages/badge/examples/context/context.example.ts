import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Button, Card, List, ListItemTemplate, ThemeSeverity } from '@sushi-kit/angular';

interface Environment {
  readonly name: string;
  readonly state: string;
  readonly severity: ThemeSeverity;
}

@Component({
  selector: 'pg-badge-context-example',
  imports: [Badge, Button, Card, List, ListItemTemplate],
  templateUrl: './context.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeContextExample {
  protected readonly environments: readonly Environment[] = [
    { name: 'Production', state: 'Healthy', severity: 'success' },
    { name: 'Staging', state: 'Deploying', severity: 'warning' },
    { name: 'Preview', state: 'Paused', severity: 'neutral' },
  ];
}
