import fs from "fs";

// Load a local .env file when present (local development). In production,
// env vars are injected by the host and no .env file exists.
if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}
