import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideBell, LucidePlus, LucideSearch, LucideZap } from '@lucide/angular';
import { Badge, Button, NavbarAction, NavbarBrand, NavbarComponent, NavbarItem, NavbarItemTemplate } from '@ramen-suite/sushi';

type ConsolePage = 'Workspace' | 'Tasks' | 'Runs' | 'Settings';

interface ConsoleItem extends NavbarItem<ConsolePage> {
  readonly badge?: string;
}

@Component({
  selector: 'pg-navbar-custom-example',
  imports: [
    Badge,
    Button,
    LucideBell,
    LucidePlus,
    LucideSearch,
    LucideZap,
    NavbarAction,
    NavbarBrand,
    NavbarComponent,
    NavbarItemTemplate,
  ],
  templateUrl: './custom.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarCustomExample {
  protected readonly activePage: WritableSignal<ConsolePage> = signal<ConsolePage>('Workspace');
  protected readonly items: readonly ConsoleItem[] = [
    { label: 'Workspace', value: 'Workspace' },
    { label: 'Tasks', value: 'Tasks', badge: '12' },
    { label: 'Runs', value: 'Runs', badge: 'Live' },
    { label: 'Settings', value: 'Settings' },
  ];
}
