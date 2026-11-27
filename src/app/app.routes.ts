import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'politica-de-privacidade',
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  { path: '**', redirectTo: '' },
];
