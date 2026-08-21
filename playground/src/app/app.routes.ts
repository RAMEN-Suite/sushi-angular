import type { Route, Routes } from '@angular/router';
import { apiNavigation } from './app.navigation';
import type { NavigationItem } from './app.navigation';

const apiRoutes: Routes = apiNavigation.map((item: NavigationItem): Route => ({
  path: `${item.path.slice(1)}/api`,
  loadComponent: () => import('./pages/api/api.page').then(({ ApiPage }) => ApiPage),
  title: `${item.label} API | SUSHI Playground`,
  data: { component: item.path.slice(1), name: item.label },
}));

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/overview/overview.page').then(({ OverviewPage }) => OverviewPage),
    title: 'SUSHI Playground',
  },
  {
    path: 'accordion',
    loadComponent: () => import('./pages/accordion/accordion.page').then(({ AccordionPage }) => AccordionPage),
    title: 'Accordion | SUSHI Playground',
  },
  {
    path: 'auto-focus',
    loadComponent: () => import('./pages/auto-focus/auto-focus.page').then(({ AutoFocusPage }) => AutoFocusPage),
    title: 'Auto Focus | SUSHI Playground',
  },
  {
    path: 'autocomplete',
    loadComponent: () => import('./pages/autocomplete/autocomplete.page').then(({ AutocompletePage }) => AutocompletePage),
    title: 'Autocomplete | SUSHI Playground',
  },
  {
    path: 'color-picker',
    loadComponent: () => import('./pages/color-picker/color-picker.page').then(({ ColorPickerPage }) => ColorPickerPage),
    title: 'Color Picker | SUSHI Playground',
  },
  {
    path: 'checkbox',
    loadComponent: () => import('./pages/checkbox/checkbox.page').then(({ CheckboxPage }) => CheckboxPage),
    title: 'Checkbox | SUSHI Playground',
  },
  {
    path: 'chip',
    loadComponent: () => import('./pages/chip/chip.page').then(({ ChipPage }) => ChipPage),
    title: 'Chip | SUSHI Playground',
  },
  {
    path: 'fieldset',
    loadComponent: () => import('./pages/fieldset/fieldset.page').then(({ FieldsetPage }) => FieldsetPage),
    title: 'Fieldset | SUSHI Playground',
  },
  {
    path: 'file-input',
    loadComponent: () => import('./pages/file-input/file-input.page').then(({ FileInputPage }) => FileInputPage),
    title: 'File Input | SUSHI Playground',
  },
  {
    path: 'file-drop',
    loadComponent: () => import('./pages/file-drop/file-drop.page').then(({ FileDropPage }) => FileDropPage),
    title: 'File Drop | SUSHI Playground',
  },
  {
    path: 'input',
    loadComponent: () => import('./pages/input/input.page').then(({ InputPage }) => InputPage),
    title: 'Input | SUSHI Playground',
  },
  {
    path: 'label',
    loadComponent: () => import('./pages/label/label.page').then(({ LabelPage }) => LabelPage),
    title: 'Label | SUSHI Playground',
  },
  {
    path: 'input-number',
    loadComponent: () => import('./pages/input-number/input-number.page').then(({ InputNumberPage }) => InputNumberPage),
    title: 'Input Number | SUSHI Playground',
  },
  {
    path: 'input-otp',
    loadComponent: () => import('./pages/input-otp/input-otp.page').then(({ InputOtpPage }) => InputOtpPage),
    title: 'Input OTP | SUSHI Playground',
  },
  {
    path: 'input-surface',
    loadComponent: () => import('./pages/input-surface/input-surface.page').then(({ InputSurfacePage }) => InputSurfacePage),
    title: 'Input Surface | SUSHI Playground',
  },
  {
    path: 'input-group',
    loadComponent: () => import('./pages/input-group/input-group.page').then(({ InputGroupPage }) => InputGroupPage),
    title: 'Input Group | SUSHI Playground',
  },
  {
    path: 'join',
    loadComponent: () => import('./pages/join/join.page').then(({ JoinPage }) => JoinPage),
    title: 'Join | SUSHI Playground',
  },
  {
    path: 'multi-select',
    loadComponent: () => import('./pages/multi-select/multi-select.page').then(({ MultiSelectPage }) => MultiSelectPage),
    title: 'Multi-Select | SUSHI Playground',
  },
  {
    path: 'radio',
    loadComponent: () => import('./pages/radio/radio.page').then(({ RadioPage }) => RadioPage),
    title: 'Radio | SUSHI Playground',
  },
  {
    path: 'progress',
    loadComponent: () => import('./pages/progress/progress.page').then(({ ProgressPage }) => ProgressPage),
    title: 'Progress | SUSHI Playground',
  },
  {
    path: 'range',
    loadComponent: () => import('./pages/range/range.page').then(({ RangePage }) => RangePage),
    title: 'Range | SUSHI Playground',
  },
  {
    path: 'select-button',
    loadComponent: () => import('./pages/select-button/select-button.page').then(({ SelectButtonPage }) => SelectButtonPage),
    title: 'Select Button | SUSHI Playground',
  },
  {
    path: 'select',
    loadComponent: () => import('./pages/select/select.page').then(({ SelectPage }) => SelectPage),
    title: 'Select | SUSHI Playground',
  },
  {
    path: 'textarea',
    loadComponent: () => import('./pages/textarea/textarea.page').then(({ TextareaPage }) => TextareaPage),
    title: 'Textarea | SUSHI Playground',
  },
  {
    path: 'toggle',
    loadComponent: () => import('./pages/toggle/toggle.page').then(({ TogglePage }) => TogglePage),
    title: 'Toggle | SUSHI Playground',
  },
  {
    path: 'avatar',
    loadComponent: () => import('./pages/avatar/avatar.page').then(({ AvatarPage }) => AvatarPage),
    title: 'Avatar | SUSHI Playground',
  },
  {
    path: 'badge',
    loadComponent: () => import('./pages/badge/badge.page').then(({ BadgePage }) => BadgePage),
    title: 'Badge | SUSHI Playground',
  },
  {
    path: 'button',
    loadComponent: () => import('./pages/button/button.page').then(({ ButtonPage }) => ButtonPage),
    title: 'Button | SUSHI Playground',
  },
  {
    path: 'card',
    loadComponent: () => import('./pages/card/card.page').then(({ CardPage }) => CardPage),
    title: 'Card | SUSHI Playground',
  },
  {
    path: 'code',
    loadComponent: () => import('./pages/code/code.page').then(({ CodePage }) => CodePage),
    title: 'Code | SUSHI Playground',
  },
  {
    path: 'divider',
    loadComponent: () => import('./pages/divider/divider.page').then(({ DividerPage }) => DividerPage),
    title: 'Divider | SUSHI Playground',
  },
  {
    path: 'icon',
    loadComponent: () => import('./pages/icon/icon.page').then(({ IconPage }) => IconPage),
    title: 'Icons | SUSHI Playground',
  },
  {
    path: 'indicator',
    loadComponent: () => import('./pages/indicator/indicator.page').then(({ IndicatorPage }) => IndicatorPage),
    title: 'Indicator | SUSHI Playground',
  },
  {
    path: 'kbd',
    loadComponent: () => import('./pages/kbd/kbd.page').then(({ KbdPage }) => KbdPage),
    title: 'Keyboard Key | SUSHI Playground',
  },
  {
    path: 'message',
    loadComponent: () => import('./pages/message/message.page').then(({ MessagePage }) => MessagePage),
    title: 'Message | SUSHI Playground',
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/list/list.page').then(({ ListPage }) => ListPage),
    title: 'List | SUSHI Playground',
  },
  {
    path: 'listbox',
    loadComponent: () => import('./pages/listbox/listbox.page').then(({ ListboxPage }) => ListboxPage),
    title: 'Listbox | SUSHI Playground',
  },
  {
    path: 'order-list',
    loadComponent: () => import('./pages/order-list/order-list.page').then(({ OrderListPage }) => OrderListPage),
    title: 'Order List | SUSHI Playground',
  },
  {
    path: 'spinner',
    loadComponent: () => import('./pages/spinner/spinner.page').then(({ SpinnerPage }) => SpinnerPage),
    title: 'Spinner | SUSHI Playground',
  },
  {
    path: 'status',
    loadComponent: () => import('./pages/status/status.page').then(({ StatusPage }) => StatusPage),
    title: 'Status | SUSHI Playground',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(({ TabsPage }) => TabsPage),
    title: 'Tabs | SUSHI Playground',
  },
  {
    path: 'toggle-button',
    loadComponent: () => import('./pages/toggle-button/toggle-button.page').then(({ ToggleButtonPage }) => ToggleButtonPage),
    title: 'Toggle Button | SUSHI Playground',
  },
  ...apiRoutes,
  {
    path: '**',
    redirectTo: '',
  },
];
