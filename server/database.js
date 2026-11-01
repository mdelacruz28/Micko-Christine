import { Pool } from 'pg';
let pool;
export function getPool(env = process.env) {
  if (!pool) {
    const url = new URL(env.DATABASE_URL || '');
    if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname.endsWith('.neon.tech')) throw new Error('Invalid database configuration');
    for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) url.searchParams.delete(key);
    pool = new Pool({ connectionString: url.href, ssl: { rejectUnauthorized: true }, max: 3,
      connectionTimeoutMillis: 5000, idleTimeoutMillis: 10000, statement_timeout: 8000 });
    pool.on('error', () => { /* Never log connection strings or guest data. */ });
  }
  return pool;
}
export function postgresDatabase(pool) {
  return {
    async transaction(fn) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query("SET LOCAL lock_timeout = '5s'");
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        throw error;
      } finally { client.release(); }
    }
  };
}
