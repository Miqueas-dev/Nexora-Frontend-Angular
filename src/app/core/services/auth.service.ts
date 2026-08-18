import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { API_URL } from '../api.config';
import { LoginRequest, LoginResponse, RegistroClienteRequest, RolNexora, Usuario } from '../../models/nexora.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSubject = new BehaviorSubject<LoginResponse | null>(null);
  readonly usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  get usuarioActual(): LoginResponse | null {
    return this.usuarioSubject.value;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, request).pipe(
      tap(usuario => this.usuarioSubject.next(usuario))
    );
  }

  registrarCliente(request: RegistroClienteRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_URL}/auth/registro-cliente`, request);
  }

  cargarSesion(): Observable<LoginResponse | null> {
    if (this.usuarioActual) {
      return of(this.usuarioActual);
    }
    return this.http.get<LoginResponse>(`${API_URL}/auth/me`).pipe(
      tap(usuario => this.usuarioSubject.next(usuario)),
      catchError(() => {
        this.usuarioSubject.next(null);
        return of(null);
      })
    );
  }

  logout(): Observable<string> {
    return this.http.post(`${API_URL}/auth/logout`, {}, { responseType: 'text' }).pipe(
      tap(() => this.usuarioSubject.next(null))
    );
  }

  limpiarSesion(): void {
    this.usuarioSubject.next(null);
  }

  rutaPrincipal(rol: RolNexora): string {
    if (rol === 'ADMIN') return '/app/admin/dashboard';
    if (rol === 'VENDEDOR') return '/app/vendedor/dashboard';
    return '/cliente/inicio';
  }
}
