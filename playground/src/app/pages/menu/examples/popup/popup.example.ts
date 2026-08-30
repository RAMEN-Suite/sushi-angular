import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';
import { Button, Join, JoinItem, Menu, MenuEntry, MenuTrigger, MenuValue } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-menu-popup-example',
  imports: [Button, Join, JoinItem, LucideChevronDown, Menu, MenuTrigger],
  templateUrl: './popup.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPopupExample {
  protected readonly actions: readonly MenuEntry[] = [
    { label: 'Mark as unread', value: 'unread' },
    { label: 'Rename message', value: 'rename' },
    { type: 'separator' },
    { label: 'Delete message', value: 'delete' },
  ];
  protected readonly lastAction: WritableSignal<MenuValue | null> = signal<MenuValue | null>(null);
}
