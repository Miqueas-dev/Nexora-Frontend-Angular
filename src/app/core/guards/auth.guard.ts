import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const loginRoute = (route.data?.['loginRoute'] as string | undefined) ?? '/login';
  return auth.cargarSesion().pipe(
    map(usuario => usuario ? true : router.createUrlTree([loginRoute]))
  );
};
