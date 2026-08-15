import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Comprobante } from '../../models/comprobante';
import { ComprobanteService } from '../../services/comprobante.service';

@Component({ selector: 'app-mis-ventas', standalone: true, imports: [CommonModule], templateUrl: './mis-ventas.html' })
export class MisVentas implements OnInit {
  ventas: Comprobante[] = [];
  constructor(private comprobanteService: ComprobanteService) { }
  ngOnInit(): void { this.comprobanteService.misVentas().subscribe({ next: data => this.ventas=data, error: error => console.error(error) }); }
}
