import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Supabase e outros Postgres na nuvem exigem TLS; localhost costuma não usar SSL. */
function sslForDatabaseUrl(url: string): undefined | { rejectUnauthorized: boolean } {
  try {
    const normalized = url.replace(/^postgresql:/i, 'http:');
    const host = new URL(normalized).hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
      return undefined;
    }
  } catch {
    /* URL inválida: deixa o driver tentar */
  }
  return { rejectUnauthorized: false };
}

/** `pg` v8+ trata sslmode=require na URL como verify-full; removemos e usamos `ssl` do Pool. */
function connectionStringForPgDriver(url: string): string {
  try {
    const parsed = new URL(url.replace(/^postgresql:/i, 'http:'));
    parsed.searchParams.delete('sslmode');
    return parsed.toString().replace(/^http:/i, 'postgresql:');
  } catch {
    return url;
  }
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não está configurada');
  }

  const rawUrl = process.env.DATABASE_URL;
  const pool = new pg.Pool({
    connectionString: connectionStringForPgDriver(rawUrl),
    ssl: sslForDatabaseUrl(rawUrl),
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
