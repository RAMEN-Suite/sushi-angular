import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Tab, Tabs, TabsValue } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-tabs-behavior-example',
  imports: [Tab, Tabs],
  templateUrl: './behavior.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsBehaviorExample {
  protected readonly tab: WritableSignal<TabsValue> = signal<TabsValue>('general');
}
