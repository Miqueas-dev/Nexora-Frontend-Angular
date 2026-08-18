import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }
  if (error.error && typeof error.error === 'object' && 'text' in error.error && typeof error.error.text === 'string' && error.error.text.trim()) {
    return error.error.text;
  }
  if (error.status === 0) {
    return 'No se pudo conectar con Nexora. Verifica que el backend se encuentre iniciado en el puerto 8080.';
  }
  if (error.status === 401) {
    return 'Tu sesión no es válida o las credenciales son incorrectas.';
  }
  if (error.status === 403) {
    return 'Tu perfil no cuenta con permisos para realizar esta operación.';
  }
  if (error.status === 404) {
    return 'No se encontró el recurso solicitado.';
  }
  return fallback;
}
