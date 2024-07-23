export const EMPLOYEES_ROUTES = [
  {
    path: '',
    loadComponent: () => import('./pages/employee-index/employee-index.component').then((m) => m.EmployeeIndexComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/employee-create/employee-create.component').then((m) => m.EmployeeCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/employee-show/employee-show.component').then((m) => m.EmployeeShowComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/employee-edit/employee-edit.component').then((m) => m.EmployeeEditComponent),
  },
];
