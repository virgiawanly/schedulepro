export const MATERIALS_ROUTES = [
  {
    path: '',
    loadComponent: () => import('./pages/material-index/material-index.component').then((m) => m.MaterialIndexComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/material-create/material-create.component').then((m) => m.MaterialCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/material-show/material-show.component').then((m) => m.MaterialShowComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/material-edit/material-edit.component').then((m) => m.MaterialEditComponent),
  },
];
