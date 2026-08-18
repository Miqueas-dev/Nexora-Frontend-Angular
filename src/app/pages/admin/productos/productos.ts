import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Estado, Marca, Producto } from '../../../models/nexora.models';
import { EstadoService } from '../../../core/services/estado.service';
import { MarcaService } from '../../../core/services/marca.service';
import { ProductoService } from '../../../core/services/producto.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';
import { Pagination } from '../../../shared/pagination/pagination';
import { LookupItem, LookupModal } from '../../../shared/lookup-modal/lookup-modal';
import { ModalKeyboardDirective } from '../../../shared/modal/modal-keyboard.directive';
import { productImageUrl, useProductImageFallback } from '../../../utils/product-image';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Pagination, LookupModal, ModalKeyboardDirective],
  templateUrl: './productos.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosAdmin implements OnInit {
  private readonly fb = inject(FormBuilder);
  productos: Producto[] = [];
  marcas: Marca[] = [];
  estados: Estado[] = [];
  filtro = '';
  page = 1;
  readonly pageSize = 5;
  cargando = true;
  guardando = false;
  formularioVisible = false;
  editandoId?: number;
  selectorActivo: 'marca' | 'estado' | null = null;

  readonly form = this.fb.nonNullable.group({
    descripProducto: ['', [Validators.required, Validators.maxLength(45)]],
    stockProducto: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    precioProducto: [0, [Validators.required, Validators.min(0.01)]],
    idMarca: [0, [Validators.required, Validators.min(1)]],
    idEstado: [0, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private estadoService: EstadoService,
    private modal: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void { this.cargarTodo(); }

  get productosFiltrados(): Producto[] {
    const q = this.filtro.trim().toLowerCase();
    if (!q) return this.productos;
    return this.productos.filter(p => `${p.descripProducto} ${p.marca?.marcaDesc} ${p.estado?.descripcion}`.toLowerCase().includes(q));
  }

  get productosPagina(): Producto[] { const start = (this.page - 1) * this.pageSize; return this.productosFiltrados.slice(start, start + this.pageSize); }
  get marcaSeleccionada(): Marca | undefined { return this.marcas.find(item => item.idMarca === Number(this.form.controls.idMarca.value)); }
  get estadoSeleccionado(): Estado | undefined { return this.estados.find(item => item.idEstado === Number(this.form.controls.idEstado.value)); }
  get marcaItems(): LookupItem[] { return this.marcas.map(item => ({ id: item.idMarca ?? 0, title: item.marcaDesc, subtitle: 'Marca del catálogo Nexora', icon: 'brand' })); }
  get estadoItems(): LookupItem[] { return this.estados.map(item => ({ id: item.idEstado ?? 0, title: item.descripcion, subtitle: 'Estado del producto', icon: 'state' })); }

  cambiarFiltro(value: string): void { this.filtro = value; this.page = 1; }
  imagenProducto(producto: Producto): string { return productImageUrl(producto); }
  imagenFallback(event: Event): void { useProductImageFallback(event); }

  cargarTodo(): void {
    this.cargando = true;
    forkJoin({ productos: this.productoService.listar(), marcas: this.marcaService.listar(), estados: this.estadoService.listar() }).subscribe({
      next: data => {
        this.productos = data.productos;
        this.marcas = data.marcas;
        this.estados = data.estados;
        const totalPages = Math.max(1, Math.ceil(this.productosFiltrados.length / this.pageSize));
        this.page = Math.min(this.page, totalPages);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.cargando = false;
        this.modal.error('No se pudieron cargar los productos', getApiErrorMessage(error, 'Intenta nuevamente.'));
        this.cdr.markForCheck();
      }
    });
  }

  abrirNuevo(): void {
    this.editandoId = undefined;
    this.selectorActivo = null;
    this.form.reset({ descripProducto: '', stockProducto: 0, precioProducto: 0, idMarca: 0, idEstado: 0 });
    this.formularioVisible = true;
  }

  editar(producto: Producto): void {
    this.editandoId = producto.idProducto;
    this.selectorActivo = null;
    this.form.reset({
      descripProducto: producto.descripProducto,
      stockProducto: producto.stockProducto,
      precioProducto: Number(producto.precioProducto),
      idMarca: producto.marca?.idMarca ?? 0,
      idEstado: producto.estado?.idEstado ?? 0
    });
    this.formularioVisible = true;
  }

  abrirSelector(tipo: 'marca' | 'estado'): void { this.selectorActivo = tipo; }
  cerrarSelector(): void { this.selectorActivo = null; }

  seleccionarLookup(item: LookupItem): void {
    if (this.selectorActivo === 'marca') {
      this.form.controls.idMarca.setValue(item.id);
      this.form.controls.idMarca.markAsTouched();
    } else if (this.selectorActivo === 'estado') {
      this.form.controls.idEstado.setValue(item.id);
      this.form.controls.idEstado.markAsTouched();
    }
    this.selectorActivo = null;
  }

  cerrarFormulario(): void {
    if (this.guardando) return;
    this.selectorActivo = null;
    this.formularioVisible = false;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.modal.warning('Revisa el producto', 'Completa correctamente la descripción, stock, precio, marca y estado.');
      return;
    }
    const value = this.form.getRawValue();
    const payload: Producto = {
      descripProducto: value.descripProducto.trim(),
      stockProducto: Number(value.stockProducto),
      precioProducto: Number(value.precioProducto),
      marca: { idMarca: Number(value.idMarca), marcaDesc: '' },
      estado: { idEstado: Number(value.idEstado), descripcion: '' }
    };
    this.guardando = true;
    const request = this.editandoId ? this.productoService.actualizar(this.editandoId, payload) : this.productoService.registrar(payload);
    request.subscribe({
      next: () => {
        this.guardando = false;
        this.formularioVisible = false;
        this.modal.success(this.editandoId ? 'Producto actualizado' : 'Producto registrado', 'El producto se guardó correctamente en Nexora.');
        this.cargarTodo();
      },
      error: error => {
        this.guardando = false;
        this.modal.error('No se pudo guardar el producto', getApiErrorMessage(error, 'Revisa los datos e intenta nuevamente.'));
        this.cdr.markForCheck();
      }
    });
  }

  async eliminar(producto: Producto): Promise<void> {
    if (!producto.idProducto) return;
    const aceptar = await this.modal.confirm('Eliminar producto', `Se eliminará “${producto.descripProducto}”. Continúa solo si ya no debe formar parte del catálogo.`, 'Eliminar');
    if (!aceptar) return;
    this.productoService.eliminar(producto.idProducto).subscribe({
      next: () => { this.modal.success('Producto eliminado', 'El producto fue retirado del catálogo.'); this.cargarTodo(); },
      error: error => this.modal.error('No se pudo eliminar', getApiErrorMessage(error, 'El producto puede estar relacionado con comprobantes existentes.'))
    });
  }

  stockClass(stock: number): string { return stock === 0 ? 'danger' : stock <= 5 ? 'warning' : 'ok'; }
}
