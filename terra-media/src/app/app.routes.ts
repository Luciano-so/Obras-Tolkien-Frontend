// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/components/login.component').then(m => m.LoginComponent)
  },

  {
    path: '',
    loadComponent: () => import('./layout/components/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/components/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'book',
        loadComponent: () => import('./features/books/components/books-list/books-list.component').then(m => m.BooksListComponent)
      }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
