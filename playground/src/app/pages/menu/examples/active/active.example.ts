import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal, signal, Type, WritableSignal } from '@angular/core';
import { LucideColumns2, LucideEye, LucidePanelLeft } from '@lucide/angular';
import { Label, Menu, MenuEntry, MenuItem, MenuItemTemplate } from '@ramen-suite/sushi';

type View = 'editor' | 'preview' | 'split';

interface ViewItem extends MenuItem<View> {
  readonly icon: Type<unknown>;
}

@Component({
  selector: 'pg-menu-active-example',
  imports: [Label, Menu, MenuItemTemplate, NgComponentOutlet],
  templateUrl: './active.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuActiveExample {
  protected readonly iconInputs: Readonly<Record<string, unknown>> = { size: 18 };
  protected readonly view: WritableSignal<View> = signal<View>('preview');

  protected readonly views: Signal<readonly MenuEntry<ViewItem>[]> = computed((): readonly MenuEntry<ViewItem>[] => [
    { label: 'Editor', value: 'editor', icon: LucidePanelLeft, active: this.view() === 'editor' },
    { label: 'Split view', value: 'split', icon: LucideColumns2, active: this.view() === 'split' },
    { label: 'Preview', value: 'preview', icon: LucideEye, active: this.view() === 'preview' },
  ]);
}
