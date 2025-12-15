import { Pool, PoolClient, QueryResult } from 'pg';

// Singleton pattern para la conexión a PostgreSQL
let pool: Pool | null = null;

/**
 * Obtiene o crea una instancia del pool de conexiones a PostgreSQL
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 20, // Máximo de conexiones en el pool
      idleTimeoutMillis: 30000, // Tiempo antes de cerrar una conexión inactiva
      connectionTimeoutMillis: 2000, // Tiempo máximo de espera para obtener una conexión
    });

    // Manejar errores del pool
    pool.on('error', (err) => {
      console.error('Error inesperado en el pool de PostgreSQL:', err);
    });
  }

  return pool;
}

/**
 * Ejecuta una consulta SQL con parámetros
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('Consulta ejecutada:', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('Error en consulta SQL:', error);
    throw error;
  }
}

/**
 * Obtiene una conexión del pool para ejecutar transacciones
 */
export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  return await pool.connect();
}

/**
 * Ejecuta una transacción
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Cierra el pool de conexiones (útil para testing o shutdown graceful)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Verifica si la conexión a la base de datos está funcionando
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('Conexión a PostgreSQL exitosa:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error);
    return false;
  }
}

// Tipos de utilidad para resultados de queries comunes
export interface DbResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Helper para manejar errores de base de datos de forma consistente
 */
export function handleDbError(error: any): DbResult<never> {
  console.error('Error de base de datos:', error);
  
  // Errores comunes de PostgreSQL
  if (error.code === '23505') {
    return { success: false, error: 'El registro ya existe (duplicado)' };
  }
  
  if (error.code === '23503') {
    return { success: false, error: 'Violación de clave foránea' };
  }
  
  if (error.code === '23502') {
    return { success: false, error: 'Campo obligatorio faltante' };
  }
  
  return { 
    success: false, 
    error: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Error al procesar la solicitud' 
  };
}
