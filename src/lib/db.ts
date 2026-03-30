/**
 * Re-exporta todo desde el módulo unificado de PostgreSQL.
 * Este archivo existe para mantener compatibilidad con imports existentes:
 *   import { query } from '@/lib/db'
 *
 * El módulo real está en @/lib/db/postgres.
 */
export { query, getPool, getClient, closePool, handleDbError } from './db/postgres';
import { getPool } from './db/postgres';

export default getPool();
