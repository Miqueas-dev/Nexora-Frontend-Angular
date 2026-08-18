import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Tipo } from '../../models/nexora.models';

@Injectable({ providedIn: 'root' })
export class TipoService {
  private readonly url = `${API_URL}/tipos`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Tipo[]> { return this.http.get<Tipo[]>(this.url); }
  registrar(item: Tipo): Observable<Tipo> { return this.http.post<Tipo>(this.url, item); }
  actualizar(id: number, item: Tipo): Observable<Tipo> { return this.http.put<Tipo>(`${this.url}/${id}`, item); }
  eliminar(id: number): Observable<string> { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}
