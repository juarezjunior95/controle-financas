import { Client } from 'pg';
import 'dotenv/config';

async function check() {
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
  }
}

check();
