import { Producto } from '../models/nexora.models';

/**
 * Imágenes de referencia del frontend. Puedes reemplazar cualquiera de estas URLs
 * por las imágenes definitivas del negocio sin modificar el backend.
 */
export const PRODUCT_REFERENCE_IMAGES = {
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
  mouse: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
  generic: '/images/product-placeholder.svg'
} as const;

export function productImageUrl(product: Producto): string {
  const text = `${product.descripProducto} ${product.marca?.marcaDesc ?? ''}`.toLocaleLowerCase();
  if (/laptop|notebook|thinkpad|macbook/.test(text)) return PRODUCT_REFERENCE_IMAGES.laptop;
  if (/celular|smartphone|telefono|teléfono|iphone|galaxy/.test(text)) return PRODUCT_REFERENCE_IMAGES.phone;
  if (/monitor|pantalla|display/.test(text)) return PRODUCT_REFERENCE_IMAGES.monitor;
  if (/audifono|audífono|headphone|auricular/.test(text)) return PRODUCT_REFERENCE_IMAGES.headphones;
  if (/teclado|keyboard/.test(text)) return PRODUCT_REFERENCE_IMAGES.keyboard;
  if (/mouse|raton|ratón/.test(text)) return PRODUCT_REFERENCE_IMAGES.mouse;
  return PRODUCT_REFERENCE_IMAGES.generic;
}

export function useProductImageFallback(event: Event): void {
  const image = event.target as HTMLImageElement | null;
  if (!image || image.src.endsWith('/images/product-placeholder.svg')) return;
  image.src = PRODUCT_REFERENCE_IMAGES.generic;
}
