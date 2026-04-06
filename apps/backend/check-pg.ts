import { existsSync } from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { Client } from 'pg';

// Carrega .env do monorepo (raiz) e de apps/backend, onde quer que o comando seja executado
const envCandidates = [
  path.join(process.cwd(), 'apps', 'backend', '.env'),
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), '..', '..', '.env'),
];
for (const p of envCandidates) {
  if (existsSync(p)) {
    config({ path: p, override: true });
  }
}

async function check() {
  if (!process.env.DATABASE_URL) {
    console.error(
      '[PG Check] DATABASE_URL não definida. Crie apps/backend/.env (ou .env na raiz do repo) com:\n' +
        'DATABASE_URL="postgresql://postgres:SENHA@db.<ref>.supabase.co:5432/postgres?schema=public&sslmode=require"'
    );
    process.exitCode = 1;
    return;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('[PG Check] Tentando conectar com:', process.env.DATABASE_URL?.replace(/:([^@]+)@/, ':****@'));
    await client.connect();
    console.log('[PG Check] Sucesso! Conexão estabelecida.');
    const res = await client.query('SELECT current_user, current_database();');
    console.log('[PG Check] Dados:', res.rows[0]);
    await client.end();
  } catch (err: any) {
    console.error('[PG Check] Erro na conexão:', err.message);
    if (err.message.includes('password authentication failed')) {
      console.error('[PG Check] Senha incorreta para o postgres.');
    }
    process.exitCode = 1;
  }
}

check();
