import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload) {
  const secret: Secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

  return jwt.sign(payload, secret, {
    expiresIn
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    const secret: Secret = process.env.JWT_SECRET || 'secret';
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function decodeToken(token: string) {
  return jwt.decode(token) as TokenPayload;
}
