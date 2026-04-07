import { existsSync } from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { Client } from 'pg';

// Carrega .env do monorepo (raiz) e de apps/backend, onde quer que o comando seja executado
const envFromShell = process.env.DATABASE_URL;
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
// DATABASE_URL passada no shell (ex.: teste rápido) não pode ser sobrescrita pelo .env
if (envFromShell) {
  process.env.DATABASE_URL = envFromShell;
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

  // Supabase: remover sslmode da URL para o driver `pg` (v8+ trata require como verify-full e ignora nosso ssl).
  const rawUrl = process.env.DATABASE_URL;
  let url = rawUrl;
  try {
    const parsed = new URL(rawUrl.replace(/^postgresql:/i, 'http:'));
    parsed.searchParams.delete('sslmode');
    url = parsed.toString().replace(/^http:/i, 'postgresql:');
  } catch {
    /* mantém rawUrl */
  }
  const isRemote =
    rawUrl.includes('supabase.com') ||
    rawUrl.includes('supabase.co') ||
    (!rawUrl.includes('localhost') && !rawUrl.includes('127.0.0.1'));
  const client = new Client({
    connectionString: url,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  });

  try {
    console.log('[PG Check] Tentando conectar com:', rawUrl.replace(/:([^@]+)@/, ':****@'));
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
