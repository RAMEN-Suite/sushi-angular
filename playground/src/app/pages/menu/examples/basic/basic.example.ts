import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import { Label, Menu, type MenuEntry, type MenuValue } from '@sushi-kit/angular';

@Component({
  selector: 'pg-menu-basic-example',
  imports: [Label, Menu],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBasicExample {
  protected readonly items: readonly MenuEntry[] = [
    { label: 'Rename document', value: 'rename' },
    { label: 'Duplicate document', value: 'duplicate' },
    { type: 'separator' },
    { label: 'Move to archive', value: 'archive' },
  ];
  protected readonly lastAction: WritableSignal<MenuValue | null> = signal<MenuValue | null>(null);
}
