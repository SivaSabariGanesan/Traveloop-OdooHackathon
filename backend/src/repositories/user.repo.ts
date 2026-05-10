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

  delete: (id: string) =>
    prisma.user.delete({ where: { id } }),
};
