import { Estado } from './estado';
import { Marca } from './marca';

export interface Producto {
  idProducto?: number;
  descripProducto: string;
  stockProducto: number;
  precioProducto: number;
  marca: Marca;
  estado: Estado;
}
