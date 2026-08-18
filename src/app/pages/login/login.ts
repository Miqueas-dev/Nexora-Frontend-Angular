import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { getApiErrorMessage } from '../../core/services/error-message';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private readonly fb = inject(FormBuilder);
  enviando = false;
  mostrarClave = false;
  readonly form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(45)]],
    clave: ['', [Validators.required]]
  });

  constructor(private auth: AuthService, private router: Router, private modal: ModalService) {
    this.auth.cargarSesion().subscribe(usuario => {
      if (usuario) this.router.navigateByUrl(this.auth.rutaPrincipal(usuario.rol));
    });
  }

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.modal.warning('Revisa tus datos', 'Ingresa un correo válido y tu contraseña para continuar.');
      return;
    }
    this.enviando = true;
    this.auth.login(this.form.getRawValue()).subscribe({
      next: usuario => {
        this.enviando = false;
        if (usuario.rol === 'CLIENTE') {
          this.auth.logout().subscribe({ next: () => {}, error: () => this.auth.limpiarSesion() });
          this.modal.error('Acceso Back Office', 'Las cuentas de Cliente deben ingresar desde el Portal Cliente.');
          return;
        }
        this.modal.success('Bienvenido al Back Office', `Hola ${usuario.nombre}. Tu espacio de trabajo está listo.`);
        this.router.navigateByUrl(this.auth.rutaPrincipal(usuario.rol));
      },
      error: error => {
        this.enviando = false;
        this.modal.error('No se pudo iniciar sesión', getApiErrorMessage(error, 'Correo o contraseña incorrectos.'));
      }
    });
  }
}
