import { DetalleVentaRequest } from '../models/nexora.models';

export function mergeSaleLine(
  detalles: DetalleVentaRequest[],
  idProducto: number,
  cantidad: number,
  stock: number
): DetalleVentaRequest[] {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new Error('La cantidad debe ser un número entero mayor que cero.');
  }
  const existente = detalles.find(item => item.idProducto === idProducto);
  const acumulado = (existente?.cantidad ?? 0) + cantidad;
  if (acumulado > stock) {
    throw new Error('La cantidad solicitada supera el stock disponible.');
  }
  if (existente) {
    return detalles.map(item => item.idProducto === idProducto ? { ...item, cantidad: acumulado } : item);
  }
  return [...detalles, { idProducto, cantidad }];
}

export function calculateSaleTotal(
  detalles: DetalleVentaRequest[],
  productos: Array<{ idProducto?: number; precioProducto: number }>
): number {
  return detalles.reduce((total, detalle) => {
    const producto = productos.find(item => item.idProducto === detalle.idProducto);
    return total + ((producto?.precioProducto ?? 0) * detalle.cantidad);
  }, 0);
}
