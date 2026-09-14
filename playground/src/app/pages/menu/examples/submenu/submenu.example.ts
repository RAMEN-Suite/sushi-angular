import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';
import { Button, Menu, MenuEntry, MenuTrigger, MenuValue } from '@sushi-kit/angular';

@Component({
  selector: 'pg-menu-submenu-example',
  imports: [Button, LucideChevronDown, Menu, MenuTrigger],
  templateUrl: './submenu.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSubmenuExample {
  protected readonly actions: readonly MenuEntry[] = [
    {
      label: 'Share',
      value: 'share',
      items: [
        { label: 'Copy link', value: 'copy-link' },
        { label: 'Send by email', value: 'send-email' },
      ],
    },
    {
      label: 'Export',
      value: 'export',
      items: [
        { label: 'PDF document', value: 'pdf' },
        {
          label: 'Image',
          value: 'image',
          items: [
            { label: 'PNG image', value: 'png' },
            { label: 'SVG image', value: 'svg' },
          ],
        },
      ],
    },
  ];

  protected readonly lastAction: WritableSignal<MenuValue | null> = signal<MenuValue | null>(null);
}
