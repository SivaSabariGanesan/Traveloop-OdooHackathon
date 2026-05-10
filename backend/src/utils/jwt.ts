import jwt, { type SignOptions } from 'jsonwebtoken';

// CRITICAL: No fallback values for JWT secrets - fail fast if not configured
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not defined. Application cannot start.');
}

if (!JWT_REFRESH_SECRET) {
  throw new Error('FATAL: JWT_REFRESH_SECRET environment variable is not defined. Application cannot start.');
}

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '15m') as string; // Shorter for security
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string;

export const signAccessToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
};

export const signRefreshToken = (payload: object): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as SignOptions);
};

export const verifyToken = (token: string, secret: string = JWT_SECRET) =>
  jwt.verify(token, secret) as { id: string; role: string };

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
