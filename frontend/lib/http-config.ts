/**
 * HTTP Client configuration and utilities
 */

export const httpConfig = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  headers: {
    'Content-Type': 'application/json',
  },
};

export const httpErrors = {
  401: 'Não autenticado',
  403: 'Sem permissão',
  404: 'Não encontrado',
  500: 'Erro no servidor',
  503: 'Serviço indisponível',
};

export function getErrorMessage(status: number): string {
  return httpErrors[status as keyof typeof httpErrors] || 'Erro desconhecido';
}
