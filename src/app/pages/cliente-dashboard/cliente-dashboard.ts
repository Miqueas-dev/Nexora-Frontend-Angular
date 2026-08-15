import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ComprobanteService } from '../../services/comprobante.service';

@Component({ selector: 'app-cliente-dashboard', standalone: true, imports: [CommonModule], templateUrl: './cliente-dashboard.html' })
export class ClienteDashboard implements OnInit {
  productosDisponibles: number = 0;
  compras: number = 0;

  constructor(private productoService: ProductoService, private comprobanteService: ComprobanteService) { }

  ngOnInit(): void {
    this.productoService.listar().subscribe({ next: data => this.productosDisponibles = data.filter(p => p.stockProducto > 0 && p.estado.descripcion.toLowerCase() === 'activo').length, error: error => console.error(error) });
    this.comprobanteService.misCompras().subscribe({ next: data => this.compras = data.length, error: error => console.error(error) });
  }
}
