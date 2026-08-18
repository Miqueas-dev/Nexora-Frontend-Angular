import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Estado, Tipo, Usuario } from '../../../models/nexora.models';
import { EstadoService } from '../../../core/services/estado.service';
import { TipoService } from '../../../core/services/tipo.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';
import { Pagination } from '../../../shared/pagination/pagination';
import { LookupItem, LookupModal } from '../../../shared/lookup-modal/lookup-modal';
import { ModalKeyboardDirective } from '../../../shared/modal/modal-keyboard.directive';
import { toDateInputValue } from '../../../utils/date-input';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Pagination, LookupModal, ModalKeyboardDirective],
  templateUrl: './usuarios.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Usuarios implements OnInit {
  private readonly fb = inject(FormBuilder);
  usuarios: Usuario[] = [];
  tipos: Tipo[] = [];
  estados: Estado[] = [];
  filtro = '';
  page = 1;
  readonly pageSize = 5;
  cargando = true;
  guardando = false;
  formularioVisible = false;
  editandoId?: number;
  selectorActivo: 'tipo' | 'estado' | null = null;

  readonly form = this.fb.nonNullable.group({
    dniUsuario: ['', [Validators.required, Validators.pattern(/^\d{8}$/), Validators.maxLength(8)]],
    nombreUsuario: ['', [Validators.required, Validators.maxLength(25)]],
    apepatUsuario: ['', [Validators.required, Validators.maxLength(25)]],
    apematUsuario: ['', [Validators.required, Validators.maxLength(25)]],
    correoUsuario: ['', [Validators.required, Validators.email, Validators.maxLength(45)]],
    claveUsuario: [''],
    fecnacUsuario: ['', [Validators.required]],
    idTipo: [0, [Validators.required, Validators.min(1)]],
    idEstado: [0, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private usuarioService: UsuarioService,
    private tipoService: TipoService,
    private estadoService: EstadoService,
    private modal: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void { this.cargarTodo(); }

  get usuariosFiltrados(): Usuario[] {
    const q = this.filtro.trim().toLowerCase();
    if (!q) return this.usuarios;
    return this.usuarios.filter(u => `${u.dniUsuario} ${u.nombreUsuario} ${u.apepatUsuario} ${u.apematUsuario} ${u.correoUsuario} ${u.tipo?.descripcion}`.toLowerCase().includes(q));
  }

  get usuariosPagina(): Usuario[] {
    const start = (this.page - 1) * this.pageSize;
    return this.usuariosFiltrados.slice(start, start + this.pageSize);
  }

  get tipoSeleccionado(): Tipo | undefined { return this.tipos.find(item => item.idTipo === Number(this.form.controls.idTipo.value)); }
  get estadoSeleccionado(): Estado | undefined { return this.estados.find(item => item.idEstado === Number(this.form.controls.idEstado.value)); }
  get tipoItems(): LookupItem[] { return this.tipos.map(item => ({ id: item.idTipo ?? 0, title: item.descripcion, subtitle: 'Perfil de acceso Nexora', icon: 'type' })); }
  get estadoItems(): LookupItem[] { return this.estados.map(item => ({ id: item.idEstado ?? 0, title: item.descripcion, subtitle: 'Estado de disponibilidad', icon: 'state' })); }

  cambiarFiltro(value: string): void { this.filtro = value; this.page = 1; }

  cargarTodo(): void {
    this.cargando = true;
    forkJoin({ usuarios: this.usuarioService.listar(), tipos: this.tipoService.listar(), estados: this.estadoService.listar() }).subscribe({
      next: data => {
        this.usuarios = data.usuarios;
        this.tipos = data.tipos;
        this.estados = data.estados;
        const totalPages = Math.max(1, Math.ceil(this.usuariosFiltrados.length / this.pageSize));
        this.page = Math.min(this.page, totalPages);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.cargando = false;
        this.modal.error('No se pudieron cargar los usuarios', getApiErrorMessage(error, 'Intenta nuevamente.'));
        this.cdr.markForCheck();
      }
    });
  }

  abrirNuevo(): void {
    this.editandoId = undefined;
    this.selectorActivo = null;
    this.form.reset({ dniUsuario: '', nombreUsuario: '', apepatUsuario: '', apematUsuario: '', correoUsuario: '', claveUsuario: '', fecnacUsuario: '', idTipo: 0, idEstado: 0 });
    this.form.controls.claveUsuario.setValidators([Validators.required]);
    this.form.controls.claveUsuario.updateValueAndValidity();
    this.formularioVisible = true;
  }

  editar(usuario: Usuario): void {
    this.editandoId = usuario.idUsuario;
    this.selectorActivo = null;
    this.form.reset({
      dniUsuario: usuario.dniUsuario,
      nombreUsuario: usuario.nombreUsuario,
      apepatUsuario: usuario.apepatUsuario,
      apematUsuario: usuario.apematUsuario,
      correoUsuario: usuario.correoUsuario,
      claveUsuario: '',
      fecnacUsuario: toDateInputValue(usuario.fecnacUsuario),
      idTipo: usuario.tipo?.idTipo ?? 0,
      idEstado: usuario.estado?.idEstado ?? 0
    });
    this.form.controls.claveUsuario.clearValidators();
    this.form.controls.claveUsuario.updateValueAndValidity();
    this.formularioVisible = true;
  }

  abrirSelector(tipo: 'tipo' | 'estado'): void { this.selectorActivo = tipo; }
  cerrarSelector(): void { this.selectorActivo = null; }

  seleccionarLookup(item: LookupItem): void {
    if (this.selectorActivo === 'tipo') {
      this.form.controls.idTipo.setValue(item.id);
      this.form.controls.idTipo.markAsTouched();
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
    if (this.form.invalid || this.fechaFutura()) {
      this.form.markAllAsTouched();
      this.modal.warning('Revisa el formulario', 'Completa correctamente todos los campos obligatorios antes de guardar.');
      return;
    }
    const value = this.form.getRawValue();
    const payload: Usuario = {
      dniUsuario: value.dniUsuario.trim(),
      nombreUsuario: value.nombreUsuario.trim(),
      apepatUsuario: value.apepatUsuario.trim(),
      apematUsuario: value.apematUsuario.trim(),
      correoUsuario: value.correoUsuario.trim().toLowerCase(),
      claveUsuario: value.claveUsuario,
      fecnacUsuario: value.fecnacUsuario,
      tipo: { idTipo: Number(value.idTipo), descripcion: '' },
      estado: { idEstado: Number(value.idEstado), descripcion: '' }
    };
    this.guardando = true;
    const request = this.editandoId ? this.usuarioService.actualizar(this.editandoId, payload) : this.usuarioService.registrar(payload);
    request.subscribe({
      next: () => {
        this.guardando = false;
        this.formularioVisible = false;
        this.modal.success(this.editandoId ? 'Usuario actualizado' : 'Usuario registrado', 'La información del usuario se guardó correctamente en Nexora.');
        this.cargarTodo();
      },
      error: error => {
        this.guardando = false;
        this.modal.error('No se pudo guardar el usuario', getApiErrorMessage(error, 'Revisa los datos e intenta nuevamente.'));
        this.cdr.markForCheck();
      }
    });
  }

  async eliminar(usuario: Usuario): Promise<void> {
    if (!usuario.idUsuario) return;
    const aceptar = await this.modal.confirm('Eliminar usuario', `Se eliminará a ${usuario.nombreUsuario} ${usuario.apepatUsuario}. Esta acción solo será posible si no tiene operaciones asociadas.`, 'Eliminar');
    if (!aceptar) return;
    this.usuarioService.eliminar(usuario.idUsuario).subscribe({
      next: () => { this.modal.success('Usuario eliminado', 'El usuario fue retirado correctamente de Nexora.'); this.cargarTodo(); },
      error: error => this.modal.error('No se pudo eliminar', getApiErrorMessage(error, 'El usuario puede estar relacionado con otras operaciones.'))
    });
  }

  fechaFutura(): boolean {
    const value = this.form.controls.fecnacUsuario.value;
    return !!value && new Date(`${value}T00:00:00`).getTime() > new Date().setHours(0, 0, 0, 0);
  }

  nombreCompleto(usuario: Usuario): string { return `${usuario.nombreUsuario} ${usuario.apepatUsuario} ${usuario.apematUsuario}`; }
}
