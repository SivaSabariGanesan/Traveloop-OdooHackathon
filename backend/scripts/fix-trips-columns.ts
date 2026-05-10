import { prisma } from '../src/config/db';

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS destination TEXT`);
  await prisma.$executeRawUnsafe(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS budget DOUBLE PRECISION`);
  console.log('✅ Columns added successfully');
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
