import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ModalService } from '../shared/modal/modal.service';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './cliente-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteLayout {
  private readonly auth = inject(AuthService);
  readonly usuario$ = this.auth.usuario$;
  menuOpen = false;

  constructor(private router: Router, private modal: ModalService) {}

  cerrarMenu(): void { this.menuOpen = false; }

  async cerrarSesion(): Promise<void> {
    const aceptar = await this.modal.confirm('Cerrar sesión', '¿Deseas cerrar tu sesión de cliente en Nexora?', 'Cerrar sesión');
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
