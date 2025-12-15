import { Pool } from 'pg';

// Configuración del pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Función para ejecutar queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Ejecutada query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error en query de base de datos:', error);
    throw error;
  }
}

// Función para obtener un cliente del pool (para transacciones)
export async function getClient() {
  return await pool.connect();
}

// Cerrar el pool (útil para testing)
export async function closePool() {
  await pool.end();
}

export default pool;
