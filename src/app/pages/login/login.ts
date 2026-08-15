import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';
import { LoginResponse } from '../../models/login-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  correo: string = '';
  clave: string = '';
  cargando: boolean = false;
  mensaje: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ingresar(): void {
    if (!this.correo || !this.clave) {
      this.mostrarError('Ingrese correo y contraseña.');
      return;
    }

    const request: LoginRequest = {
      correo: this.correo,
      clave: this.clave
    };

    this.cargando = true;

    this.authService.login(request).subscribe({
      next: (usuario) => {
        this.cargando = false;
        this.authService.usuarioActual = usuario;
        this.irAlInicio(usuario);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando = false;
        this.mostrarError(typeof error.error === 'string' ? error.error : 'No se pudo iniciar sesión.');
      }
    });
  }

  private irAlInicio(usuario: LoginResponse): void {
    if (usuario.rol === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (usuario.rol === 'VENDEDOR') {
      this.router.navigate(['/vendedor']);
    } else if (usuario.rol === 'CLIENTE') {
      this.router.navigate(['/cliente']);
    } else {
      this.mostrarError('El usuario no tiene un rol válido.');
    }
  }

  mostrarError(texto: string): void {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = '', 4000);
  }
}
