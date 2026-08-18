import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ComprobanteResponse, Producto, Usuario } from '../../../models/nexora.models';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ProductoService } from '../../../core/services/producto.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';

@Component({
  selector: 'app-vendedor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendedorDashboard implements OnInit {
  productos: Producto[] = [];
  clientes: Usuario[] = [];
  ventas: ComprobanteResponse[] = [];
  cargando = true;

  constructor(
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private comprobanteService: ComprobanteService,
    private modal: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin({ productos: this.productoService.listar(), clientes: this.usuarioService.listarClientes(), ventas: this.comprobanteService.misVentas() }).subscribe({
      next: data => { this.productos = data.productos; this.clientes = data.clientes; this.ventas = data.ventas; this.cargando = false; this.cdr.markForCheck(); },
      error: error => { this.cargando = false; this.modal.error('No se pudo cargar el panel', getApiErrorMessage(error, 'Intenta nuevamente.')); this.cdr.markForCheck(); }
    });
  }

  get totalVendido(): number { return this.ventas.reduce((sum, v) => sum + Number(v.total || 0), 0); }
  get productosDisponibles(): number { return this.productos.filter(p => p.stockProducto > 0 && p.estado?.descripcion?.toLowerCase() === 'activo').length; }
  get clientesActivos(): number { return this.clientes.filter(c => c.estado?.descripcion?.toLowerCase() === 'activo').length; }
  get recientes(): ComprobanteResponse[] { return [...this.ventas].sort((a,b)=>b.numComprobante-a.numComprobante).slice(0,5); }
}
