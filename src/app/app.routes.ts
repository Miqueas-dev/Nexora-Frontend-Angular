import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing').then(m => m.Landing) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro').then(m => m.RegistroCliente) },
  { path: 'login', loadComponent: () => import('./pages/cliente/login/login').then(m => m.ClienteLogin) },
  { path: 'backoffice/login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'acceso-denegado', loadComponent: () => import('./pages/errors/access-denied').then(m => m.AccessDenied) },
  {
    path: 'cliente',
    data: { roles: ['CLIENTE'], loginRoute: '/login' },
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('./cliente-layout/cliente-layout').then(m => m.ClienteLayout),
    children: [
      { path: 'inicio', loadComponent: () => import('./pages/cliente/dashboard/dashboard').then(m => m.ClienteDashboard) },
      { path: 'productos', loadComponent: () => import('./pages/cliente/productos/productos').then(m => m.ProductosCliente) },
      { path: 'mis-compras', loadComponent: () => import('./pages/cliente/mis-compras/mis-compras').then(m => m.MisCompras) },
      { path: 'mi-cuenta', loadComponent: () => import('./pages/cliente/mi-cuenta/mi-cuenta').then(m => m.MiCuenta) },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },
  {
    path: 'app',
    data: { roles: ['ADMIN', 'VENDEDOR'], loginRoute: '/backoffice/login' },
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('./layout/layout').then(m => m.Layout),
    children: [
      { path: 'admin/dashboard', data: { roles: ['ADMIN'] }, canActivate: [roleGuard], loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.AdminDashboard) },
      { path: 'admin/usuarios', data: { roles: ['ADMIN'] }, canActivate: [roleGuard], loadComponent: () => import('./pages/admin/usuarios/usuarios').then(m => m.Usuarios) },
      { path: 'admin/productos', data: { roles: ['ADMIN'] }, canActivate: [roleGuard], loadComponent: () => import('./pages/admin/productos/productos').then(m => m.ProductosAdmin) },
      { path: 'admin/catalogos', data: { roles: ['ADMIN'] }, canActivate: [roleGuard], loadComponent: () => import('./pages/admin/catalogos/catalogos').then(m => m.Catalogos) },
      { path: 'admin/ventas', data: { roles: ['ADMIN'] }, canActivate: [roleGuard], loadComponent: () => import('./pages/admin/ventas/ventas').then(m => m.VentasAdmin) },
      { path: 'vendedor/dashboard', data: { roles: ['VENDEDOR'] }, canActivate: [roleGuard], loadComponent: () => import('./pages/vendedor/dashboard/dashboard').then(m => m.VendedorDashboard) },
      { path: 'vendedor/nueva-venta', data: { roles: ['VENDEDOR'] }, canActivate: [roleGuard], loadComponent: () => import('./pages/vendedor/nueva-venta/nueva-venta').then(m => m.NuevaVenta) },
      { path: 'vendedor/mis-ventas', data: { roles: ['VENDEDOR'] }, canActivate: [roleGuard], loadComponent: () => import('./pages/vendedor/mis-ventas/mis-ventas').then(m => m.MisVentas) },
      { path: '', redirectTo: '/backoffice/login', pathMatch: 'full' }
    ]
  },
  { path: '**', loadComponent: () => import('./pages/errors/not-found').then(m => m.NotFound) }
];
