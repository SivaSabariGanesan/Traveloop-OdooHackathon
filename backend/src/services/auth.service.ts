import { userRepo } from '../repositories/user.repo';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/hash';
import { AppError } from '../utils/AppError';
import { emailService } from './email.service';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const authService = {
  register: async (data: RegisterInput) => {
    const exists = await userRepo.findByEmail(data.email);

    if (exists) {
      await hashPassword('dummy-password-to-prevent-timing-attack');
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepo.create({ ...data, password: hashedPassword });

    const otp = generateOtp();
    const expires = new Date(Date.now() + OTP_TTL_MS);
    await userRepo.setOtp(user.id, otp, expires);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n🔑 DEV OTP for ${user.email}: ${otp}\n`);
    }

    emailService.sendOtpEmail(user.email, otp, user.firstName).catch((err) =>
      console.error('Failed to send OTP email:', err)
    );

    return { message: 'Registration successful. Check your email for the verification code.', email: user.email };
  },

  verifyOtp: async (email: string, otp: string) => {
    const user = await userRepo.findByEmail(email);

    if (!user) throw new AppError('User not found', 404);
    if (user.emailVerified) throw new AppError('Email is already verified', 400);
    if (!user.emailOtp || !user.emailOtpExpires) throw new AppError('No OTP found. Please request a new one.', 400);
    if (user.emailOtpExpires < new Date()) throw new AppError('OTP has expired. Please request a new one.', 400);
    if (user.emailOtp !== otp.trim()) throw new AppError('Invalid OTP', 400);

    await userRepo.markEmailVerified(user.id);
    return { message: 'Email verified successfully' };
  },

  resendOtp: async (email: string) => {
    const user = await userRepo.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!user || user.emailVerified) {
      return { message: 'If that email exists and is unverified, a new code has been sent' };
    }

    const otp = generateOtp();
    const expires = new Date(Date.now() + OTP_TTL_MS);
    await userRepo.setOtp(user.id, otp, expires);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n🔑 DEV resend OTP for ${user.email}: ${otp}\n`);
    }

    emailService.sendOtpEmail(user.email, otp, user.firstName).catch((err) =>
      console.error('Failed to resend OTP email:', err)
    );

    return { message: 'If that email exists and is unverified, a new code has been sent' };
  },

  login: async ({ email, password }: LoginInput) => {
    const user = await userRepo.findByEmail(email);

    const passwordToCompare = user?.password || '$2a$10$dummyhashtopreventtimingattack.invalidhashvalue';
    const isMatch = await comparePassword(password, passwordToCompare);

    if (!user || !isMatch) throw new AppError('Invalid credentials', 401);
    if (!user.emailVerified) throw new AppError('Please verify your email before logging in', 403);

    const { password: _, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken: signAccessToken({ id: user.id, role: user.role }),
      refreshToken: signRefreshToken({ id: user.id }),
    };
  },

  refreshAccessToken: async (refreshToken: string) => {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await userRepo.findById(decoded.id);
      if (!user) throw new AppError('User not found', 401);
      return { accessToken: signAccessToken({ id: user.id, role: user.role }) };
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  },
};
