import { describe, expect, it } from 'vitest';
import { calculateSaleTotal, mergeSaleLine } from './sale-utils';

describe('sale-utils', () => {
  it('agrega un producto nuevo al detalle de venta', () => {
    const result = mergeSaleLine([], 7, 2, 10);
    expect(result).toEqual([{ idProducto: 7, cantidad: 2 }]);
  });

  it('acumula la cantidad de un producto repetido sin superar stock', () => {
    const result = mergeSaleLine([{ idProducto: 7, cantidad: 2 }], 7, 3, 5);
    expect(result).toEqual([{ idProducto: 7, cantidad: 5 }]);
  });

  it('rechaza una cantidad que supera el stock', () => {
    expect(() => mergeSaleLine([{ idProducto: 7, cantidad: 2 }], 7, 4, 5)).toThrow('stock');
  });

  it('calcula el total usando el precio actual de la lista solo para vista previa', () => {
    const total = calculateSaleTotal(
      [{ idProducto: 1, cantidad: 2 }, { idProducto: 2, cantidad: 1 }],
      [{ idProducto: 1, precioProducto: 10 }, { idProducto: 2, precioProducto: 7.5 }]
    );
    expect(total).toBe(27.5);
  });
});
