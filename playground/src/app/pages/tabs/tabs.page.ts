import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Card, CardTitle, Code, CodeLine, Tab, Tabs, TabsSize, TabsValue, TabsVariant } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-tabs-page',
  imports: [Card, CardTitle, Code, CodeLine, Tab, Tabs],
  templateUrl: './tabs.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPage {
  protected readonly variants: readonly TabsVariant[] = ['plain', 'border', 'lift', 'box'];
  protected readonly sizes: readonly TabsSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  protected readonly previewTab: WritableSignal<TabsValue> = signal<TabsValue>('preview');
  protected readonly accountTab: WritableSignal<TabsValue> = signal<TabsValue>('profile');
  protected readonly verticalTab: WritableSignal<TabsValue> = signal<TabsValue>('general');
}
