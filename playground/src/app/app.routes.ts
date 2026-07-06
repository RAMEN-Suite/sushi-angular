import { Routes } from '@angular/router';
import { ButtonPage } from './view/pages/button/button.page';
import { HomePage } from './view/pages/home/home.page';
import { BadgePage } from './view/pages/badge/badge.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'SUSHI Playground',
  },
  {
    path: 'button',
    component: ButtonPage,
    title: 'Button | SUSHI Playground',
  },
  {
    path: 'badge',
    component: BadgePage,
    title: 'Badge | SUSHI Playground',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
