import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { ContextMenuTrigger, Kbd, Menu, MenuEntry, MenuValue } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-menu-context-example',
  imports: [ContextMenuTrigger, Kbd, Menu],
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
