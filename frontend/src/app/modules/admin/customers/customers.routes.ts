export const CUSTOMERS_ROUTES = [
  {
    path: '',
    loadComponent: () => import('./pages/customer-index/customer-index.component').then((m) => m.CustomerIndexComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/customer-create/customer-create.component').then((m) => m.CustomerCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/customer-show/customer-show.component').then((m) => m.CustomerShowComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/customer-edit/customer-edit.component').then((m) => m.CustomerEditComponent),
  },
];
