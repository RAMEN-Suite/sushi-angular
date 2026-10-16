import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import { Tab, Tabs, type TabsValue } from '@sushi-kit/angular';

@Component({
  selector: 'pg-tabs-behavior-example',
  imports: [Tab, Tabs],
  templateUrl: './behavior.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsBehaviorExample {
  protected readonly tab: WritableSignal<TabsValue> = signal<TabsValue>('general');
}
