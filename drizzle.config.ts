import fs from "fs";
import { defineConfig } from "drizzle-kit";

if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
