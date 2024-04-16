export const PRODUCTS_ROUTES = [
  {
    path: '',
    loadComponent: () => import('./pages/product-index/product-index.component').then((m) => m.ProductIndexComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/product-create/product-create.component').then((m) => m.ProductCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/product-show/product-show.component').then((m) => m.ProductShowComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/product-edit/product-edit.component').then((m) => m.ProductEditComponent),
  },
];
