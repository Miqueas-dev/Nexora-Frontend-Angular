import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { RolNexora } from '../models/nexora.models';
import { ModalService } from '../shared/modal/modal.service';

interface MenuItem { label: string; route: string; icon: string; roles: RolNexora[]; }

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {
  private readonly auth = inject(AuthService);

  sidebarOpen = false;
  sidebarCollapsed = false;
  readonly usuario$ = this.auth.usuario$;
  readonly menu: MenuItem[] = [
    { label: 'Resumen', route: '/app/admin/dashboard', icon: 'dashboard', roles: ['ADMIN'] },
    { label: 'Usuarios', route: '/app/admin/usuarios', icon: 'users', roles: ['ADMIN'] },
    { label: 'Productos', route: '/app/admin/productos', icon: 'package', roles: ['ADMIN'] },
    { label: 'Catálogos', route: '/app/admin/catalogos', icon: 'settings', roles: ['ADMIN'] },
    { label: 'Ventas', route: '/app/admin/ventas', icon: 'receipt', roles: ['ADMIN'] },
    { label: 'Resumen', route: '/app/vendedor/dashboard', icon: 'dashboard', roles: ['VENDEDOR'] },
    { label: 'Nueva venta', route: '/app/vendedor/nueva-venta', icon: 'plus', roles: ['VENDEDOR'] },
    { label: 'Mis ventas', route: '/app/vendedor/mis-ventas', icon: 'receipt', roles: ['VENDEDOR'] },
  ];

  constructor(private router: Router, private modal: ModalService) {}

  itemsPara(rol: RolNexora): MenuItem[] { return this.menu.filter(item => item.roles.includes(rol)); }
  authRoute(rol: RolNexora): string { return this.auth.rutaPrincipal(rol); }
  cerrarSidebar(): void { this.sidebarOpen = false; }

  async cerrarSesion(): Promise<void> {
    const aceptar = await this.modal.confirm('Cerrar sesión', '¿Deseas salir de tu espacio de trabajo en Nexora?', 'Cerrar sesión');
    if (!aceptar) return;
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.auth.limpiarSesion();
        this.router.navigate(['/']);
      }
    });
  }
}
