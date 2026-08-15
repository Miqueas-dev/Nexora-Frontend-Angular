import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Comprobante } from '../../models/comprobante';
import { ComprobanteService } from '../../services/comprobante.service';

@Component({ selector: 'app-mis-compras', standalone: true, imports: [CommonModule], templateUrl: './mis-compras.html' })
export class MisCompras implements OnInit {
  compras: Comprobante[] = [];
  constructor(private comprobanteService: ComprobanteService) { }
  ngOnInit(): void { this.comprobanteService.misCompras().subscribe({ next:data=>this.compras=data, error:error=>console.error(error) }); }
}
