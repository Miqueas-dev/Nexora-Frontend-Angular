import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoginResponse } from './models/login-response';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  cargandoSesion: boolean = true;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (usuario) => {
        this.authService.usuarioActual = usuario;
        this.cargandoSesion = false;

        if (this.router.url === '/' || this.router.url === '/login') {
          this.irAlInicio(usuario);
        }
      },
      error: () => {
        this.authService.usuarioActual = null;
        this.cargandoSesion = false;

        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.usuarioActual = null;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.usuarioActual = null;
        this.router.navigate(['/login']);
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
    }
  }
}
