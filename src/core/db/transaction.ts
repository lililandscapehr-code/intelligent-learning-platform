import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { getDbPool } from "./connection";

export async function withTransaction<T>(operation: (connection: PoolConnection) => Promise<T>): Promise<T> {
  const connection = await getDbPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await operation(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function executeTransaction(connection: PoolConnection, sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
  const [result] = await connection.execute<ResultSetHeader>(sql, params as any);
  return result;
}