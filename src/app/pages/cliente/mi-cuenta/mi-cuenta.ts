import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({ selector:'app-mi-cuenta', standalone:true, imports:[CommonModule], templateUrl:'./mi-cuenta.html', changeDetection:ChangeDetectionStrategy.OnPush })
export class MiCuenta { readonly usuario$=inject(AuthService).usuario$; }
