import { Routes } from '@angular/router';
import { OverviewPage } from './view/overview.page';
import { ButtonPage } from './view/actions/button/button.page';
import { IconPage } from './view/display/icon/icon.page';
import { BadgePage } from './view/display/badge/badge.page';
import { DividerPage } from './view/layout/divider/divider.page';
import { CardPage } from './view/layout/card/card.page';
import { CodePage } from './view/mockup/code/code.page';
import { ToggleButtonPage } from './view/form/toggle-button/toggle-button.page';
import { SpinnerPage } from './view/display/spinner/spinner.page';
import { StatusPage } from './view/display/status/status.page';
import { KbdPage } from './view/display/kbd/kbd.page';
import { AvatarPage } from './view/display/avatar/avatar.page';
import { IndicatorPage } from './view/display/indicator/indicator.page';
import { AutoFocusPage } from './view/form/auto-focus/auto-focus.page';
import { MessagePage } from './view/display/message/message.page';

export const routes: Routes = [
  {
    path: '',
    component: OverviewPage,
    title: 'SUSHI Playground',
  },
  {
    path: 'auto-focus',
    component: AutoFocusPage,
    title: 'Auto Focus | SUSHI Playground',
  },
  {
    path: 'avatar',
    component: AvatarPage,
    title: 'Avatar | SUSHI Playground',
  },
  {
    path: 'badge',
    component: BadgePage,
    title: 'Badge | SUSHI Playground',
  },
  {
    path: 'button',
    component: ButtonPage,
    title: 'Button | SUSHI Playground',
  },
  {
    path: 'card',
    component: CardPage,
    title: 'Card | SUSHI Playground',
  },
  {
    path: 'code',
    component: CodePage,
    title: 'Code | SUSHI Playground',
  },
  {
    path: 'divider',
    component: DividerPage,
    title: 'Divider | SUSHI Playground',
  },
  {
    path: 'icon',
    component: IconPage,
    title: 'Icons | SUSHI Playground',
  },
  {
    path: 'indicator',
    component: IndicatorPage,
    title: 'Indicator | SUSHI Playground',
  },
  {
    path: 'kbd',
    component: KbdPage,
    title: 'Keyboard Key | SUSHI Playground',
  },
  {
    path: 'message',
    component: MessagePage,
    title: 'Message | SUSHI Playground',
  },
  {
    path: 'spinner',
    component: SpinnerPage,
    title: 'Spinner | SUSHI Playground',
  },
  {
    path: 'status',
    component: StatusPage,
    title: 'Status | SUSHI Playground',
  },
  {
    path: 'toggle-button',
    component: ToggleButtonPage,
    title: 'Toggle Button | SUSHI Playground',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
