import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Card, ContextMenuTrigger, Kbd, Menu, MenuEntry, MenuValue } from '@sushi-kit/angular';

@Component({
  selector: 'pg-menu-context-example',
  imports: [Card, ContextMenuTrigger, Kbd, Menu],
  templateUrl: './context.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuContextExample {
  protected readonly actions: readonly MenuEntry[] = [
    { label: 'Rename draft', value: 'rename' },
    { label: 'Duplicate draft', value: 'duplicate' },
    { type: 'separator' },
    { label: 'Move to archive', value: 'archive' },
  ];
  protected readonly lastAction: WritableSignal<MenuValue | null> = signal<MenuValue | null>(null);
}
