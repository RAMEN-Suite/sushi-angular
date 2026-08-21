import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle, List, ListItemTemplate, Status, ThemeSeverity } from '@ramen-suite/sushi';

interface Activity {
  readonly title: string;
  readonly description: string;
  readonly state: string;
  readonly severity: ThemeSeverity;
}

@Component({
  selector: 'pg-list-activity-example',
  imports: [Badge, Card, CardTitle, List, ListItemTemplate, Status],
  templateUrl: './activity.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListActivityExample {
  protected readonly activities: readonly Activity[] = [
    {
      title: 'Package published',
      description: 'Version 2.4.0 is available in the registry.',
      state: 'Complete',
      severity: 'success',
    },
    { title: 'Migration review', description: 'Two notes still need technical approval.', state: 'Pending', severity: 'warning' },
    {
      title: 'Preview environment',
      description: 'The temporary deployment expires tomorrow.',
      state: 'Preview',
      severity: 'neutral',
    },
  ];
}
