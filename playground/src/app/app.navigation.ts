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
        label: 'Input',
        path: '/input',
      },
      {
        label: 'Textarea',
        path: '/textarea',
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
        label: 'File Input',
        path: '/file-input',
      },
      {
        label: 'File Drop',
        path: '/file-drop',
      },
      {
        label: 'Color Picker',
        path: '/color-picker',
      },
      {
        label: 'Range',
        path: '/range',
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
        label: 'Select',
        path: '/select',
      },
      {
        label: 'Multi-Select',
        path: '/multi-select',
      },
      {
        label: 'Select Button',
        path: '/select-button',
      },
      {
        label: 'Checkbox',
        path: '/checkbox',
      },
      {
        label: 'Radio',
        path: '/radio',
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
        label: 'Form Field',
        path: '/form-field',
      },
      {
        label: 'Fieldset',
        path: '/fieldset',
      },
      {
        label: 'Input Wrapper',
        path: '/input-wrapper',
      },
      {
        label: 'Input Group',
        path: '/input-group',
      },
      {
        label: 'Join',
        path: '/join',
      },
      {
        label: 'Auto Focus',
        path: '/auto-focus',
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
    ],
  },
  {
    label: 'Feedback',
    items: [
      {
        label: 'Message',
        path: '/message',
      },
      {
        label: 'Status',
        path: '/status',
      },
      {
        label: 'Spinner',
        path: '/spinner',
      },
      {
        label: 'Indicator',
        path: '/indicator',
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
        label: 'Keyboard Key',
        path: '/kbd',
      },
      {
        label: 'Icons',
        path: '/icon',
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
