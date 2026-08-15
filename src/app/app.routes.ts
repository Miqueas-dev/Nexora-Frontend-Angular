import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Productos } from './pages/productos/productos';
import { Usuarios } from './pages/usuarios/usuarios';
import { VentasAdmin } from './pages/ventas-admin/ventas-admin';
import { VendedorDashboard } from './pages/vendedor-dashboard/vendedor-dashboard';
import { PuntoVenta } from './pages/punto-venta/punto-venta';
import { MisVentas } from './pages/mis-ventas/mis-ventas';
import { ClienteDashboard } from './pages/cliente-dashboard/cliente-dashboard';
import { Catalogo } from './pages/catalogo/catalogo';
import { MisCompras } from './pages/mis-compras/mis-compras';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'admin', component: AdminDashboard },
  { path: 'admin/productos', component: Productos },
  { path: 'admin/usuarios', component: Usuarios },
  { path: 'admin/ventas', component: VentasAdmin },
  { path: 'vendedor', component: VendedorDashboard },
  { path: 'vendedor/nueva-venta', component: PuntoVenta },
  { path: 'vendedor/mis-ventas', component: MisVentas },
  { path: 'cliente', component: ClienteDashboard },
  { path: 'cliente/catalogo', component: Catalogo },
  { path: 'cliente/mis-compras', component: MisCompras },
  { path: '**', redirectTo: 'login' }
];
