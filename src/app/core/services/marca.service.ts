import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Marca } from '../../models/nexora.models';

@Injectable({ providedIn: 'root' })
export class MarcaService {
  private readonly url = `${API_URL}/marcas`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Marca[]> { return this.http.get<Marca[]>(this.url); }
  registrar(item: Marca): Observable<Marca> { return this.http.post<Marca>(this.url, item); }
  actualizar(id: number, item: Marca): Observable<Marca> { return this.http.put<Marca>(`${this.url}/${id}`, item); }
  eliminar(id: number): Observable<string> { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}
