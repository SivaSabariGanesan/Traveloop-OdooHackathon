import jwt, { type SignOptions } from 'jsonwebtoken';

// Lazy initialization - secrets are validated when first accessed
let JWT_SECRET: string;
let JWT_REFRESH_SECRET: string;
let JWT_EXPIRES_IN: string;
let JWT_REFRESH_EXPIRES_IN: string;

function initializeSecrets() {
  if (JWT_SECRET) return; // Already initialized

  JWT_SECRET = process.env.JWT_SECRET || '';
  JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

  if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined. Application cannot start.');
  }

  if (!JWT_REFRESH_SECRET) {
    throw new Error('FATAL: JWT_REFRESH_SECRET environment variable is not defined. Application cannot start.');
  }

  JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
  JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
}

export const signAccessToken = (payload: object): string => {
  initializeSecrets();
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
};

export const signRefreshToken = (payload: object): string => {
  initializeSecrets();
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as SignOptions);
};

export const verifyToken = (token: string, secret?: string) => {
  initializeSecrets();
  return jwt.verify(token, secret || JWT_SECRET) as { id: string; role: string };
};

export const verifyRefreshToken = (token: string) => {
  initializeSecrets();
  return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
};
