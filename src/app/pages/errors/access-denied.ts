import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-access-denied', standalone: true, imports: [RouterLink], template: `<div class="nx-error-page"><span class="nx-error-code">403</span><h1>Acceso restringido</h1><p>Tu perfil no tiene permisos para abrir esta sección de Nexora.</p><a routerLink="/" class="btn nx-btn-primary"><svg class="nx-icon"><use href="/icons.svg#arrow-left"></use></svg> Volver al inicio</a></div>`, changeDetection: ChangeDetectionStrategy.OnPush })
export class AccessDenied {}
