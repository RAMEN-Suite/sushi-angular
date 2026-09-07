import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideMenu, LucideX } from '@lucide/angular';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  Navbar,
  NavbarAction,
  NavbarBrand,
  NavbarItem,
  Sidebar,
  SidebarGroup,
  SidebarHeader,
} from '@ramen-suite/sushi';

type Page = 'Overview' | 'Projects' | 'Team';

@Component({
  selector: 'pg-sidebar-drawer-example',
  imports: [
    Button,
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
    LucideMenu,
    LucideX,
    Navbar,
    NavbarAction,
    NavbarBrand,
    Sidebar,
    SidebarHeader,
  ],
  templateUrl: './drawer.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarDrawerExample {
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
  ];
}
