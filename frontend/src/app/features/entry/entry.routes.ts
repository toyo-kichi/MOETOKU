import { Routes } from '@angular/router';

export const entryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/entry-form/entry-form').then((m) => m.EntryFormComponent),
  },
];
