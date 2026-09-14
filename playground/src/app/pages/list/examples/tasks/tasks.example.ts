import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, Checkbox, List, ListItemTemplate, ThemeSeverity } from '@sushi-kit/angular';

interface Task {
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly severity: ThemeSeverity;
  readonly completed: boolean;
}

@Component({
  selector: 'pg-list-tasks-example',
  imports: [Badge, Card, Checkbox, List, ListItemTemplate],
  templateUrl: './tasks.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTasksExample {
  protected readonly tasks: readonly Task[] = [
    {
      title: 'Accessibility review',
      description: 'Keyboard, focus, and screen-reader checks',
      status: 'Done',
      severity: 'success',
      completed: true,
    },
    {
      title: 'Bundle analysis',
      description: 'Review entry points and dependency changes',
      status: 'Today',
      severity: 'warning',
      completed: false,
    },
    {
      title: 'Release notes',
      description: 'Document migrations and public API changes',
      status: 'Queued',
      severity: 'neutral',
      completed: false,
    },
  ];
}
