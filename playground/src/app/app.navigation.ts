import type { NavbarItem, SidebarGroup } from '@ramen-suite/sushi';

export interface NavigationItem {
  readonly label: string;
  readonly path: string;
}

export interface NavigationGroup {
  readonly label: string;
  readonly items: readonly NavigationItem[];
}

export const navigation: readonly NavigationGroup[] = [
  {
    label: 'Inputs',
    items: [
      {
        label: 'Color Picker',
        path: '/color-picker',
      },
      {
        label: 'File Drop',
        path: '/file-drop',
      },
      {
        label: 'File Input',
        path: '/file-input',
      },
      {
        label: 'Input',
        path: '/input',
      },
      {
        label: 'Input Number',
        path: '/input-number',
      },
      {
        label: 'Input OTP',
        path: '/input-otp',
      },
      {
        label: 'Range',
        path: '/range',
      },
      {
        label: 'Textarea',
        path: '/textarea',
      },
    ],
  },
  {
    label: 'Selection',
    items: [
      {
        label: 'Autocomplete',
        path: '/autocomplete',
      },
      {
        label: 'Checkbox',
        path: '/checkbox',
      },
      {
        label: 'Listbox',
        path: '/listbox',
      },
      {
        label: 'Multi-Select',
        path: '/multi-select',
      },
      {
        label: 'Order List',
        path: '/order-list',
      },
      {
        label: 'Radio',
        path: '/radio',
      },
      {
        label: 'Select',
        path: '/select',
      },
      {
        label: 'Select Button',
        path: '/select-button',
      },
      {
        label: 'Toggle',
        path: '/toggle',
      },
      {
        label: 'Toggle Button',
        path: '/toggle-button',
      },
    ],
  },
  {
    label: 'Form Structure',
    items: [
      {
        label: 'Fieldset',
        path: '/fieldset',
      },
      {
        label: 'Input Group',
        path: '/input-group',
      },
      {
        label: 'Input Surface',
        path: '/input-surface',
      },
      {
        label: 'Join',
        path: '/join',
      },
      {
        label: 'Label',
        path: '/label',
      },
    ],
  },
  {
    label: 'Actions',
    items: [
      {
        label: 'Button',
        path: '/button',
      },
      {
        label: 'Menu',
        path: '/menu',
      },
    ],
  },
  {
    label: 'Navigation',
    items: [
      {
        label: 'Navbar',
        path: '/navbar',
      },
      {
        label: 'Sidebar',
        path: '/sidebar',
      },
      {
        label: 'Drawer',
        path: '/drawer',
      },
      {
        label: 'Pagination',
        path: '/pagination',
      },
      {
        label: 'Tabs',
        path: '/tabs',
      },
    ],
  },
  {
    label: 'Overlays',
    items: [
      {
        label: 'Dialog',
        path: '/dialog',
      },
    ],
  },
  {
    label: 'Feedback',
    items: [
      {
        label: 'Indicator',
        path: '/indicator',
      },
      {
        label: 'Message',
        path: '/message',
      },
      {
        label: 'Progress',
        path: '/progress',
      },
      {
        label: 'Spinner',
        path: '/spinner',
      },
      {
        label: 'Status',
        path: '/status',
      },
      {
        label: 'Toast',
        path: '/toast',
      },
    ],
  },
  {
    label: 'Data Display',
    items: [
      {
        label: 'Avatar',
        path: '/avatar',
      },
      {
        label: 'Badge',
        path: '/badge',
      },
      {
        label: 'Chip',
        path: '/chip',
      },
      {
        label: 'Data View',
        path: '/data-view',
      },
      {
        label: 'List',
        path: '/list',
      },
      {
        label: 'Mask',
        path: '/mask',
      },
      {
        label: 'Table',
        path: '/table',
      },
    ],
  },
  {
    label: 'Layout',
    items: [
      {
        label: 'Accordion',
        path: '/accordion',
      },
      {
        label: 'Card',
        path: '/card',
      },
      {
        label: 'Divider',
        path: '/divider',
      },
    ],
  },
  {
    label: 'Utilities',
    items: [
      {
        label: 'Auto Focus',
        path: '/auto-focus',
      },
      {
        label: 'Code',
        path: '/code',
      },
      {
        label: 'Icons',
        path: '/icon',
      },
      {
        label: 'Keyboard Key',
        path: '/kbd',
      },
    ],
  },
];

export const apiNavigation: readonly NavigationItem[] = navigation
  .flatMap((group: NavigationGroup): readonly NavigationItem[] => group.items)
  .filter((item: NavigationItem): boolean => item.path !== '/icon');

export type SidebarNavigationGroup = SidebarGroup<NavbarItem<string>>;

export const overviewNavigation: readonly NavbarItem<string>[] = [{ label: 'Overview', value: '/', routerLink: '/' }];

export const navbarNavigation: readonly SidebarNavigationGroup[] = navigation.map(
  (group: NavigationGroup): SidebarNavigationGroup => ({
    label: group.label,
    items: group.items.map((item: NavigationItem): NavbarItem<string> => ({
      label: item.label,
      value: item.path,
      routerLink: item.path,
    })),
  }),
);

export const sidebarNavigation: readonly SidebarNavigationGroup[] = [
  { label: 'General', items: overviewNavigation },
  ...navbarNavigation,
];

export const mobileNavigation: readonly NavbarItem<string>[] = [
  ...overviewNavigation,
  ...navbarNavigation.map((group: SidebarNavigationGroup): NavbarItem<string> => ({
    label: group.label,
    value: `group:${group.label}`,
    items: group.items,
  })),
];
