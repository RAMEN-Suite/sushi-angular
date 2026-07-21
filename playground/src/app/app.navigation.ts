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
        label: 'Toggle Button',
        path: '/toggle-button',
      },
    ],
  },
  {
    label: 'Data Display',
    items: [
      {
        label: 'Badge',
        path: '/badge',
      },
      {
        label: 'Icons',
        path: '/icon',
      },
      {
        label: 'Spinner',
        path: '/spinner',
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
