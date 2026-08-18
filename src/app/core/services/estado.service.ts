import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Estado } from '../../models/nexora.models';

@Injectable({ providedIn: 'root' })
export class EstadoService {
  private readonly url = `${API_URL}/estados`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Estado[]> { return this.http.get<Estado[]>(this.url); }
  registrar(item: Estado): Observable<Estado> { return this.http.post<Estado>(this.url, item); }
  actualizar(id: number, item: Estado): Observable<Estado> { return this.http.put<Estado>(`${this.url}/${id}`, item); }
  eliminar(id: number): Observable<string> { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}
