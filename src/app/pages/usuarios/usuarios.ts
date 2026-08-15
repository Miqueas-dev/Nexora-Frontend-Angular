import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '../../models/usuario';
import { Tipo } from '../../models/tipo';
import { Estado } from '../../models/estado';
import { UsuarioService } from '../../services/usuario.service';
import { TipoService } from '../../services/tipo.service';
import { EstadoService } from '../../services/estado.service';

@Component({ selector: 'app-usuarios', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './usuarios.html' })
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  tipos: Tipo[] = [];
  estados: Estado[] = [];
  idEditando: number = 0;
  dni: string = '';
  nombre: string = '';
  apepat: string = '';
  apemat: string = '';
  correo: string = '';
  clave: string = '';
  fechaNacimiento: string = '';
  idTipo: number = 0;
  idEstado: number = 0;
  mensaje: string = '';
  tipoMensaje: string = 'success';

  constructor(private usuarioService: UsuarioService, private tipoService: TipoService, private estadoService: EstadoService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.tipoService.listar().subscribe({ next: data => this.tipos = data, error: e => this.mostrarError(e, 'No se pudieron cargar los tipos.') });
    this.estadoService.listar().subscribe({ next: data => this.estados = data, error: e => this.mostrarError(e, 'No se pudieron cargar los estados.') });
  }

  cargarUsuarios(): void { this.usuarioService.listar().subscribe({ next: data => this.usuarios = data, error: e => this.mostrarError(e, 'No se pudieron cargar los usuarios.') }); }

  guardar(): void {
    if (!this.dni || !this.nombre || !this.apepat || !this.apemat || !this.correo || !this.fechaNacimiento || this.idTipo === 0 || this.idEstado === 0) {
      this.mostrarMensaje('Complete todos los campos obligatorios.', 'danger'); return;
    }
    if (this.idEditando === 0 && !this.clave) { this.mostrarMensaje('La contraseña es obligatoria para un usuario nuevo.', 'danger'); return; }

    const usuario: Usuario = {
      dniUsuario: this.dni,
      nombreUsuario: this.nombre,
      apepatUsuario: this.apepat,
      apematUsuario: this.apemat,
      correoUsuario: this.correo,
      claveUsuario: this.clave,
      fecnacUsuario: this.fechaNacimiento,
      tipo: { idTipo: this.idTipo, descripcion: '' },
      estado: { idEstado: this.idEstado, descripcion: '' }
    };

    if (this.idEditando === 0) {
      this.usuarioService.registrar(usuario).subscribe({ next: () => { this.mostrarMensaje('Usuario registrado correctamente.', 'success'); this.limpiar(); this.cargarUsuarios(); }, error: e => this.mostrarError(e, 'No se pudo registrar el usuario.') });
    } else {
      this.usuarioService.actualizar(this.idEditando, usuario).subscribe({ next: () => { this.mostrarMensaje('Usuario actualizado correctamente.', 'success'); this.limpiar(); this.cargarUsuarios(); }, error: e => this.mostrarError(e, 'No se pudo actualizar el usuario.') });
    }
  }

  editar(usuario: Usuario): void {
    this.idEditando = usuario.idUsuario ?? 0; this.dni = usuario.dniUsuario; this.nombre = usuario.nombreUsuario; this.apepat = usuario.apepatUsuario; this.apemat = usuario.apematUsuario; this.correo = usuario.correoUsuario; this.clave = ''; this.fechaNacimiento = usuario.fecnacUsuario.split('T')[0]; this.idTipo = usuario.tipo.idTipo; this.idEstado = usuario.estado.idEstado;
  }

  eliminar(usuario: Usuario): void {
    if (!usuario.idUsuario || !confirm('¿Desea eliminar el usuario seleccionado?')) return;
    this.usuarioService.eliminar(usuario.idUsuario).subscribe({ next: () => { this.mostrarMensaje('Usuario eliminado correctamente.', 'success'); this.cargarUsuarios(); }, error: e => this.mostrarError(e, 'No se pudo eliminar el usuario.') });
  }

  limpiar(): void { this.idEditando=0; this.dni=''; this.nombre=''; this.apepat=''; this.apemat=''; this.correo=''; this.clave=''; this.fechaNacimiento=''; this.idTipo=0; this.idEstado=0; }
  mostrarMensaje(texto: string, tipo: string): void { this.mensaje=texto; this.tipoMensaje=tipo; setTimeout(() => this.mensaje='', 3500); }
  mostrarError(error: HttpErrorResponse, alternativo: string): void { this.mostrarMensaje(typeof error.error === 'string' ? error.error : alternativo, 'danger'); }
}
