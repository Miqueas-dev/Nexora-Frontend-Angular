import { describe, expect, it } from 'vitest';
import { Producto } from '../models/nexora.models';
import { productImageUrl, PRODUCT_REFERENCE_IMAGES } from './product-image';

function producto(descripcion: string): Producto {
  return {
    idProducto: 1,
    descripProducto: descripcion,
    stockProducto: 10,
    precioProducto: 100,
    marca: { idMarca: 1, marcaDesc: 'Nexora' },
    estado: { idEstado: 1, descripcion: 'Activo' }
  };
}

describe('productImageUrl', () => {
  it('asigna una imagen de laptop por palabras clave', () => {
    expect(productImageUrl(producto('Laptop empresarial'))).toBe(PRODUCT_REFERENCE_IMAGES.laptop);
  });

  it('usa el recurso local cuando no reconoce el producto', () => {
    expect(productImageUrl(producto('Accesorio especial'))).toBe(PRODUCT_REFERENCE_IMAGES.generic);
  });
});
