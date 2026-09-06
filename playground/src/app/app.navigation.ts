export interface NavigationItem {
  readonly label: string;
  readonly path: string;
}

export interface NavigationGroup {
  readonly label: string;
  readonly items: readonly NavigationItem[];
}

export const navigation: NavigationGroup[] = [
  {
    label: 'Input',
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
    label: 'Form Layout',
    items: [
      {
        label: 'Auto Focus',
        path: '/auto-focus',
      },
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
    label: 'Application Navigation',
    items: [
      {
        label: 'Navbar',
        path: '/navbar',
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
        label: 'Icons',
        path: '/icon',
      },
      {
        label: 'Keyboard Key',
        path: '/kbd',
      },
      {
        label: 'List',
        path: '/list',
      },
      {
        label: 'Pagination',
        path: '/pagination',
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
      {
        label: 'Tabs',
        path: '/tabs',
      },
    ],
  },
  {
    label: 'Developer',
    items: [
      {
        label: 'Code',
        path: '/code',
      },
    ],
  },
];

export const apiNavigation: readonly NavigationItem[] = navigation
  .flatMap((group: NavigationGroup): readonly NavigationItem[] => group.items)
  .filter((item: NavigationItem): boolean => item.path !== '/icon');
