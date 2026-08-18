import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Estado, Marca, Tipo } from '../../../models/nexora.models';
import { EstadoService } from '../../../core/services/estado.service';
import { MarcaService } from '../../../core/services/marca.service';
import { TipoService } from '../../../core/services/tipo.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';
import { ModalKeyboardDirective } from '../../../shared/modal/modal-keyboard.directive';
import { Pagination } from '../../../shared/pagination/pagination';

interface CatalogRow { id: number; descripcion: string; }
type CatalogTab = 'marcas' | 'estados' | 'tipos';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalKeyboardDirective, Pagination],
  templateUrl: './catalogos.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Catalogos implements OnInit {
  private readonly fb = inject(FormBuilder);
  tab: CatalogTab = 'marcas';
  filas: CatalogRow[] = [];
  cargando = true;
  guardando = false;
  formularioVisible = false;
  editandoId?: number;
  page = 1;
  readonly pageSize = 5;
  readonly form = this.fb.nonNullable.group({ descripcion: ['', [Validators.required, Validators.maxLength(45)]] });

  constructor(
    private marcas: MarcaService,
    private estados: EstadoService,
    private tipos: TipoService,
    private modal: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void { this.cargar(); }

  cambiarTab(tab: CatalogTab): void {
    this.tab = tab;
    this.page = 1;
    this.formularioVisible = false;
    const max = tab === 'marcas' ? 45 : 15;
    this.form.controls.descripcion.setValidators([Validators.required, Validators.maxLength(max)]);
    this.form.controls.descripcion.updateValueAndValidity();
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    const request = (this.tab === 'marcas' ? this.marcas.listar() : this.tab === 'estados' ? this.estados.listar() : this.tipos.listar()) as Observable<Array<Marca | Estado | Tipo>>;
    request.subscribe({
      next: data => {
        if (this.tab === 'marcas') {
          this.filas = (data as Marca[]).map(item => ({ id: item.idMarca ?? 0, descripcion: item.marcaDesc }));
        } else if (this.tab === 'estados') {
          this.filas = (data as Estado[]).map(item => ({ id: item.idEstado ?? 0, descripcion: item.descripcion }));
        } else {
          this.filas = (data as Tipo[]).map(item => ({ id: item.idTipo ?? 0, descripcion: item.descripcion }));
        }
        const totalPages = Math.max(1, Math.ceil(this.filas.length / this.pageSize));
        this.page = Math.min(this.page, totalPages);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.cargando = false;
        this.modal.error('No se pudo cargar el catálogo', getApiErrorMessage(error, 'Intenta nuevamente.'));
        this.cdr.markForCheck();
      }
    });
  }

  get filasPagina(): CatalogRow[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filas.slice(start, start + this.pageSize);
  }

  abrirNuevo(): void { this.editandoId = undefined; this.form.reset({ descripcion: '' }); this.formularioVisible = true; }
  editar(fila: CatalogRow): void { this.editandoId = fila.id; this.form.reset({ descripcion: fila.descripcion }); this.formularioVisible = true; }
  cerrar(): void { if (!this.guardando) this.formularioVisible = false; }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.modal.warning('Revisa la descripción', `La descripción es obligatoria y admite hasta ${this.tab === 'marcas' ? 45 : 15} caracteres.`);
      return;
    }
    const descripcion = this.form.controls.descripcion.value.trim();
    if (!descripcion) { this.modal.warning('Descripción vacía', 'Ingresa un valor antes de guardar.'); return; }
    this.guardando = true;
    let request: Observable<Marca | Estado | Tipo>;
    if (this.tab === 'marcas') request = this.editandoId ? this.marcas.actualizar(this.editandoId, { marcaDesc: descripcion }) : this.marcas.registrar({ marcaDesc: descripcion });
    else if (this.tab === 'estados') request = this.editandoId ? this.estados.actualizar(this.editandoId, { descripcion }) : this.estados.registrar({ descripcion });
    else request = this.editandoId ? this.tipos.actualizar(this.editandoId, { descripcion }) : this.tipos.registrar({ descripcion });

    request.subscribe({
      next: () => {
        this.guardando = false;
        this.formularioVisible = false;
        this.modal.success('Catálogo actualizado', `La información de ${this.nombreTab().toLowerCase()} se guardó correctamente.`);
        this.cargar();
      },
      error: error => {
        this.guardando = false;
        this.modal.error('No se pudo guardar', getApiErrorMessage(error, 'Revisa la información e intenta nuevamente.'));
        this.cdr.markForCheck();
      }
    });
  }

  async eliminar(fila: CatalogRow): Promise<void> {
    const aceptar = await this.modal.confirm(`Eliminar ${this.singularTab()}`, `Se intentará eliminar “${fila.descripcion}”. Si está en uso por otra información de Nexora, el servidor protegerá la relación.`, 'Eliminar');
    if (!aceptar) return;
    const request = (this.tab === 'marcas' ? this.marcas.eliminar(fila.id) : this.tab === 'estados' ? this.estados.eliminar(fila.id) : this.tipos.eliminar(fila.id)) as Observable<string>;
    request.subscribe({
      next: () => { this.modal.success('Registro eliminado', 'El elemento fue eliminado correctamente.'); this.cargar(); },
      error: error => this.modal.error('No se pudo eliminar', getApiErrorMessage(error, 'El registro se encuentra relacionado con otros datos de Nexora.'))
    });
  }

  nombreTab(): string { return this.tab === 'marcas' ? 'Marcas' : this.tab === 'estados' ? 'Estados' : 'Tipos de usuario'; }
  singularTab(): string { return this.tab === 'marcas' ? 'marca' : this.tab === 'estados' ? 'estado' : 'tipo de usuario'; }
  maxLength(): number { return this.tab === 'marcas' ? 45 : 15; }
}
