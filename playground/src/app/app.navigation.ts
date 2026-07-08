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
    label: 'Data Display',
    items: [
      {
        label: 'Icons',
        path: '/icon',
      },
      {
        label: 'Badge',
        path: '/badge',
      },
    ],
  },
  {
    label: 'Layout',
    items: [
      {
        label: 'Divider',
        path: '/divider',
      },
      {
        label: 'Card',
        path: '/card',
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
