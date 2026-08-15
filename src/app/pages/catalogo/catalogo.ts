import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({ selector: 'app-catalogo', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './catalogo.html' })
export class Catalogo implements OnInit {
  productos: Producto[] = [];
  texto: string = '';
  constructor(private productoService: ProductoService) { }
  ngOnInit(): void { this.cargar(); }
  cargar(): void { this.productoService.listar().subscribe({ next: data => this.productos=data.filter(p=>p.estado.descripcion.toLowerCase()==='activo'), error: error => console.error(error) }); }
  buscar(): void { if(!this.texto.trim()){this.cargar();return;} this.productoService.buscarPorDescripcion(this.texto).subscribe({ next:data=>this.productos=data.filter(p=>p.estado.descripcion.toLowerCase()==='activo'), error:error=>console.error(error) }); }
}
