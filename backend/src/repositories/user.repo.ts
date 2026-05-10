import { prisma } from '../config/db';
import type { RegisterInput, UpdateProfileInput } from '../validators/auth.validator';

export const userRepo = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  create: (data: RegisterInput & { password: string }) =>
    prisma.user.create({ data }),

  update: (id: string, data: UpdateProfileInput) =>
    prisma.user.update({ where: { id }, data }),

  setOtp: (id: string, otp: string, expires: Date) =>
    prisma.user.update({
      where: { id },
      data: { emailOtp: otp, emailOtpExpires: expires },
    }),

  markEmailVerified: (id: string) =>
    prisma.user.update({
      where: { id },
      data: { emailVerified: true, emailOtp: null, emailOtpExpires: null },
    }),

  delete: (id: string) =>
    prisma.user.delete({ where: { id } }),
};
