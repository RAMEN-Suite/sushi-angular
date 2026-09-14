import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { LucideColumns2, LucideEye, LucidePanelLeft } from '@lucide/angular';
import { Label, Menu, MenuEntry, MenuItem, MenuItemTemplate } from '@sushi-kit/angular';

type View = 'editor' | 'preview' | 'split';

type ViewItem = MenuItem<View>;

@Component({
  selector: 'pg-menu-active-example',
  imports: [Label, LucideColumns2, LucideEye, LucidePanelLeft, Menu, MenuItemTemplate],
  templateUrl: './active.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuActiveExample {
  protected readonly view: WritableSignal<View> = signal<View>('preview');

  protected readonly views: Signal<readonly MenuEntry<ViewItem>[]> = computed((): readonly MenuEntry<ViewItem>[] => [
    { label: 'Editor', value: 'editor', active: this.view() === 'editor' },
    { label: 'Split view', value: 'split', active: this.view() === 'split' },
    { label: 'Preview', value: 'preview', active: this.view() === 'preview' },
  ]);
}
