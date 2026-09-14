import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardTitle, List, ListItemTemplate, Spinner, SpinnerType } from '@sushi-kit/angular';

interface Activity {
  readonly label: string;
  readonly spinner: SpinnerType;
}

@Component({
  selector: 'pg-spinner-contexts-example',
  imports: [Button, Card, CardTitle, List, ListItemTemplate, Spinner],
  templateUrl: './contexts.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerContextsExample {
  protected readonly activities: readonly Activity[] = [
    { label: 'Synchronizing events', spinner: 'dots' },
    { label: 'Indexing documents', spinner: 'bars' },
  ];
}
