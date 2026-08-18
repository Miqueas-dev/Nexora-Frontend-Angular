import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { getApiErrorMessage } from '../../core/services/error-message';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroCliente {
  private readonly fb = inject(FormBuilder);
  enviando = false;
  mostrarClave = false;

  readonly form = this.fb.nonNullable.group({
    dniUsuario: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombreUsuario: ['', [Validators.required, Validators.maxLength(45)]],
    apepatUsuario: ['', [Validators.required, Validators.maxLength(45)]],
    apematUsuario: ['', [Validators.required, Validators.maxLength(45)]],
    correoUsuario: ['', [Validators.required, Validators.email, Validators.maxLength(45)]],
    claveUsuario: ['', [Validators.required, Validators.minLength(6)]],
    fecnacUsuario: ['', [Validators.required]]
  });

  constructor(private auth: AuthService, private router: Router, private modal: ModalService) {}

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.modal.warning('Revisa tus datos', 'Completa correctamente los campos obligatorios para crear tu cuenta.');
      return;
    }

    this.enviando = true;
    this.auth.registrarCliente(this.form.getRawValue()).subscribe({
      next: () => {
        this.enviando = false;
        this.modal.success('Cuenta creada', 'Tu cuenta de cliente fue registrada correctamente. Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: error => {
        this.enviando = false;
        this.modal.error('No se pudo crear la cuenta', getApiErrorMessage(error, 'Revisa la información e intenta nuevamente.'));
      }
    });
  }
}
