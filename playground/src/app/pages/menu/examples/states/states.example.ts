import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Label, Menu, MenuEntry } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-menu-states-example',
  imports: [Label, Menu],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuStatesExample {
  protected readonly items: readonly MenuEntry[] = [
    { label: 'Duplicate', value: 'duplicate' },
    { label: 'Move to archive', value: 'archive' },
    { label: 'Restore previous version', value: 'restore', disabled: true },
  ];
}
