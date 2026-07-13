import { Routes } from '@angular/router';
import { OverviewPage } from './view/overview.page';
import { ButtonPage } from './view/actions/button/button.page';
import { IconPage } from './view/display/icon/icon.page';
import { BadgePage } from './view/display/badge/badge.page';
import { DividerPage } from './view/layout/divider/divider.page';
import { CardPage } from './view/layout/card/card.page';
import { CodePage } from './view/mockup/code/code.page';
import { ToggleButtonPage } from './view/form/toggle-button/toggle-button.page';

export const routes: Routes = [
  {
    path: '',
    component: OverviewPage,
    title: 'SUSHI Playground',
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
    path: 'toggle-button',
    component: ToggleButtonPage,
    title: 'Toggle Button | SUSHI Playground',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
