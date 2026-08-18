import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ComprobanteResponse } from '../../../models/nexora.models';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';
import { Pagination } from '../../../shared/pagination/pagination';
import { ModalKeyboardDirective } from '../../../shared/modal/modal-keyboard.directive';

@Component({ selector: 'app-mis-ventas', standalone: true, imports: [CommonModule, Pagination, ModalKeyboardDirective], templateUrl: './mis-ventas.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class MisVentas implements OnInit {
  ventas: ComprobanteResponse[] = [];
  filtro=''; page=1; readonly pageSize = 5; cargando=true; detalle?: ComprobanteResponse;
  constructor(private service: ComprobanteService, private modal: ModalService, private cdr: ChangeDetectorRef){}
  ngOnInit(): void { this.cargar(); }
  get filtradas(): ComprobanteResponse[]{ const q=this.filtro.trim().toLowerCase(); const base=[...this.ventas].sort((a,b)=>b.numComprobante-a.numComprobante); return q?base.filter(v=>`${v.numComprobante} ${v.usuario.nombreUsuario} ${v.usuario.apepatUsuario}`.toLowerCase().includes(q)):base; }
  get pagina(): ComprobanteResponse[]{const start=(this.page-1)*this.pageSize;return this.filtradas.slice(start,start+this.pageSize);}
  cambiarFiltro(value:string):void{this.filtro=value;this.page=1;}
  get total(): number { return this.ventas.reduce((s,v)=>s+Number(v.total||0),0); }
  cargar(): void { this.service.misVentas().subscribe({next:data=>{this.ventas=data;this.cargando=false;this.cdr.markForCheck();},error:e=>{this.cargando=false;this.modal.error('No se pudieron cargar tus ventas',getApiErrorMessage(e,'Intenta nuevamente.'));this.cdr.markForCheck();}}); }
}
