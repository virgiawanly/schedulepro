import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { authGuard } from '../../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'customers',
        canActivate: [authGuard],
        loadChildren: () => import('./customers/customers.routes').then((m) => m.CUSTOMERS_ROUTES),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
];
