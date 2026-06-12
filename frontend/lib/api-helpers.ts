import { NextResponse } from 'next/server';

/**
 * API Response Helpers
 */

interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

interface ApiSuccessResponse<T> {
  data: T;
  success: true;
}

// Success responses
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data, success: true }, { status });
}

export function createdResponse<T>(data: T) {
  return NextResponse.json({ data, success: true }, { status: 201 });
}

// Error responses
export function errorResponse(
  message: string,
  status = 400,
  code?: string,
  details?: any
) {
  const response: ApiErrorResponse = { error: message };
  if (code) response.code = code;
  if (details) response.details = details;
  return NextResponse.json(response, { status });
}

export function unauthorizedResponse() {
  return errorResponse('Não autenticado', 401, 'UNAUTHORIZED');
}

export function forbiddenResponse() {
  return errorResponse('Sem permissão', 403, 'FORBIDDEN');
}

export function notFoundResponse(resource: string) {
  return errorResponse(`${resource} não encontrado`, 404, 'NOT_FOUND');
}

export function validationErrorResponse(details: any) {
  return errorResponse(
    'Dados inválidos',
    400,
    'VALIDATION_ERROR',
    details
  );
}

export function internalErrorResponse(message = 'Erro interno do servidor') {
  return errorResponse(message, 500, 'INTERNAL_ERROR');
}

/**
 * Type helpers
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
