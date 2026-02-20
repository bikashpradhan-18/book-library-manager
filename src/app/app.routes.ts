import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login),
  },

  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'books',
        loadComponent: () =>
          import('./features/books/books/books').then(m => m.Books),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/profile/profile').then(m => m.Profile),
      },
      {
        path: 'admin',
        canActivate: [authGuard, roleGuard('Admin')],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/admin/admin/admin')
                .then(m => m.Admin),
          },
          {
            path: 'add',
            loadComponent: () =>
              import('./features/admin/admin-form/admin-form')
                .then(m => m.AdminForm),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/admin/admin-form/admin-form')
                .then(m => m.AdminForm),
          }
        ]
      },
      {
        path: '',
        redirectTo: 'books',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'books',
  },
];