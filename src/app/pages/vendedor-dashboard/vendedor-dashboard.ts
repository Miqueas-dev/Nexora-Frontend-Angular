import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { UsuarioService } from '../../services/usuario.service';
import { ComprobanteService } from '../../services/comprobante.service';

@Component({ selector: 'app-vendedor-dashboard', standalone: true, imports: [CommonModule], templateUrl: './vendedor-dashboard.html' })
export class VendedorDashboard implements OnInit {
  clientes: number = 0;
  productosDisponibles: number = 0;
  misVentas: number = 0;

  constructor(private usuarioService: UsuarioService, private productoService: ProductoService, private comprobanteService: ComprobanteService) { }

  ngOnInit(): void {
    this.usuarioService.listarClientes().subscribe({ next: data => this.clientes = data.length, error: error => console.error(error) });
    this.productoService.listar().subscribe({ next: data => this.productosDisponibles = data.filter(p => p.stockProducto > 0 && p.estado.descripcion.toLowerCase() === 'activo').length, error: error => console.error(error) });
    this.comprobanteService.misVentas().subscribe({ next: data => this.misVentas = data.length, error: error => console.error(error) });
  }
}
