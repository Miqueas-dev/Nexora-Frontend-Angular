import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-not-found', standalone: true, imports: [RouterLink], template: `<div class="nx-error-page"><span class="nx-error-code">404</span><h1>Esta ruta no existe</h1><p>No encontramos la página que intentas abrir dentro de Nexora.</p><a routerLink="/" class="btn nx-btn-primary"><svg class="nx-icon"><use href="/icons.svg#arrow-left"></use></svg> Ir al inicio</a></div>`, changeDetection: ChangeDetectionStrategy.OnPush })
export class NotFound {}
