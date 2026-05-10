import { userRepo } from '../repositories/user.repo';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/hash';
import { AppError } from '../utils/AppError';
import { emailService } from './email.service';
import { randomBytes } from 'crypto';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

const generateVerificationToken = () => randomBytes(32).toString('hex');

export const authService = {
  register: async (data: RegisterInput) => {
    const exists = await userRepo.findByEmail(data.email);

    if (exists) {
      await hashPassword('dummy-password-to-prevent-timing-attack');
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepo.create({ ...data, password: hashedPassword });

    // Send verification email (non-blocking — don't fail registration if email fails)
    const token = generateVerificationToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await userRepo.setVerificationToken(user.id, token, expires);
    emailService.sendVerificationEmail(user.email, token, user.firstName).catch((err) =>
      console.error('Failed to send verification email:', err)
    );

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken: signAccessToken({ id: user.id, role: user.role }),
      refreshToken: signRefreshToken({ id: user.id }),
    };
  },

  verifyEmail: async (token: string) => {
    const user = await userRepo.findByVerificationToken(token);

    if (!user || !user.emailVerificationExpires) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    if (user.emailVerified) {
      throw new AppError('Email is already verified', 400);
    }

    if (user.emailVerificationExpires < new Date()) {
      throw new AppError('Verification token has expired', 400);
    }

    await userRepo.markEmailVerified(user.id);
    return { message: 'Email verified successfully' };
  },

  resendVerification: async (email: string) => {
    const user = await userRepo.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!user || user.emailVerified) return { message: 'If that email exists and is unverified, a new link has been sent' };

    const token = generateVerificationToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await userRepo.setVerificationToken(user.id, token, expires);

    emailService.sendVerificationEmail(user.email, token, user.firstName).catch((err) =>
      console.error('Failed to resend verification email:', err)
    );

    return { message: 'If that email exists and is unverified, a new link has been sent' };
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
