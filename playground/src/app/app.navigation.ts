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
    label: 'Components',
    items: [
      {
        label: 'Button',
        path: '/button',
      },
      {
        label: 'Badge',
        path: '/badge',
      },
      {
        label: 'Divider',
        path: '/divider',
      },
    ],
  },
];
