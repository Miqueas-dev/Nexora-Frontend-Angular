import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { ComprobanteResponse, VentaRequest } from '../../models/nexora.models';

@Injectable({ providedIn: 'root' })
export class ComprobanteService {
  private readonly url = `${API_URL}/comprobantes`;
  constructor(private http: HttpClient) {}
  registrar(request: VentaRequest): Observable<ComprobanteResponse> { return this.http.post<ComprobanteResponse>(this.url, request); }
  listar(): Observable<ComprobanteResponse[]> { return this.http.get<ComprobanteResponse[]>(this.url); }
  buscar(id: number): Observable<ComprobanteResponse> { return this.http.get<ComprobanteResponse>(`${this.url}/${id}`); }
  misCompras(): Observable<ComprobanteResponse[]> { return this.http.get<ComprobanteResponse[]>(`${this.url}/mios`); }
  misVentas(): Observable<ComprobanteResponse[]> { return this.http.get<ComprobanteResponse[]>(`${this.url}/vendedor/mias`); }
}
