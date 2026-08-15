import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Producto } from '../../models/producto';
import { Marca } from '../../models/marca';
import { Estado } from '../../models/estado';
import { ProductoService } from '../../services/producto.service';
import { MarcaService } from '../../services/marca.service';
import { EstadoService } from '../../services/estado.service';

@Component({ selector: 'app-productos', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './productos.html' })
export class Productos implements OnInit {
  productos: Producto[] = [];
  marcas: Marca[] = [];
  estados: Estado[] = [];
  idEditando: number = 0;
  descripcion: string = '';
  stock: number = 0;
  precio: number = 0;
  idMarca: number = 0;
  idEstado: number = 0;
  busqueda: string = '';
  nuevaMarca: string = '';
  mensaje: string = '';
  tipoMensaje: string = 'success';

  constructor(private productoService: ProductoService, private marcaService: MarcaService, private estadoService: EstadoService) { }

  ngOnInit(): void { this.cargarTodo(); }

  cargarTodo(): void {
    this.cargarProductos();
    this.marcaService.listar().subscribe({ next: data => this.marcas = data, error: e => this.mostrarError(e, 'No se pudieron cargar las marcas.') });
    this.estadoService.listar().subscribe({ next: data => this.estados = data, error: e => this.mostrarError(e, 'No se pudieron cargar los estados.') });
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({ next: data => this.productos = data, error: e => this.mostrarError(e, 'No se pudieron cargar los productos.') });
  }

  buscar(): void {
    if (!this.busqueda.trim()) { this.cargarProductos(); return; }
    this.productoService.buscarPorDescripcion(this.busqueda).subscribe({ next: data => this.productos = data, error: e => this.mostrarError(e, 'No se pudo realizar la búsqueda.') });
  }

  guardar(): void {
    if (!this.descripcion || this.precio <= 0 || this.stock < 0 || this.idMarca === 0 || this.idEstado === 0) {
      this.mostrarMensaje('Complete correctamente los datos del producto.', 'danger');
      return;
    }

    const producto: Producto = {
      descripProducto: this.descripcion,
      stockProducto: this.stock,
      precioProducto: this.precio,
      marca: { idMarca: this.idMarca, marcaDesc: '' },
      estado: { idEstado: this.idEstado, descripcion: '' }
    };

    if (this.idEditando === 0) {
      this.productoService.registrar(producto).subscribe({ next: () => { this.mostrarMensaje('Producto registrado correctamente.', 'success'); this.limpiar(); this.cargarProductos(); }, error: e => this.mostrarError(e, 'No se pudo registrar el producto.') });
    } else {
      this.productoService.actualizar(this.idEditando, producto).subscribe({ next: () => { this.mostrarMensaje('Producto actualizado correctamente.', 'success'); this.limpiar(); this.cargarProductos(); }, error: e => this.mostrarError(e, 'No se pudo actualizar el producto.') });
    }
  }

  editar(producto: Producto): void {
    this.idEditando = producto.idProducto ?? 0;
    this.descripcion = producto.descripProducto;
    this.stock = producto.stockProducto;
    this.precio = producto.precioProducto;
    this.idMarca = producto.marca.idMarca;
    this.idEstado = producto.estado.idEstado;
  }

  eliminar(producto: Producto): void {
    if (!producto.idProducto || !confirm('¿Desea eliminar el producto seleccionado?')) return;
    this.productoService.eliminar(producto.idProducto).subscribe({ next: () => { this.mostrarMensaje('Producto eliminado correctamente.', 'success'); this.cargarProductos(); }, error: e => this.mostrarError(e, 'No se pudo eliminar el producto.') });
  }

  registrarMarca(): void {
    if (!this.nuevaMarca.trim()) { this.mostrarMensaje('Ingrese la descripción de la marca.', 'danger'); return; }
    const marca: Marca = { idMarca: 0, marcaDesc: this.nuevaMarca };
    this.marcaService.registrar(marca).subscribe({ next: () => { this.mostrarMensaje('Marca registrada correctamente.', 'success'); this.nuevaMarca = ''; this.marcaService.listar().subscribe(data => this.marcas = data); }, error: e => this.mostrarError(e, 'No se pudo registrar la marca.') });
  }

  limpiar(): void { this.idEditando = 0; this.descripcion = ''; this.stock = 0; this.precio = 0; this.idMarca = 0; this.idEstado = 0; }
  mostrarMensaje(texto: string, tipo: string): void { this.mensaje = texto; this.tipoMensaje = tipo; setTimeout(() => this.mensaje = '', 3500); }
  mostrarError(error: HttpErrorResponse, alternativo: string): void { this.mostrarMensaje(typeof error.error === 'string' ? error.error : alternativo, 'danger'); }
}
