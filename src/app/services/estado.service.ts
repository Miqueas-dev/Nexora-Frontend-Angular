import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado';

@Injectable({ providedIn: 'root' })
export class EstadoService {
  private apiUrl = 'http://localhost:8080/api/estados';

  constructor(private http: HttpClient) { }

  listar(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.apiUrl, { withCredentials: true });
  }
}
