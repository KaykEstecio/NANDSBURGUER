import { NextRequest } from 'next/server';
import { ApiError } from './api-helpers';
import { verifyToken, TokenPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

export function extractToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('auth_token')?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
}

export function authenticateToken(request: NextRequest): TokenPayload {
  const token = extractToken(request);
  if (!token) {
    throw new ApiError('Nao autenticado', 401, 'UNAUTHORIZED');
  }

  return verifyToken(token);
}
