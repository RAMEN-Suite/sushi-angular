import {
  LucideGitPullRequest,
  LucideHouse,
  LucideLayers,
  LucideListChecks,
  LucideMessageCircle,
  LucideMousePointerClick,
  LucideNavigation,
  LucidePanelsTopLeft,
  LucideRows3,
  LucideTableProperties,
  LucideTextCursorInput,
  LucideWrench,
} from '@lucide/angular';
import type { LucideIcon } from '@lucide/angular';
import type { NavbarItem, SidebarGroup } from '@sushi-kit/angular';

export interface NavigationItem {
  readonly label: string;
  readonly path: string;
}

interface NavigationGroup {
  readonly dividerBefore?: boolean;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly items: readonly NavigationItem[];
}

const navigation: readonly NavigationGroup[] = [
  {
    dividerBefore: true,
    icon: LucideTextCursorInput,
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
    icon: LucideListChecks,
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
    icon: LucideRows3,
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
    icon: LucideMousePointerClick,
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
    icon: LucideNavigation,
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
      {
        label: 'Breadcrumb',
        path: '/breadcrumb',
      },
    ],
  },
  {
    icon: LucideLayers,
    label: 'Overlays',
    items: [
      {
        label: 'Dialog',
        path: '/dialog',
      },
      {
        label: 'Popover',
        path: '/popover',
      },
      {
        label: 'Tooltip',
        path: '/tooltip',
      },
      {
        label: 'Lightbox',
        path: '/lightbox',
      },
    ],
  },
  {
    icon: LucideMessageCircle,
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
        label: 'Skeleton',
        path: '/skeleton',
      },
      {
        label: 'Toast',
        path: '/toast',
      },
    ],
  },
  {
    icon: LucideTableProperties,
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
      {
        label: 'Gallery',
        path: '/gallery',
      },
    ],
  },
  {
    icon: LucidePanelsTopLeft,
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
    icon: LucideWrench,
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

export interface SidebarNavigationGroup extends SidebarGroup<NavbarItem<string>> {
  readonly icon: LucideIcon;
}

const overviewNavigation: readonly NavbarItem<string>[] = [{ label: 'Overview', value: '/', routerLink: '/' }];

const generalNavigation: readonly NavbarItem<string>[] = [
  ...overviewNavigation,
  { label: 'Getting started', value: '/getting-started', routerLink: '/getting-started' },
  { label: 'Styling & themes', value: '/styling-and-themes', routerLink: '/styling-and-themes' },
  { label: 'Theme tokens', value: '/theme-tokens', routerLink: '/theme-tokens' },
];

const contributorNavigation: readonly NavbarItem<string>[] = [
  { label: 'Contribution guide', value: '/contribute', routerLink: '/contribute' },
  { label: 'Component workflow', value: '/contribute/components', routerLink: '/contribute/components' },
  { label: 'Component styling', value: '/contribute/styles', routerLink: '/contribute/styles' },
  { label: 'Code standards', value: '/contribute/code', routerLink: '/contribute/code' },
  { label: 'Testing standards', value: '/contribute/testing', routerLink: '/contribute/testing' },
  { label: 'Responsible AI', value: '/contribute/ai', routerLink: '/contribute/ai' },
];

const navbarNavigation: readonly SidebarNavigationGroup[] = navigation.map((group: NavigationGroup): SidebarNavigationGroup => ({
  dividerBefore: group.dividerBefore,
  icon: group.icon,
  label: group.label,
  items: group.items.map((item: NavigationItem): NavbarItem<string> => ({
    label: item.label,
    value: item.path,
    routerLink: item.path,
  })),
}));

export const sidebarNavigation: readonly SidebarNavigationGroup[] = [
  { icon: LucideHouse, label: 'General', items: generalNavigation },
  { icon: LucideGitPullRequest, label: 'Contribute', items: contributorNavigation },
  ...navbarNavigation,
];
