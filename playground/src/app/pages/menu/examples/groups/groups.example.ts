import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  Avatar,
  Badge,
  Divider,
  Menu,
  MenuEndTemplate,
  MenuEntry,
  MenuGroupTemplate,
  MenuItem,
  MenuItemTemplate,
  MenuStartTemplate,
  MenuValue,
} from '@ramen-suite/sushi';

type WorkspaceAction = 'profile' | 'settings' | 'help' | 'sign-out';

interface WorkspaceItem extends MenuItem<WorkspaceAction> {
  readonly detail: string;
  readonly status?: string;
}

@Component({
  selector: 'pg-menu-groups-example',
  imports: [Avatar, Badge, Divider, Menu, MenuEndTemplate, MenuGroupTemplate, MenuItemTemplate, MenuStartTemplate],
  templateUrl: './groups.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuGroupsExample {
  protected readonly items: readonly MenuEntry<WorkspaceItem>[] = [
    {
      type: 'group',
      label: 'Workspace',
      items: [
        { label: 'Profile', value: 'profile', detail: 'Personal details and preferences', status: 'Current', active: true },
        { label: 'Settings', value: 'settings', detail: 'Workspace defaults and integrations' },
      ],
    },
    {
      type: 'group',
      label: 'Support',
      items: [
        { label: 'Help center', value: 'help', detail: 'Guides and support resources' },
        { label: 'Sign out', value: 'sign-out', detail: 'End the current session' },
      ],
    },
  ];
  protected readonly lastAction: WritableSignal<MenuValue | null> = signal<MenuValue | null>(null);
}
