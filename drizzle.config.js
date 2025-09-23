import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './src/models/model.exporter.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
},
});