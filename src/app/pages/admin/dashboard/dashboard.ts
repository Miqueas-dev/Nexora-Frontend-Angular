import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ComprobanteResponse, Producto, Usuario } from '../../../models/nexora.models';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ProductoService } from '../../../core/services/producto.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { MarcaService } from '../../../core/services/marca.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboard implements OnInit {
  cargando = true;
  usuarios: Usuario[] = [];
  productos: Producto[] = [];
  ventas: ComprobanteResponse[] = [];
  marcas = 0;

  constructor(
    private usuariosService: UsuarioService,
    private productosService: ProductoService,
    private comprobantesService: ComprobanteService,
    private marcasService: MarcaService,
    private modal: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin({
      usuarios: this.usuariosService.listar(),
      productos: this.productosService.listar(),
      ventas: this.comprobantesService.listar(),
      marcas: this.marcasService.listar()
    }).subscribe({
      next: data => {
        this.usuarios = data.usuarios;
        this.productos = data.productos;
        this.ventas = data.ventas;
        this.marcas = data.marcas.length;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.cargando = false;
        this.modal.error('No se pudo cargar el panel', getApiErrorMessage(error, 'Ocurrió un problema al consultar los indicadores de Nexora.'));
        this.cdr.markForCheck();
      }
    });
  }

  get totalVentas(): number { return this.ventas.reduce((sum, item) => sum + Number(item.total || 0), 0); }
  get productosActivos(): number { return this.productos.filter(p => p.estado?.descripcion?.toLowerCase() === 'activo').length; }
  get stockBajo(): Producto[] { return this.productos.filter(p => p.stockProducto <= 5).sort((a, b) => a.stockProducto - b.stockProducto).slice(0, 5); }
  get ventasRecientes(): ComprobanteResponse[] { return [...this.ventas].sort((a, b) => b.numComprobante - a.numComprobante).slice(0, 5); }
  get clientes(): number { return this.usuarios.filter(u => u.tipo?.descripcion?.toLowerCase() === 'cliente').length; }
  stockPorcentaje(producto: Producto): number { return Math.max(8, Math.min(100, (producto.stockProducto / 20) * 100)); }
}
