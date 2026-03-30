import path from 'path';
import { config } from 'dotenv';
import { defineConfig, env } from "prisma/config";

// Carregar .env da raiz do monorepo
config({ path: path.join(__dirname, '../../.env') });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock",
  },
});
