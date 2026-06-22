import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ApiError } from './api-helpers';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

function getJwtSecret(): Secret {
  const secret = process.env.JWT_SECRET;

  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET deve ser configurado no ambiente de produção');
  }

  return 'development-only-secret';
}

export function generateToken(payload: TokenPayload) {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    throw new ApiError('Token invalido', 401, 'INVALID_TOKEN');
  }
}

export function decodeToken(token: string) {
  return jwt.decode(token) as TokenPayload;
}
