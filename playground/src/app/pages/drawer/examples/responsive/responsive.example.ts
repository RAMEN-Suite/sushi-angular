import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideMenu, LucidePanelLeftClose, LucidePanelsTopLeft, LucidePlus } from '@lucide/angular';
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
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@ramen-suite/sushi';

type WorkspacePage = 'Projects' | 'Activity' | 'Team';

@Component({
  selector: 'pg-drawer-responsive-example',
  imports: [
    Button,
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
    LucideMenu,
    LucidePanelLeftClose,
    LucidePanelsTopLeft,
    LucidePlus,
    Navbar,
    NavbarAction,
    NavbarBrand,
    Sidebar,
    SidebarFooter,
    SidebarHeader,
  ],
  templateUrl: './responsive.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerResponsiveExample {
  protected readonly activePage: WritableSignal<WorkspacePage> = signal<WorkspacePage>('Projects');
  protected readonly groups: readonly SidebarGroup<NavbarItem<WorkspacePage>>[] = [
    {
      label: 'Workspace',
      items: [
        { label: 'Projects', value: 'Projects' },
        { label: 'Activity', value: 'Activity' },
        { label: 'Team', value: 'Team' },
      ],
    },
  ];
}
