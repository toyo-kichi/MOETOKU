import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'entry', pathMatch: 'full' },
  {
    path: 'entry',
    loadChildren: () => import('./features/entry/entry.routes').then((m) => m.entryRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  { path: '**', redirectTo: 'entry' },
];
