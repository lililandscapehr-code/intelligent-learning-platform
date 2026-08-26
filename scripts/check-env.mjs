import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "JWT_SECRET"];
const missing = required.filter((name) => !process.env[name]);
const invalid = [];

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  invalid.push("JWT_SECRET must be at least 32 characters");
}

const port = Number(process.env.DB_PORT || 3306);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  invalid.push("DB_PORT must be a valid TCP port");
}

if (missing.length > 0 || invalid.length > 0) {
  if (missing.length > 0) console.error(`Missing environment variables: ${missing.join(", ")}`);
  for (const message of invalid) console.error(message);
  process.exit(1);
}

console.log("Environment configuration is present and structurally valid.");
