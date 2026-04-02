import path from 'path';
import { config } from 'dotenv';
import { defineConfig } from "prisma/config";

// Carregar .env da raiz do monorepo (apenas local)
if (process.env.NODE_ENV !== 'production') {
  config({ path: path.join(__dirname, '../../.env') });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
