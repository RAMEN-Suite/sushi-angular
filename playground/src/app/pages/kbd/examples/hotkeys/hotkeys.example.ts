import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCommand } from '@lucide/angular';
import { Card, CardTitle, Divider, Kbd } from '@ramen-suite/sushi';

interface Shortcut {
  readonly keys: readonly string[];
  readonly label: string;
}

@Component({
  selector: 'pg-kbd-hotkeys-example',
  imports: [Card, CardTitle, Divider, Kbd, LucideCommand],
  templateUrl: './hotkeys.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdHotkeysExample {
  protected readonly shortcuts: readonly Shortcut[] = [
    { label: 'Search', keys: ['⌘', 'K'] },
    { label: 'Create project', keys: ['⌘', 'N'] },
    { label: 'Open settings', keys: ['⌘', ','] },
    { label: 'Close dialog', keys: ['Esc'] },
  ];
}
