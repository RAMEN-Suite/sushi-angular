import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Badge, Button, Progress, Status, Tab, Tabs, TabsValue } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-tabs-workspace-example',
  imports: [Badge, Button, Progress, Status, Tab, Tabs],
  templateUrl: './workspace.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsWorkspaceExample {
  protected readonly tab: WritableSignal<TabsValue> = signal<TabsValue>('overview');
}
