import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { UsuarioService } from '../../services/usuario.service';
import { ComprobanteService } from '../../services/comprobante.service';

@Component({ selector: 'app-admin-dashboard', standalone: true, imports: [CommonModule], templateUrl: './admin-dashboard.html' })
export class AdminDashboard implements OnInit {
  totalProductos: number = 0;
  totalUsuarios: number = 0;
  totalVentas: number = 0;
  productosSinStock: number = 0;

  constructor(
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private comprobanteService: ComprobanteService
  ) { }

  ngOnInit(): void {
    this.productoService.listar().subscribe({ next: data => { this.totalProductos = data.length; this.productosSinStock = data.filter(p => p.stockProducto === 0).length; }, error: error => console.error(error) });
    this.usuarioService.listar().subscribe({ next: data => this.totalUsuarios = data.length, error: error => console.error(error) });
    this.comprobanteService.listarTodas().subscribe({ next: data => this.totalVentas = data.length, error: error => console.error(error) });
  }
}
