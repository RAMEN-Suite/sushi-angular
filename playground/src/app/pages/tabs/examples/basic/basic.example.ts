import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import { Tab, Tabs, type TabsValue } from '@sushi-kit/angular';

@Component({
  selector: 'pg-tabs-basic-example',
  imports: [Tab, Tabs],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsBasicExample {
  protected readonly tab: WritableSignal<TabsValue> = signal<TabsValue>('profile');
}
