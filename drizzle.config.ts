import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const DB_URL = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!DB_URL)
  throw new Error("POSTGRES_URL or DATABASE_URL env variable not found");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: DB_URL,
  },
});
