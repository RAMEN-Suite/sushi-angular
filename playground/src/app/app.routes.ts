import type { Route, Routes } from '@angular/router';
import { apiNavigation } from './app.navigation';
import type { NavigationItem } from './app.navigation';

const apiRoutes: Routes = apiNavigation.map((item: NavigationItem): Route => ({
  path: `${item.path.slice(1)}/api`,
  loadComponent: () => import('./pages/api/api.page').then(({ ApiPage }) => ApiPage),
  title: `${item.label} Interface | Sushi Playground`,
  data: { component: item.path.slice(1), name: item.label },
}));

const stylingRoutes: Routes = apiNavigation.map((item: NavigationItem): Route => ({
  path: `${item.path.slice(1)}/styling`,
  loadComponent: () => import('./pages/styling/styling.page').then(({ StylingPage }) => StylingPage),
  title: `${item.label} Theming | Sushi Playground`,
  data: { component: item.path.slice(1), name: item.label },
}));

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/overview/overview.page').then(({ OverviewPage }) => OverviewPage),
    title: 'Sushi Playground',
  },
  {
    path: 'getting-started',
    loadComponent: () => import('./pages/contributor/contributor.page').then(({ ContributorPage }) => ContributorPage),
    title: 'Getting started | Sushi Playground',
    data: {
      title: 'Getting started',
      description: 'Install Sushi, load its styles, and render your first component.',
      source: '/repository-docs/getting-started.md',
    },
  },
  {
    path: 'styling-and-themes',
    loadComponent: () => import('./pages/contributor/contributor.page').then(({ ContributorPage }) => ContributorPage),
    title: 'Styling and themes | Sushi Playground',
    data: {
      title: 'Styling and themes',
      description: 'Use theme values, component tokens, and Tailwind utilities without coupling component logic to styling.',
      source: '/repository-docs/styling-and-themes.md',
      themeTokens: true,
    },
  },
  {
    path: 'contribute',
    loadComponent: () => import('./pages/contributor/contributor.page').then(({ ContributorPage }) => ContributorPage),
    title: 'Contributing | Sushi Playground',
    data: {
      title: 'Contributing to Sushi',
      description: 'Set up the repository, choose a change, and prepare it for review.',
      source: '/repository-docs/CONTRIBUTING.md',
    },
  },
  {
    path: 'contribute/components',
    loadComponent: () => import('./pages/contributor/contributor.page').then(({ ContributorPage }) => ContributorPage),
    title: 'Build a component | Sushi Playground',
    data: {
      title: 'Build a component',
      description: 'Follow the library structure from public API and accessibility through examples and documentation.',
      source: '/repository-docs/component-development.md',
    },
  },
  {
    path: 'contribute/styles',
    loadComponent: () => import('./pages/contributor/contributor.page').then(({ ContributorPage }) => ContributorPage),
    title: 'Component styling | Sushi Playground',
    data: {
      title: 'Component styling',
      description: 'Place component styles, document public tokens, and update the library style build.',
      source: '/repository-docs/component-styling.md',
    },
  },
  {
    path: 'contribute/code',
    loadComponent: () => import('./pages/contributor/contributor.page').then(({ ContributorPage }) => ContributorPage),
    title: 'Coding conventions | Sushi Playground',
    data: {
      title: 'Coding conventions',
      description: 'Write Angular code that stays typed, readable, and approachable for the next contributor.',
      source: '/repository-docs/coding-conventions.md',
    },
  },
  {
    path: 'contribute/testing',
    loadComponent: () => import('./pages/contributor/contributor.page').then(({ ContributorPage }) => ContributorPage),
    title: 'Testing conventions | Sushi Playground',
    data: {
      title: 'Testing conventions',
      description: 'Test meaningful consumer behavior at the smallest reliable level.',
      source: '/repository-docs/testing-conventions.md',
    },
  },
  {
    path: 'contribute/ai',
    loadComponent: () => import('./pages/contributor/contributor.page').then(({ ContributorPage }) => ContributorPage),
    title: 'AI conventions | Sushi Playground',
    data: {
      title: 'AI conventions',
      description: 'Use AI assistance transparently while keeping every contribution reviewable and accountable.',
      source: '/repository-docs/ai-conventions.md',
    },
  },
  {
    path: 'accordion',
    loadComponent: () => import('./pages/accordion/accordion.page').then(({ AccordionPage }) => AccordionPage),
    title: 'Accordion | Sushi Playground',
  },
  {
    path: 'auto-focus',
    loadComponent: () => import('./pages/auto-focus/auto-focus.page').then(({ AutoFocusPage }) => AutoFocusPage),
    title: 'Auto Focus | Sushi Playground',
  },
  {
    path: 'autocomplete',
    loadComponent: () => import('./pages/autocomplete/autocomplete.page').then(({ AutocompletePage }) => AutocompletePage),
    title: 'Autocomplete | Sushi Playground',
  },
  {
    path: 'color-picker',
    loadComponent: () => import('./pages/color-picker/color-picker.page').then(({ ColorPickerPage }) => ColorPickerPage),
    title: 'Color Picker | Sushi Playground',
  },
  {
    path: 'checkbox',
    loadComponent: () => import('./pages/checkbox/checkbox.page').then(({ CheckboxPage }) => CheckboxPage),
    title: 'Checkbox | Sushi Playground',
  },
  {
    path: 'chip',
    loadComponent: () => import('./pages/chip/chip.page').then(({ ChipPage }) => ChipPage),
    title: 'Chip | Sushi Playground',
  },
  {
    path: 'fieldset',
    loadComponent: () => import('./pages/fieldset/fieldset.page').then(({ FieldsetPage }) => FieldsetPage),
    title: 'Fieldset | Sushi Playground',
  },
  {
    path: 'file-input',
    loadComponent: () => import('./pages/file-input/file-input.page').then(({ FileInputPage }) => FileInputPage),
    title: 'File Input | Sushi Playground',
  },
  {
    path: 'file-drop',
    loadComponent: () => import('./pages/file-drop/file-drop.page').then(({ FileDropPage }) => FileDropPage),
    title: 'File Drop | Sushi Playground',
  },
  {
    path: 'input',
    loadComponent: () => import('./pages/input/input.page').then(({ InputPage }) => InputPage),
    title: 'Input | Sushi Playground',
  },
  {
    path: 'label',
    loadComponent: () => import('./pages/label/label.page').then(({ LabelPage }) => LabelPage),
    title: 'Label | Sushi Playground',
  },
  {
    path: 'input-number',
    loadComponent: () => import('./pages/input-number/input-number.page').then(({ InputNumberPage }) => InputNumberPage),
    title: 'Input Number | Sushi Playground',
  },
  {
    path: 'input-otp',
    loadComponent: () => import('./pages/input-otp/input-otp.page').then(({ InputOtpPage }) => InputOtpPage),
    title: 'Input OTP | Sushi Playground',
  },
  {
    path: 'input-surface',
    loadComponent: () => import('./pages/input-surface/input-surface.page').then(({ InputSurfacePage }) => InputSurfacePage),
    title: 'Input Surface | Sushi Playground',
  },
  {
    path: 'input-group',
    loadComponent: () => import('./pages/input-group/input-group.page').then(({ InputGroupPage }) => InputGroupPage),
    title: 'Input Group | Sushi Playground',
  },
  {
    path: 'join',
    loadComponent: () => import('./pages/join/join.page').then(({ JoinPage }) => JoinPage),
    title: 'Join | Sushi Playground',
  },
  {
    path: 'multi-select',
    loadComponent: () => import('./pages/multi-select/multi-select.page').then(({ MultiSelectPage }) => MultiSelectPage),
    title: 'Multi-Select | Sushi Playground',
  },
  {
    path: 'navbar',
    loadComponent: () => import('./pages/navbar/navbar.page').then(({ NavbarPage }) => NavbarPage),
    title: 'Navbar | Sushi Playground',
  },
  {
    path: 'sidebar',
    loadComponent: () => import('./pages/sidebar/sidebar.page').then(({ SidebarPage }) => SidebarPage),
    title: 'Sidebar | Sushi Playground',
  },
  {
    path: 'drawer',
    loadComponent: () => import('./pages/drawer/drawer.page').then(({ DrawerPage }) => DrawerPage),
    title: 'Drawer | Sushi Playground',
  },
  {
    path: 'radio',
    loadComponent: () => import('./pages/radio/radio.page').then(({ RadioPage }) => RadioPage),
    title: 'Radio | Sushi Playground',
  },
  {
    path: 'progress',
    loadComponent: () => import('./pages/progress/progress.page').then(({ ProgressPage }) => ProgressPage),
    title: 'Progress | Sushi Playground',
  },
  {
    path: 'range',
    loadComponent: () => import('./pages/range/range.page').then(({ RangePage }) => RangePage),
    title: 'Range | Sushi Playground',
  },
  {
    path: 'select-button',
    loadComponent: () => import('./pages/select-button/select-button.page').then(({ SelectButtonPage }) => SelectButtonPage),
    title: 'Select Button | Sushi Playground',
  },
  {
    path: 'select',
    loadComponent: () => import('./pages/select/select.page').then(({ SelectPage }) => SelectPage),
    title: 'Select | Sushi Playground',
  },
  {
    path: 'textarea',
    loadComponent: () => import('./pages/textarea/textarea.page').then(({ TextareaPage }) => TextareaPage),
    title: 'Textarea | Sushi Playground',
  },
  {
    path: 'toggle',
    loadComponent: () => import('./pages/toggle/toggle.page').then(({ TogglePage }) => TogglePage),
    title: 'Toggle | Sushi Playground',
  },
  {
    path: 'avatar',
    loadComponent: () => import('./pages/avatar/avatar.page').then(({ AvatarPage }) => AvatarPage),
    title: 'Avatar | Sushi Playground',
  },
  {
    path: 'badge',
    loadComponent: () => import('./pages/badge/badge.page').then(({ BadgePage }) => BadgePage),
    title: 'Badge | Sushi Playground',
  },
  {
    path: 'button',
    loadComponent: () => import('./pages/button/button.page').then(({ ButtonPage }) => ButtonPage),
    title: 'Button | Sushi Playground',
  },
  {
    path: 'card',
    loadComponent: () => import('./pages/card/card.page').then(({ CardPage }) => CardPage),
    title: 'Card | Sushi Playground',
  },
  {
    path: 'code',
    loadComponent: () => import('./pages/code/code.page').then(({ CodePage }) => CodePage),
    title: 'Code | Sushi Playground',
  },
  {
    path: 'divider',
    loadComponent: () => import('./pages/divider/divider.page').then(({ DividerPage }) => DividerPage),
    title: 'Divider | Sushi Playground',
  },
  {
    path: 'dialog',
    loadComponent: () => import('./pages/dialog/dialog.page').then(({ DialogPage }) => DialogPage),
    title: 'Dialog | Sushi Playground',
  },
  {
    path: 'icon',
    loadComponent: () => import('./pages/icon/icon.page').then(({ IconPage }) => IconPage),
    title: 'Icons | Sushi Playground',
  },
  {
    path: 'indicator',
    loadComponent: () => import('./pages/indicator/indicator.page').then(({ IndicatorPage }) => IndicatorPage),
    title: 'Indicator | Sushi Playground',
  },
  {
    path: 'kbd',
    loadComponent: () => import('./pages/kbd/kbd.page').then(({ KbdPage }) => KbdPage),
    title: 'Keyboard Key | Sushi Playground',
  },
  {
    path: 'message',
    loadComponent: () => import('./pages/message/message.page').then(({ MessagePage }) => MessagePage),
    title: 'Message | Sushi Playground',
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.page').then(({ MenuPage }) => MenuPage),
    title: 'Menu | Sushi Playground',
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/list/list.page').then(({ ListPage }) => ListPage),
    title: 'List | Sushi Playground',
  },
  {
    path: 'mask',
    loadComponent: () => import('./pages/mask/mask.page').then(({ MaskPage }) => MaskPage),
    title: 'Mask | Sushi Playground',
  },
  {
    path: 'listbox',
    loadComponent: () => import('./pages/listbox/listbox.page').then(({ ListboxPage }) => ListboxPage),
    title: 'Listbox | Sushi Playground',
  },
  {
    path: 'order-list',
    loadComponent: () => import('./pages/order-list/order-list.page').then(({ OrderListPage }) => OrderListPage),
    title: 'Order List | Sushi Playground',
  },
  {
    path: 'pagination',
    loadComponent: () => import('./pages/pagination/pagination.page').then(({ PaginationPage }) => PaginationPage),
    title: 'Pagination | Sushi Playground',
  },
  {
    path: 'data-view',
    loadComponent: () => import('./pages/data-view/data-view.page').then(({ DataViewPage }) => DataViewPage),
    title: 'Data View | Sushi Playground',
  },
  {
    path: 'spinner',
    loadComponent: () => import('./pages/spinner/spinner.page').then(({ SpinnerPage }) => SpinnerPage),
    title: 'Spinner | Sushi Playground',
  },
  {
    path: 'status',
    loadComponent: () => import('./pages/status/status.page').then(({ StatusPage }) => StatusPage),
    title: 'Status | Sushi Playground',
  },
  {
    path: 'toast',
    loadComponent: () => import('./pages/toast/toast.page').then(({ ToastPage }) => ToastPage),
    title: 'Toast | Sushi Playground',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(({ TabsPage }) => TabsPage),
    title: 'Tabs | Sushi Playground',
  },
  {
    path: 'table',
    loadComponent: () => import('./pages/table/table.page').then(({ TablePage }) => TablePage),
    title: 'Table | Sushi Playground',
  },
  {
    path: 'toggle-button',
    loadComponent: () => import('./pages/toggle-button/toggle-button.page').then(({ ToggleButtonPage }) => ToggleButtonPage),
    title: 'Toggle Button | Sushi Playground',
  },
  {
    path: 'breadcrumb',
    loadComponent: () => import('./pages/breadcrumb/breadcrumb.page').then(({ BreadcrumbPage }) => BreadcrumbPage),
    title: 'Breadcrumb | Sushi Playground',
  },
  {
    path: 'popover',
    loadComponent: () => import('./pages/popover/popover.page').then(({ PopoverPage }) => PopoverPage),
    title: 'Popover | Sushi Playground',
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./pages/tooltip/tooltip.page').then(({ TooltipPage }) => TooltipPage),
    title: 'Tooltip | Sushi Playground',
  },
  {
    path: 'skeleton',
    loadComponent: () => import('./pages/skeleton/skeleton.page').then(({ SkeletonPage }) => SkeletonPage),
    title: 'Skeleton | Sushi Playground',
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.page').then(({ GalleryPage }) => GalleryPage),
    title: 'Gallery | Sushi Playground',
  },
  {
    path: 'lightbox',
    loadComponent: () => import('./pages/lightbox/lightbox.page').then(({ LightboxPage }) => LightboxPage),
    title: 'Lightbox | Sushi Playground',
  },
  ...apiRoutes,
  ...stylingRoutes,
  {
    path: '**',
    redirectTo: '',
  },
];
