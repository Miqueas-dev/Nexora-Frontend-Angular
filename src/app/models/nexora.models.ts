export type RolNexora = 'ADMIN' | 'VENDEDOR' | 'CLIENTE';

export interface Marca {
  idMarca?: number;
  marcaDesc: string;
}

export interface Estado {
  idEstado?: number;
  descripcion: string;
}

export interface Tipo {
  idTipo?: number;
  descripcion: string;
}

export interface Usuario {
  idUsuario?: number;
  dniUsuario: string;
  nombreUsuario: string;
  apepatUsuario: string;
  apematUsuario: string;
  correoUsuario: string;
  claveUsuario?: string;
  fecnacUsuario: string;
  tipo: Tipo;
  estado: Estado;
}

export interface Producto {
  idProducto?: number;
  descripProducto: string;
  stockProducto: number;
  precioProducto: number;
  marca: Marca;
  estado: Estado;
}

export interface LoginRequest {
  correo: string;
  clave: string;
}

export interface LoginResponse {
  idUsuario: number;
  nombre: string;
  correo: string;
  rol: RolNexora;
}

export interface RegistroClienteRequest {
  dniUsuario: string;
  nombreUsuario: string;
  apepatUsuario: string;
  apematUsuario: string;
  correoUsuario: string;
  claveUsuario: string;
  fecnacUsuario: string;
}

export interface DetalleVentaRequest {
  idProducto: number;
  cantidad: number;
}

export interface VentaRequest {
  idUsuario: number;
  detalles: DetalleVentaRequest[];
}

export interface DetalleComprobanteResponse {
  idDetalle: number;
  idProducto: number;
  descripcionProducto: string;
  cantidad: number;
  precioVenta: number;
  subtotal: number;
}

export interface ComprobanteResponse {
  numComprobante: number;
  fechaComprobante: string;
  usuario: Usuario;
  vendedor: Usuario | null;
  total: number;
  detalles: DetalleComprobanteResponse[];
}
