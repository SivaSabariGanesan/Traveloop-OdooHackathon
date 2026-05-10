import { prisma } from '../config/db';
import type { RegisterInput, UpdateProfileInput } from '../validators/auth.validator';

export const userRepo = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  findByVerificationToken: (token: string) =>
    prisma.user.findFirst({ where: { emailVerificationToken: token } }),

  create: (data: RegisterInput & { password: string }) =>
    prisma.user.create({ data }),

  update: (id: string, data: UpdateProfileInput) =>
    prisma.user.update({ where: { id }, data }),

  setVerificationToken: (id: string, token: string, expires: Date) =>
    prisma.user.update({
      where: { id },
      data: { emailVerificationToken: token, emailVerificationExpires: expires },
    }),

  markEmailVerified: (id: string) =>
    prisma.user.update({
      where: { id },
      data: { emailVerified: true, emailVerificationToken: null, emailVerificationExpires: null },
    }),

  delete: (id: string) =>
    prisma.user.delete({ where: { id } }),
};
