import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle, List, ListItemTemplate, Status, StatusAnimation, StatusSeverity } from '@ramen-suite/sushi';

interface Service {
  readonly name: string;
  readonly state: string;
  readonly severity: StatusSeverity;
  readonly animation?: StatusAnimation;
}

@Component({
  selector: 'pg-status-services-example',
  imports: [Badge, Card, CardTitle, List, ListItemTemplate, Status],
  templateUrl: './services.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusServicesExample {
  protected readonly services: readonly Service[] = [
    { name: 'API', state: 'Healthy', severity: 'success' },
    { name: 'Search index', state: 'Syncing', severity: 'info', animation: 'ping' },
    { name: 'Background jobs', state: 'Delayed', severity: 'warning', animation: 'bounce' },
  ];
}
