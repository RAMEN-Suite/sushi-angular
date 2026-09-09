import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideMenu, LucideSoup, LucideX } from '@lucide/angular';
import { Button, Drawer, DrawerClose, DrawerTrigger, NavbarItem, Sidebar, SidebarGroup, SidebarHeader } from '@ramen-suite/sushi';

type Page = 'Overview' | 'Projects' | 'Team' | 'Settings';

@Component({
  selector: 'pg-drawer-navigation-example',
  imports: [Button, Drawer, DrawerClose, DrawerTrigger, LucideMenu, LucideSoup, LucideX, Sidebar, SidebarHeader],
  templateUrl: './navigation.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerNavigationExample {
  protected readonly activePage: WritableSignal<Page> = signal<Page>('Overview');
  protected readonly groups: readonly SidebarGroup<NavbarItem<Page>>[] = [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', value: 'Overview' },
        { label: 'Projects', value: 'Projects' },
        { label: 'Team', value: 'Team' },
      ],
    },
    { label: 'Account', items: [{ label: 'Settings', value: 'Settings' }] },
  ];
}
