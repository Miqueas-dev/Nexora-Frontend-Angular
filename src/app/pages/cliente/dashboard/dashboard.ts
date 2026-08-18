import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ProductoService } from '../../../core/services/producto.service';
import { getApiErrorMessage } from '../../../core/services/error-message';
import { ModalService } from '../../../shared/modal/modal.service';
import { ComprobanteResponse, Producto } from '../../../models/nexora.models';
import { productImageUrl, useProductImageFallback } from '../../../utils/product-image';

@Component({ selector:'app-cliente-dashboard', standalone:true, imports:[CommonModule,RouterLink], templateUrl:'./dashboard.html', changeDetection:ChangeDetectionStrategy.OnPush })
export class ClienteDashboard implements OnInit {
  readonly usuario$=inject(AuthService).usuario$;
  productos:Producto[]=[]; compras:ComprobanteResponse[]=[]; cargando=true;
  constructor(private productosService:ProductoService,private comprobantes:ComprobanteService,private modal:ModalService,private cdr:ChangeDetectorRef){}
  ngOnInit():void{forkJoin({productos:this.productosService.listar(),compras:this.comprobantes.misCompras()}).subscribe({next:d=>{this.productos=d.productos;this.compras=d.compras;this.cargando=false;this.cdr.markForCheck();},error:e=>{this.cargando=false;this.modal.error('No se pudo cargar tu portal',getApiErrorMessage(e,'Intenta nuevamente.'));this.cdr.markForCheck();}});}
  get disponibles():number{return this.productos.filter(p=>p.stockProducto>0&&p.estado?.descripcion?.toLowerCase()==='activo').length;}
  get recientes():ComprobanteResponse[]{return [...this.compras].sort((a,b)=>b.numComprobante-a.numComprobante).slice(0,4);}
  get ultimaCompra():ComprobanteResponse|undefined{return this.recientes[0];}
  get destacados():Producto[]{return this.productos.filter(p=>p.stockProducto>0&&p.estado?.descripcion?.toLowerCase()==='activo').slice(0,4);}
  imagenProducto(producto:Producto):string{return productImageUrl(producto);}
  imagenFallback(event:Event):void{useProductImageFallback(event);}
}
