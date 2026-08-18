import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ComprobanteResponse } from '../../../models/nexora.models';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';
import { Pagination } from '../../../shared/pagination/pagination';
import { ModalKeyboardDirective } from '../../../shared/modal/modal-keyboard.directive';

@Component({ selector:'app-mis-compras', standalone:true, imports:[CommonModule,Pagination,ModalKeyboardDirective], templateUrl:'./mis-compras.html', changeDetection:ChangeDetectionStrategy.OnPush })
export class MisCompras implements OnInit {
  compras:ComprobanteResponse[]=[]; page=1; readonly pageSize = 5; cargando=true; detalle?:ComprobanteResponse;
  constructor(private service:ComprobanteService,private modal:ModalService,private cdr:ChangeDetectorRef){}
  ngOnInit():void{this.service.misCompras().subscribe({next:d=>{this.compras=d;this.cargando=false;this.cdr.markForCheck();},error:e=>{this.cargando=false;this.modal.error('No se pudieron cargar tus compras',getApiErrorMessage(e,'Intenta nuevamente.'));this.cdr.markForCheck();}});}
  get ordenadas():ComprobanteResponse[]{return [...this.compras].sort((a,b)=>b.numComprobante-a.numComprobante);}
  get pagina():ComprobanteResponse[]{const start=(this.page-1)*this.pageSize;return this.ordenadas.slice(start,start+this.pageSize);}
  get total():number{return this.compras.reduce((s,c)=>s+Number(c.total||0),0);}
}
