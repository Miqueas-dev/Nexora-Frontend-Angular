import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DetalleVentaRequest, Producto, Usuario, VentaRequest } from '../../../models/nexora.models';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ProductoService } from '../../../core/services/producto.service';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';
import { calculateSaleTotal, mergeSaleLine } from '../../../utils/sale-utils';
import { LookupItem, LookupModal } from '../../../shared/lookup-modal/lookup-modal';

@Component({
  selector: 'app-nueva-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LookupModal],
  templateUrl: './nueva-venta.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NuevaVenta implements OnInit {
  private readonly fb = inject(FormBuilder);
  clientes: Usuario[] = [];
  productos: Producto[] = [];
  detalles: DetalleVentaRequest[] = [];
  cargando = true;
  guardando = false;
  selectorActivo: 'cliente' | 'producto' | null = null;

  readonly form = this.fb.nonNullable.group({
    idUsuario: [0, [Validators.required, Validators.min(1)]],
    idProducto: [0, [Validators.required, Validators.min(1)]],
    cantidad: [1, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]]
  });

  constructor(
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private comprobanteService: ComprobanteService,
    private modal: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin({ clientes: this.usuarioService.listarClientes(), productos: this.productoService.listar() }).subscribe({
      next: data => {
        this.clientes = data.clientes.filter(c => c.estado?.descripcion?.toLowerCase() === 'activo');
        this.productos = data.productos.filter(p => p.estado?.descripcion?.toLowerCase() === 'activo' && p.stockProducto > 0);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: error => { this.cargando = false; this.modal.error('No se pudo preparar la venta', getApiErrorMessage(error, 'No fue posible cargar clientes y productos.')); this.cdr.markForCheck(); }
    });
  }

  get productoSeleccionado(): Producto | undefined { return this.productos.find(p => p.idProducto === Number(this.form.controls.idProducto.value)); }
  get clienteSeleccionado(): Usuario | undefined { return this.clientes.find(c => c.idUsuario === Number(this.form.controls.idUsuario.value)); }
  get totalVista(): number { return calculateSaleTotal(this.detalles, this.productos); }
  get totalUnidades(): number { return this.detalles.reduce((sum, item) => sum + item.cantidad, 0); }
  get clienteItems(): LookupItem[] {
    return this.clientes.map(cliente => ({
      id: cliente.idUsuario ?? 0,
      title: `${cliente.nombreUsuario} ${cliente.apepatUsuario} ${cliente.apematUsuario}`,
      subtitle: `DNI ${cliente.dniUsuario} · ${cliente.correoUsuario}`,
      detail: cliente.tipo?.descripcion ?? 'Cliente',
      badge: 'Activo',
      icon: 'user'
    }));
  }
  get productoItems(): LookupItem[] {
    return this.productos.map(producto => ({
      id: producto.idProducto ?? 0,
      title: producto.descripProducto,
      subtitle: `${producto.marca?.marcaDesc ?? 'Sin marca'} · S/ ${Number(producto.precioProducto).toFixed(2)}`,
      detail: `Stock disponible: ${producto.stockProducto} unidades`,
      badge: `${producto.stockProducto} unid.`,
      icon: 'product'
    }));
  }

  abrirSelector(tipo: 'cliente' | 'producto'): void { this.selectorActivo = tipo; }
  cerrarSelector(): void { this.selectorActivo = null; }
  seleccionarLookup(item: LookupItem): void {
    if (this.selectorActivo === 'cliente') {
      this.form.controls.idUsuario.setValue(item.id);
      this.form.controls.idUsuario.markAsTouched();
    } else if (this.selectorActivo === 'producto') {
      this.form.controls.idProducto.setValue(item.id);
      this.form.controls.idProducto.markAsTouched();
    }
    this.selectorActivo = null;
  }

  agregarProducto(): void {
    const idProducto = Number(this.form.controls.idProducto.value);
    const cantidad = Number(this.form.controls.cantidad.value);
    const producto = this.productos.find(p => p.idProducto === idProducto);
    if (!producto || this.form.controls.idProducto.invalid || this.form.controls.cantidad.invalid) {
      this.form.controls.idProducto.markAsTouched(); this.form.controls.cantidad.markAsTouched();
      this.modal.warning('Producto incompleto', 'Selecciona un producto disponible e ingresa una cantidad entera mayor que cero.');
      return;
    }
    try {
      this.detalles = mergeSaleLine(this.detalles, idProducto, cantidad, producto.stockProducto);
      this.form.patchValue({ idProducto: 0, cantidad: 1 });
      this.cdr.markForCheck();
    } catch (error) {
      this.modal.warning('Cantidad no disponible', error instanceof Error ? error.message : 'Revisa el stock del producto.');
    }
  }

  quitarProducto(idProducto: number): void { this.detalles = this.detalles.filter(d => d.idProducto !== idProducto); this.cdr.markForCheck(); }
  obtenerProducto(id: number): Producto | undefined { return this.productos.find(p => p.idProducto === id); }

  crearRequest(): VentaRequest {
    return { idUsuario: Number(this.form.controls.idUsuario.value), detalles: this.detalles.map(d => ({ idProducto: d.idProducto, cantidad: d.cantidad })) };
  }

  registrarVenta(): void {
    if (this.form.controls.idUsuario.invalid) { this.form.controls.idUsuario.markAsTouched(); this.modal.warning('Selecciona un cliente', 'La venta debe estar asociada a un cliente activo.'); return; }
    if (!this.detalles.length) { this.modal.warning('Agrega productos', 'La venta debe contener al menos un producto.'); return; }
    this.guardando = true;
    this.comprobanteService.registrar(this.crearRequest()).subscribe({
      next: comprobante => {
        this.guardando = false;
        this.modal.success('Venta registrada', `Comprobante #${comprobante.numComprobante} registrado por S/ ${Number(comprobante.total).toFixed(2)}. El stock fue actualizado.`);
        this.detalles = [];
        this.form.reset({ idUsuario: 0, idProducto: 0, cantidad: 1 });
        this.recargarProductos();
      },
      error: error => { this.guardando = false; this.modal.error('No se pudo registrar la venta', getApiErrorMessage(error, 'El servidor rechazó la operación. Revisa cliente, productos y stock.')); this.cdr.markForCheck(); }
    });
  }

  private recargarProductos(): void {
    this.productoService.listar().subscribe({
      next: data => { this.productos = data.filter(p => p.estado?.descripcion?.toLowerCase() === 'activo' && p.stockProducto > 0); this.cdr.markForCheck(); },
      error: () => this.cdr.markForCheck()
    });
  }
}
