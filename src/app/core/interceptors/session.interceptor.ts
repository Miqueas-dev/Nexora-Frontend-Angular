import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ModalService } from '../../shared/modal/modal.service';

export const sessionInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const modal = inject(ModalService);

  return next(request).pipe(
    catchError(error => {
      const esConsultaDeSesion = request.url.endsWith('/auth/me');
      const esLogin = request.url.endsWith('/auth/login');
      const esRegistro = request.url.endsWith('/auth/registro-cliente');
      if (error instanceof HttpErrorResponse && error.status === 401 && !esConsultaDeSesion && !esLogin && !esRegistro) {
        modal.warning('Sesión finalizada', 'Tu sesión de Nexora ya no se encuentra activa. Vuelve a iniciar sesión para continuar.');
        router.navigate([router.url.startsWith('/app') ? '/backoffice/login' : '/login']);
      }
      return throwError(() => error);
    })
  );
};
