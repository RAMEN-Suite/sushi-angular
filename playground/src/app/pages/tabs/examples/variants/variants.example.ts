import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Tab, Tabs, TabsValue, TabsVariant } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-tabs-variants-example',
  imports: [Tab, Tabs],
  templateUrl: './variants.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsVariantsExample {
  protected readonly tab: WritableSignal<TabsValue> = signal<TabsValue>('menu');
  protected readonly variants: readonly TabsVariant[] = ['plain', 'border', 'lift', 'box'];
}
