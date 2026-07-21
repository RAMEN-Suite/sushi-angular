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
    label: 'Actions',
    items: [
      {
        label: 'Button',
        path: '/button',
      },
    ],
  },
  {
    label: 'Form',
    items: [
      {
        label: 'Auto Focus',
        path: '/auto-focus',
      },
      {
        label: 'Toggle Button',
        path: '/toggle-button',
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
        label: 'Icons',
        path: '/icon',
      },
      {
        label: 'Indicator',
        path: '/indicator',
      },
      {
        label: 'Keyboard Key',
        path: '/kbd',
      },
      {
        label: 'Message',
        path: '/message',
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
    label: 'Layout',
    items: [
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
    label: 'Mockup',
    items: [
      {
        label: 'Code',
        path: '/code',
      },
    ],
  },
];
