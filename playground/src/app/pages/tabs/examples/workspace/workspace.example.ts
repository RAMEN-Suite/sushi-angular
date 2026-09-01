import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  Badge,
  Button,
  Card,
  CardTitle,
  List,
  ListItemTemplate,
  Progress,
  Status,
  StatusSeverity,
  Tab,
  Tabs,
  TabsValue,
  ThemeSeverity,
} from '@ramen-suite/sushi';

interface Activity {
  readonly label: string;
  readonly severity: StatusSeverity;
}

interface Check {
  readonly label: string;
  readonly state: string;
  readonly severity: ThemeSeverity;
}

@Component({
  selector: 'pg-tabs-workspace-example',
  imports: [Badge, Button, Card, CardTitle, List, ListItemTemplate, Progress, Status, Tab, Tabs],
  templateUrl: './workspace.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsWorkspaceExample {
  protected readonly tab: WritableSignal<TabsValue> = signal<TabsValue>('overview');
  protected readonly activities: readonly Activity[] = [
    { label: 'Build completed successfully', severity: 'success' },
    { label: 'Documentation preview published', severity: 'info' },
    { label: 'Two approvals still required', severity: 'warning' },
  ];
  protected readonly checks: readonly Check[] = [
    { label: 'Accessibility', state: 'Passed', severity: 'success' },
    { label: 'Bundle budget', state: 'Review', severity: 'warning' },
  ];
}
