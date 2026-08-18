import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Producto } from '../../models/nexora.models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly url = `${API_URL}/productos`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Producto[]> { return this.http.get<Producto[]>(this.url); }
  buscar(id: number): Observable<Producto> { return this.http.get<Producto>(`${this.url}/${id}`); }
  registrar(producto: Producto): Observable<Producto> { return this.http.post<Producto>(this.url, producto); }
  actualizar(id: number, producto: Producto): Observable<Producto> { return this.http.put<Producto>(`${this.url}/${id}`, producto); }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  buscarDescripcion(descripcion: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/buscar/descripcion`, { params: new HttpParams().set('descripcion', descripcion) });
  }
}
