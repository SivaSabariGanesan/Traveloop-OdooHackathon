import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);
    
    // Verify token - will throw if invalid/expired
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    // Log the actual error for debugging (in production, use proper logger)
    console.error('Authentication failed:', error instanceof Error ? error.message : 'Unknown error');
    
    // Always return generic message to prevent information leakage
    return res.status(401).json({ 
      status: 'error',
      message: 'Authentication failed' 
    });
  }
};
