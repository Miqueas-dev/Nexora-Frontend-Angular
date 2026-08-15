import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '../../models/usuario';
import { Producto } from '../../models/producto';
import { DetalleVentaRequest } from '../../models/detalle-venta-request';
import { VentaRequest } from '../../models/venta-request';
import { UsuarioService } from '../../services/usuario.service';
import { ProductoService } from '../../services/producto.service';
import { ComprobanteService } from '../../services/comprobante.service';

@Component({ selector: 'app-punto-venta', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './punto-venta.html' })
export class PuntoVenta implements OnInit {
  clientes: Usuario[] = [];
  productos: Producto[] = [];
  detalles: DetalleVentaRequest[] = [];
  clienteSeleccionado: number = 0;
  productoSeleccionado: number = 0;
  cantidad: number = 1;
  mensaje: string = '';
  tipoMensaje: string = 'success';

  constructor(private usuarioService: UsuarioService, private productoService: ProductoService, private comprobanteService: ComprobanteService) { }

  ngOnInit(): void { this.cargarDatos(); }

  cargarDatos(): void {
    this.usuarioService.listarClientes().subscribe({ next: data => this.clientes = data.filter(c => c.estado.descripcion.toLowerCase() === 'activo'), error: e => this.mostrarError(e, 'No se pudieron cargar los clientes.') });
    this.productoService.listar().subscribe({ next: data => this.productos = data.filter(p => p.stockProducto > 0 && p.estado.descripcion.toLowerCase() === 'activo'), error: e => this.mostrarError(e, 'No se pudieron cargar los productos.') });
  }

  agregarProducto(): void {
    if (this.productoSeleccionado === 0 || this.cantidad <= 0) { this.mostrarMensaje('Seleccione un producto y una cantidad válida.', 'danger'); return; }
    const producto = this.obtenerProducto(this.productoSeleccionado);
    if (!producto || this.cantidad > producto.stockProducto) { this.mostrarMensaje('La cantidad supera el stock disponible.', 'danger'); return; }
    this.detalles.push({ idProducto: this.productoSeleccionado, cantidad: this.cantidad });
    this.productoSeleccionado = 0; this.cantidad = 1;
  }

  quitarDetalle(indice: number): void { this.detalles.splice(indice, 1); }
  obtenerProducto(id: number): Producto | undefined { return this.productos.find(p => p.idProducto === id); }
  calcularTotal(): number { return this.detalles.reduce((total, d) => { const p=this.obtenerProducto(d.idProducto); return total + ((p?.precioProducto ?? 0) * d.cantidad); }, 0); }

  registrarVenta(): void {
    if (this.clienteSeleccionado === 0 || this.detalles.length === 0) { this.mostrarMensaje('Seleccione un cliente y agregue al menos un producto.', 'danger'); return; }
    const request: VentaRequest = { idUsuario: this.clienteSeleccionado, detalles: this.detalles };
    this.comprobanteService.registrarVenta(request).subscribe({
      next: comprobante => { this.mostrarMensaje('Venta registrada correctamente. Comprobante #' + comprobante.numComprobante, 'success'); this.clienteSeleccionado=0; this.detalles=[]; this.cargarDatos(); },
      error: e => this.mostrarError(e, 'No se pudo registrar la venta.')
    });
  }

  mostrarMensaje(texto: string, tipo: string): void { this.mensaje=texto; this.tipoMensaje=tipo; setTimeout(() => this.mensaje='', 4000); }
  mostrarError(error: HttpErrorResponse, alternativo: string): void { this.mostrarMensaje(typeof error.error === 'string' ? error.error : alternativo, 'danger'); }
}
