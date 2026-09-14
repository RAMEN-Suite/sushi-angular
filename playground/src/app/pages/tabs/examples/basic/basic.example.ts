import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Tab, Tabs, TabsValue } from '@sushi-kit/angular';

@Component({
  selector: 'pg-tabs-basic-example',
  imports: [Tab, Tabs],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsBasicExample {
  protected readonly tab: WritableSignal<TabsValue> = signal<TabsValue>('profile');
}
