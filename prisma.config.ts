import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  // Prisma schema location
  schema: 'prisma/schema.prisma',

  // Migrations directory
  migrations: {
    path: 'prisma/migrations',
  },

  // Database connection (Prisma 7+)
  // URL now configured here instead of schema.prisma
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
