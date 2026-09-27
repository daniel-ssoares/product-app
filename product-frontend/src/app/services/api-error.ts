import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'Não foi possível concluir a operação.';
  if (error.status === 0) return 'Não foi possível conectar ao catálogo. Verifique a conexão e tente novamente.';
  const body = error.error;
  if (body && typeof body === 'object') {
    if (body.errors && typeof body.errors === 'object') {
      const messages = Object.values(body.errors).flat().filter((value): value is string => typeof value === 'string');
      if (messages.length) return messages.join(' ');
    }
    if (typeof body.detail === 'string') return body.detail;
    if (typeof body.title === 'string') return body.title;
  }
  return 'Não foi possível concluir a operação. Tente novamente.';
}
