import { userRepo } from '../repositories/user.repo';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/hash';
import { AppError } from '../utils/AppError';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

export const authService = {
  register: async (data: RegisterInput) => {
    const exists = await userRepo.findByEmail(data.email);
    
    if (exists) {
      // Prevent timing attacks - simulate hashing delay even when user exists
      await hashPassword('dummy-password-to-prevent-timing-attack');
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepo.create({ ...data, password: hashedPassword });

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken: signAccessToken({ id: user.id, role: user.role }),
      refreshToken: signRefreshToken({ id: user.id }),
    };
  },

  login: async ({ email, password }: LoginInput) => {
    const user = await userRepo.findByEmail(email);

    // Prevent timing attacks - always run bcrypt comparison
    const passwordToCompare = user?.password || '$2a$10$dummyhashtopreventtimingattack.invalidhashvalue';
    const isMatch = await comparePassword(password, passwordToCompare);

    if (!user || !isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken: signAccessToken({ id: user.id, role: user.role }),
      refreshToken: signRefreshToken({ id: user.id }),
    };
  },

  refreshAccessToken: async (refreshToken: string) => {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if user still exists
      const user = await userRepo.findById(decoded.id);
      if (!user) {
        throw new AppError('User not found', 401);
      }

      // Generate new access token
      const newAccessToken = signAccessToken({ id: user.id, role: user.role });

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      // Log error for debugging but return generic message
      console.error('Refresh token verification failed:', error);
      throw new AppError('Invalid or expired refresh token', 401);
    }
  },
};
