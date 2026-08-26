import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (pool) return pool;

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = parseInt(process.env.DB_PORT || "3306", 10);

  if (!host || !user || !password || !database) {
    throw new Error("DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME must be configured");
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DB_PORT must be a valid TCP port");
  }

  const connectionLimit = Number.parseInt(process.env.DB_CONNECTION_LIMIT || "5", 10);
  if (!Number.isInteger(connectionLimit) || connectionLimit < 1) {
    throw new Error("DB_CONNECTION_LIMIT must be a positive integer");
  }

  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit,
    queueLimit: 0,
    connectTimeout: 10000,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  });

  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const dbPool = getDbPool();
  const [rows] = await dbPool.execute(sql, params);
  return rows as T;
}
