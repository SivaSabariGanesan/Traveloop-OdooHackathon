import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

let _prisma: PrismaClient | null = null;

export const getPrisma = (): PrismaClient => {
  if (_prisma) return _prisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('FATAL: DATABASE_URL environment variable is not defined.');
  }

  const adapter = new PrismaPg({ connectionString });
  _prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  process.on('beforeExit', async () => {
    await _prisma?.$disconnect();
  });

  return _prisma;
};

// Proxy so existing `prisma.xxx` imports keep working unchanged
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});
