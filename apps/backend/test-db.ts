
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); // Adjust path to root .env

async function main() {
  console.log('[Test] Probando conexão com:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@'));

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('[Test] Tentando upsert de usuário...');
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: { displayName: 'Test User (Updated)' },
      create: {
        clerkId: 'user_test_123',
        email: 'test@example.com',
        displayName: 'Test User',
      },
    });
    console.log('[Test] Sucesso! Usuário:', user);
  } catch (error) {
    console.error('[Test] Erro:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
