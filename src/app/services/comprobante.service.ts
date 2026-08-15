import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comprobante } from '../models/comprobante';
import { VentaRequest } from '../models/venta-request';

@Injectable({ providedIn: 'root' })
export class ComprobanteService {
  private apiUrl = 'http://localhost:8080/api/comprobantes';

  constructor(private http: HttpClient) { }

  listarTodas(): Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(this.apiUrl, { withCredentials: true });
  }

  registrarVenta(request: VentaRequest): Observable<Comprobante> {
    return this.http.post<Comprobante>(this.apiUrl, request, { withCredentials: true });
  }

  misVentas(): Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(`${this.apiUrl}/vendedor/mias`, { withCredentials: true });
  }

  misCompras(): Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(`${this.apiUrl}/mios`, { withCredentials: true });
  }
}
