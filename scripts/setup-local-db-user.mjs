import nextEnv from "@next/env";
import mysql from "mysql2/promise";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const required = ["DB_HOST", "DB_USER", "DB_PASSWORD"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const databaseName = process.env.DB_NAME || "educational_platform";
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  await connection.query("CREATE USER IF NOT EXISTS 'iamstudent'@'localhost' IDENTIFIED BY ?", [process.env.DB_PASSWORD]);
  await connection.query("ALTER USER 'iamstudent'@'localhost' IDENTIFIED BY ?", [process.env.DB_PASSWORD]);
  await connection.query(`GRANT ALL PRIVILEGES ON \`${databaseName}\`.* TO 'iamstudent'@'localhost'`);
  await connection.query("FLUSH PRIVILEGES");
  console.log("Local database user iamstudent is ready.");
} finally {
  await connection.end();
}