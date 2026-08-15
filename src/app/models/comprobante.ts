import { DetalleComprobante } from './detalle-comprobante';
import { Usuario } from './usuario';

export interface Comprobante {
  numComprobante: number;
  fechaComprobante: string;
  usuario: Usuario;
  vendedor?: Usuario;
  total: number;
  detalles: DetalleComprobante[];
}
