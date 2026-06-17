import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(message: string, status = 400, code = 'BAD_REQUEST', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function serializeValue(value: unknown): unknown {
  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeValue(item)])
    );
  }

  return value;
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data: serializeValue(data) },
    { status }
  );
}

export function createdResponse<T>(data: T) {
  return successResponse(data, 201);
}

export function errorResponse(
  message: string,
  status = 400,
  code?: string,
  details?: unknown
) {
  const response: ApiErrorResponse = { success: false, error: message };
  if (code) response.code = code;
  if (details) response.details = details;
  return NextResponse.json(response, { status });
}

export function unauthorizedResponse() {
  return errorResponse('Nao autenticado', 401, 'UNAUTHORIZED');
}

export function forbiddenResponse() {
  return errorResponse('Sem permissao', 403, 'FORBIDDEN');
}

export function notFoundResponse(resource: string) {
  return errorResponse(`${resource} nao encontrado`, 404, 'NOT_FOUND');
}

export function validationErrorResponse(details: unknown) {
  return errorResponse('Dados invalidos', 400, 'VALIDATION_ERROR', details);
}

export function internalErrorResponse(message = 'Erro interno do servidor') {
  return errorResponse(message, 500, 'INTERNAL_ERROR');
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return errorResponse(error.message, error.status, error.code, error.details);
  }

  if (error instanceof ZodError) {
    return validationErrorResponse(error.flatten());
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 400, 'BAD_REQUEST');
  }

  return internalErrorResponse();
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
