import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './features/layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((c) => c.RegisterComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list.component').then(
            (c) => c.ProductListComponent
          ),
      },
      {
        path: 'invoicing',
        loadComponent: () =>
          import('./features/invoicing/invoice-form/invoice-form.component').then(
            (c) => c.InvoiceFormComponent
          ),
      },
      {
        path: 'invoice-history',
        loadComponent: () =>
          import('./features/invoicing/invoice-list/invoice-list.component').then(
            (c) => c.InvoiceListComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
