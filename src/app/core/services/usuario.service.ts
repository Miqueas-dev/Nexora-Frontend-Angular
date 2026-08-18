import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Usuario } from '../../models/nexora.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly url = `${API_URL}/usuarios`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Usuario[]> { return this.http.get<Usuario[]>(this.url); }
  listarClientes(): Observable<Usuario[]> { return this.http.get<Usuario[]>(`${this.url}/clientes`); }
  buscar(id: number): Observable<Usuario> { return this.http.get<Usuario>(`${this.url}/${id}`); }
  registrar(usuario: Usuario): Observable<Usuario> { return this.http.post<Usuario>(this.url, usuario); }
  actualizar(id: number, usuario: Usuario): Observable<Usuario> { return this.http.put<Usuario>(`${this.url}/${id}`, usuario); }
  eliminar(id: number): Observable<string> { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}
