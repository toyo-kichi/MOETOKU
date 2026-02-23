import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    title: 'ダッシュボード | MOETOKU',
    loadComponent: () =>
      import('./components/despair-chart/despair-chart').then((m) => m.DespairChartComponent),
  },
];
