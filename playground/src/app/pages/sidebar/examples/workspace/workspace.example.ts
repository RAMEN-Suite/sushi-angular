import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  LucideBell,
  LucideChartNoAxesCombined,
  LucideChevronRight,
  LucideCircleQuestionMark,
  LucideDynamicIcon,
  LucideFolderArchive,
  LucideFolderKanban,
  LucideFolders,
  LucideLayoutDashboard,
  LucideMenu,
  LucidePanelLeft,
  LucideSettings,
  LucideUsers,
} from '@lucide/angular';
import type { LucideIconData } from '@lucide/angular';
import {
  Badge,
  Button,
  Card,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  Navbar,
  NavbarAction,
  NavbarBrand,
  NavbarItem,
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarItemTemplate,
} from '@sushi-kit/angular';

type WorkspacePage =
  'Overview' | 'Projects' | 'All projects' | 'Archived projects' | 'Analytics' | 'Team' | 'Notifications' | 'Settings' | 'Help';

interface WorkspaceItem extends NavbarItem<WorkspacePage> {
  readonly icon: LucideIconData;
  readonly badge?: string;
}

@Component({
  selector: 'pg-sidebar-workspace-example',
  imports: [
    Badge,
    Button,
    Card,
    Drawer,
    DrawerContent,
    DrawerTrigger,
    LucideChevronRight,
    LucideDynamicIcon,
    LucideMenu,
    LucidePanelLeft,
    LucideSettings,
    Navbar,
    NavbarAction,
    NavbarBrand,
    Sidebar,
    SidebarFooter,
    SidebarItemTemplate,
  ],
  templateUrl: './workspace.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarWorkspaceExample {
  protected readonly activePage: WritableSignal<WorkspacePage> = signal<WorkspacePage>('Overview');
  protected readonly sidebarCollapsed: WritableSignal<boolean> = signal(false);
  protected readonly groups: readonly SidebarGroup<WorkspaceItem>[] = [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', value: 'Overview', icon: LucideLayoutDashboard.icon },
        {
          label: 'Projects',
          value: 'Projects',
          icon: LucideFolderKanban.icon,
          badge: '8',
          items: [
            { label: 'All projects', value: 'All projects', icon: LucideFolders.icon },
            { label: 'Archived', value: 'Archived projects', icon: LucideFolderArchive.icon },
          ],
        },
        { label: 'Analytics', value: 'Analytics', icon: LucideChartNoAxesCombined.icon },
        { label: 'Team', value: 'Team', icon: LucideUsers.icon },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Notifications', value: 'Notifications', icon: LucideBell.icon, badge: '3' },
        { label: 'Settings', value: 'Settings', icon: LucideSettings.icon },
        { label: 'Help', value: 'Help', icon: LucideCircleQuestionMark.icon },
      ],
    },
  ];
}
