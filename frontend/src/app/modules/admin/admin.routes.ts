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
        path: 'employees',
        canActivate: [authGuard],
        loadChildren: () => import('./employees/employees.routes').then((m) => m.EMPLOYEES_ROUTES),
      },
      {
        path: 'products',
        canActivate: [authGuard],
        loadChildren: () => import('./products/products.routes').then((m) => m.PRODUCTS_ROUTES),
      },
      {
        path: 'materials',
        canActivate: [authGuard],
        loadChildren: () => import('./materials/materials.routes').then((m) => m.MATERIALS_ROUTES),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
];
