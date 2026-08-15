import { DetalleVentaRequest } from './detalle-venta-request';

export interface VentaRequest {
  idUsuario: number;
  detalles: DetalleVentaRequest[];
}
