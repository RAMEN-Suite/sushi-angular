import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  LucideBell,
  LucideChartNoAxesCombined,
  LucideChevronRight,
  LucideCircleQuestionMark,
  LucideFolderKanban,
  LucideLayoutDashboard,
  LucideSettings,
  LucideSparkles,
  LucideUsers,
} from '@lucide/angular';
import {
  Badge,
  Button,
  NavbarItem,
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItemTemplate,
} from '@ramen-suite/sushi';

type WorkspacePage = 'Overview' | 'Projects' | 'Analytics' | 'Team' | 'Notifications' | 'Settings' | 'Help';

interface WorkspaceItem extends NavbarItem<WorkspacePage> {
  readonly badge?: string;
}

@Component({
  selector: 'pg-sidebar-workspace-example',
  imports: [
    Badge,
    Button,
    LucideBell,
    LucideChartNoAxesCombined,
    LucideChevronRight,
    LucideCircleQuestionMark,
    LucideFolderKanban,
    LucideLayoutDashboard,
    LucideSettings,
    LucideSparkles,
    LucideUsers,
    Sidebar,
    SidebarFooter,
    SidebarHeader,
    SidebarItemTemplate,
  ],
  templateUrl: './workspace.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarWorkspaceExample {
  protected readonly activePage: WritableSignal<WorkspacePage> = signal<WorkspacePage>('Overview');
  protected readonly groups: readonly SidebarGroup<WorkspaceItem>[] = [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', value: 'Overview' },
        { label: 'Projects', value: 'Projects', badge: '8' },
        { label: 'Analytics', value: 'Analytics' },
        { label: 'Team', value: 'Team' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Notifications', value: 'Notifications', badge: '3' },
        { label: 'Settings', value: 'Settings' },
        { label: 'Help', value: 'Help' },
      ],
    },
  ];
}
