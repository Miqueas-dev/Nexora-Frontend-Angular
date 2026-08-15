import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Comprobante } from '../../models/comprobante';
import { ComprobanteService } from '../../services/comprobante.service';

@Component({ selector: 'app-ventas-admin', standalone: true, imports: [CommonModule], templateUrl: './ventas-admin.html' })
export class VentasAdmin implements OnInit {
  ventas: Comprobante[] = [];
  mensaje: string = '';
  constructor(private comprobanteService: ComprobanteService) { }
  ngOnInit(): void { this.comprobanteService.listarTodas().subscribe({ next: data => this.ventas = data, error: (e: HttpErrorResponse) => { this.mensaje = typeof e.error === 'string' ? e.error : 'No se pudieron cargar las ventas.'; } }); }
}
