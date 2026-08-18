import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { RolNexora } from '../../models/nexora.models';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const permitidos = (route.data?.['roles'] ?? []) as RolNexora[];
  const loginRoute = (route.data?.['loginRoute'] as string | undefined) ?? '/login';
  return auth.cargarSesion().pipe(
    map(usuario => {
      if (!usuario) return router.createUrlTree([loginRoute]);
      return permitidos.includes(usuario.rol) ? true : router.createUrlTree(['/acceso-denegado']);
    })
  );
};
