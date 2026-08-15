import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca';

@Injectable({ providedIn: 'root' })
export class MarcaService {
  private apiUrl = 'http://localhost:8080/api/marcas';

  constructor(private http: HttpClient) { }

  listar(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl, { withCredentials: true });
  }

  registrar(marca: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, marca, { withCredentials: true });
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      withCredentials: true,
      responseType: 'text'
    });
  }
}
