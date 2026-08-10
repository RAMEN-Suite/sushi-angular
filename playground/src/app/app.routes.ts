import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./view/overview/overview.page').then(({ OverviewPage }) => OverviewPage),
    title: 'SUSHI Playground',
  },
  {
    path: 'auto-focus',
    loadComponent: () => import('./view/form/auto-focus/auto-focus.page').then(({ AutoFocusPage }) => AutoFocusPage),
    title: 'Auto Focus | SUSHI Playground',
  },
  {
    path: 'autocomplete',
    loadComponent: () => import('./view/autocomplete/autocomplete.page').then(({ AutocompletePage }) => AutocompletePage),
    title: 'Autocomplete | SUSHI Playground',
  },
  {
    path: 'color-picker',
    loadComponent: () => import('./view/color-picker/color-picker.page').then(({ ColorPickerPage }) => ColorPickerPage),
    title: 'Color Picker | SUSHI Playground',
  },
  {
    path: 'checkbox',
    loadComponent: () => import('./view/checkbox/checkbox.page').then(({ CheckboxPage }) => CheckboxPage),
    title: 'Checkbox | SUSHI Playground',
  },
  {
    path: 'fieldset',
    loadComponent: () => import('./view/form/fieldset/fieldset.page').then(({ FieldsetPage }) => FieldsetPage),
    title: 'Fieldset | SUSHI Playground',
  },
  {
    path: 'file-input',
    loadComponent: () => import('./view/file-input/file-input.page').then(({ FileInputPage }) => FileInputPage),
    title: 'File Input | SUSHI Playground',
  },
  {
    path: 'file-drop',
    loadComponent: () => import('./view/file-drop/file-drop.page').then(({ FileDropPage }) => FileDropPage),
    title: 'File Drop | SUSHI Playground',
  },
  {
    path: 'form-field',
    loadComponent: () => import('./view/form/form-field/form-field.page').then(({ FormFieldPage }) => FormFieldPage),
    title: 'Form Field | SUSHI Playground',
  },
  {
    path: 'input',
    loadComponent: () => import('./view/input/input.page').then(({ InputPage }) => InputPage),
    title: 'Input | SUSHI Playground',
  },
  {
    path: 'input-number',
    loadComponent: () => import('./view/input-number/input-number.page').then(({ InputNumberPage }) => InputNumberPage),
    title: 'Input Number | SUSHI Playground',
  },
  {
    path: 'input-otp',
    loadComponent: () => import('./view/input-otp/input-otp.page').then(({ InputOtpPage }) => InputOtpPage),
    title: 'Input OTP | SUSHI Playground',
  },
  {
    path: 'input-wrapper',
    loadComponent: () => import('./view/form/input-wrapper/input-wrapper.page').then(({ InputWrapperPage }) => InputWrapperPage),
    title: 'Input Wrapper | SUSHI Playground',
  },
  {
    path: 'input-group',
    loadComponent: () => import('./view/form/input-group/input-group.page').then(({ InputGroupPage }) => InputGroupPage),
    title: 'Input Group | SUSHI Playground',
  },
  {
    path: 'join',
    loadComponent: () => import('./view/form/join/join.page').then(({ JoinPage }) => JoinPage),
    title: 'Join | SUSHI Playground',
  },
  {
    path: 'multi-select',
    loadComponent: () => import('./view/multi-select/multi-select.page').then(({ MultiSelectPage }) => MultiSelectPage),
    title: 'Multi-Select | SUSHI Playground',
  },
  {
    path: 'radio',
    loadComponent: () => import('./view/radio/radio.page').then(({ RadioPage }) => RadioPage),
    title: 'Radio | SUSHI Playground',
  },
  {
    path: 'range',
    loadComponent: () => import('./view/range/range.page').then(({ RangePage }) => RangePage),
    title: 'Range | SUSHI Playground',
  },
  {
    path: 'select-button',
    loadComponent: () => import('./view/select-button/select-button.page').then(({ SelectButtonPage }) => SelectButtonPage),
    title: 'Select Button | SUSHI Playground',
  },
  {
    path: 'select',
    loadComponent: () => import('./view/select/select.page').then(({ SelectPage }) => SelectPage),
    title: 'Select | SUSHI Playground',
  },
  {
    path: 'textarea',
    loadComponent: () => import('./view/textarea/textarea.page').then(({ TextareaPage }) => TextareaPage),
    title: 'Textarea | SUSHI Playground',
  },
  {
    path: 'toggle',
    loadComponent: () => import('./view/toggle/toggle.page').then(({ TogglePage }) => TogglePage),
    title: 'Toggle | SUSHI Playground',
  },
  {
    path: 'avatar',
    loadComponent: () => import('./view/display/avatar/avatar.page').then(({ AvatarPage }) => AvatarPage),
    title: 'Avatar | SUSHI Playground',
  },
  {
    path: 'badge',
    loadComponent: () => import('./view/display/badge/badge.page').then(({ BadgePage }) => BadgePage),
    title: 'Badge | SUSHI Playground',
  },
  {
    path: 'button',
    loadComponent: () => import('./view/actions/button/button.page').then(({ ButtonPage }) => ButtonPage),
    title: 'Button | SUSHI Playground',
  },
  {
    path: 'card',
    loadComponent: () => import('./view/layout/card/card.page').then(({ CardPage }) => CardPage),
    title: 'Card | SUSHI Playground',
  },
  {
    path: 'code',
    loadComponent: () => import('./view/code/code.page').then(({ CodePage }) => CodePage),
    title: 'Code | SUSHI Playground',
  },
  {
    path: 'divider',
    loadComponent: () => import('./view/layout/divider/divider.page').then(({ DividerPage }) => DividerPage),
    title: 'Divider | SUSHI Playground',
  },
  {
    path: 'icon',
    loadComponent: () => import('./view/display/icon/icon.page').then(({ IconPage }) => IconPage),
    title: 'Icons | SUSHI Playground',
  },
  {
    path: 'indicator',
    loadComponent: () => import('./view/display/indicator/indicator.page').then(({ IndicatorPage }) => IndicatorPage),
    title: 'Indicator | SUSHI Playground',
  },
  {
    path: 'kbd',
    loadComponent: () => import('./view/display/kbd/kbd.page').then(({ KbdPage }) => KbdPage),
    title: 'Keyboard Key | SUSHI Playground',
  },
  {
    path: 'message',
    loadComponent: () => import('./view/display/message/message.page').then(({ MessagePage }) => MessagePage),
    title: 'Message | SUSHI Playground',
  },
  {
    path: 'spinner',
    loadComponent: () => import('./view/display/spinner/spinner.page').then(({ SpinnerPage }) => SpinnerPage),
    title: 'Spinner | SUSHI Playground',
  },
  {
    path: 'status',
    loadComponent: () => import('./view/display/status/status.page').then(({ StatusPage }) => StatusPage),
    title: 'Status | SUSHI Playground',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./view/layout/tabs/tabs.page').then(({ TabsPage }) => TabsPage),
    title: 'Tabs | SUSHI Playground',
  },
  {
    path: 'toggle-button',
    loadComponent: () => import('./view/toggle-button/toggle-button.page').then(({ ToggleButtonPage }) => ToggleButtonPage),
    title: 'Toggle Button | SUSHI Playground',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
