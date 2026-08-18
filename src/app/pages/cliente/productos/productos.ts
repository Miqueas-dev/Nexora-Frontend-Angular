import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Producto } from '../../../models/nexora.models';
import { ProductoService } from '../../../core/services/producto.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { getApiErrorMessage } from '../../../core/services/error-message';
import { productImageUrl, useProductImageFallback } from '../../../utils/product-image';
import { Pagination } from '../../../shared/pagination/pagination';

@Component({ selector:'app-productos-cliente', standalone:true, imports:[CommonModule, Pagination], templateUrl:'./productos.html', changeDetection:ChangeDetectionStrategy.OnPush })
export class ProductosCliente implements OnInit {
  productos: Producto[] = [];
  filtro = '';
  soloDisponibles = true;
  cargando = true;
  page = 1;
  readonly pageSize = 8;

  constructor(private service:ProductoService,private modal:ModalService,private cdr:ChangeDetectorRef){}

  ngOnInit():void{
    this.service.listar().subscribe({
      next:d=>{this.productos=d;this.cargando=false;this.cdr.markForCheck();},
      error:e=>{this.cargando=false;this.modal.error('No se pudo cargar el catálogo',getApiErrorMessage(e,'Intenta nuevamente.'));this.cdr.markForCheck();}
    });
  }

  get filtrados():Producto[]{
    const q=this.filtro.trim().toLowerCase();
    return this.productos.filter(p=>(!this.soloDisponibles||(p.estado?.descripcion?.toLowerCase()==='activo'&&p.stockProducto>0))&&(!q||`${p.descripProducto} ${p.marca?.marcaDesc}`.toLowerCase().includes(q)));
  }

  get productosPagina(): Producto[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtrados.slice(start, start + this.pageSize);
  }

  cambiarFiltro(value:string):void{this.filtro=value;this.page=1;}
  cambiarDisponibilidad():void{this.soloDisponibles=!this.soloDisponibles;this.page=1;}
  stockTexto(p:Producto):string{return p.stockProducto===0?'Sin stock':p.stockProducto<=5?'Últimas unidades':'Disponible';}
  imagenProducto(producto:Producto):string{return productImageUrl(producto);}
  imagenFallback(event:Event):void{useProductImageFallback(event);}
}
