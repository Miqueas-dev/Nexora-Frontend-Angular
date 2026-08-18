import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ComprobanteResponse } from '../../../models/nexora.models';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';
import { Pagination } from '../../../shared/pagination/pagination';
import { ModalKeyboardDirective } from '../../../shared/modal/modal-keyboard.directive';

@Component({
  selector: 'app-ventas-admin',
  standalone: true,
  imports: [CommonModule, Pagination, ModalKeyboardDirective],
  templateUrl: './ventas.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VentasAdmin implements OnInit {
  ventas: ComprobanteResponse[] = [];
  filtro = '';
  page = 1;
  readonly pageSize = 5;
  cargando = true;
  detalle?: ComprobanteResponse;

  constructor(private service: ComprobanteService, private modal: ModalService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.cargar(); }

  get filtradas(): ComprobanteResponse[] {
    const q = this.filtro.trim().toLowerCase();
    const base = [...this.ventas].sort((a, b) => b.numComprobante - a.numComprobante);
    if (!q) return base;
    return base.filter(v => `#${v.numComprobante} ${v.numComprobante} ${v.usuario?.nombreUsuario} ${v.usuario?.apepatUsuario} ${v.vendedor?.nombreUsuario ?? ''}`.toLowerCase().includes(q));
  }
  get pagina(): ComprobanteResponse[] { const start=(this.page-1)*this.pageSize; return this.filtradas.slice(start,start+this.pageSize); }
  cambiarFiltro(value:string):void{this.filtro=value;this.page=1;}
  get total(): number { return this.ventas.reduce((sum, v) => sum + Number(v.total || 0), 0); }

  cargar(): void {
    this.cargando = true;
    this.service.listar().subscribe({
      next: data => { this.ventas = data; this.cargando = false; this.cdr.markForCheck(); },
      error: error => { this.cargando = false; this.modal.error('No se pudieron cargar las ventas', getApiErrorMessage(error, 'Intenta nuevamente.')); this.cdr.markForCheck(); }
    });
  }
  ver(venta: ComprobanteResponse): void { this.detalle = venta; }
  cerrarDetalle(): void { this.detalle = undefined; }
}
