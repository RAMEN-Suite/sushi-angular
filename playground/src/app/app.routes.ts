import { Routes } from '@angular/router';
import { ButtonPage } from './view/pages/button/button.page';
import { HomePage } from './view/pages/home/home.page';

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
    path: '**',
    redirectTo: '',
  },
];
