/**
 * Script para crear el primer usuario administrador.
 * Uso: node scripts/create-admin.mjs
 *
 * Requiere las variables de entorno de la base de datos (.env.development.local)
 * o las puedes pasar directamente al ejecutar:
 *   DB_HOST=localhost DB_PORT=5432 DB_NAME=parroquia_dev DB_USER=postgres DB_PASSWORD=tu_pass node scripts/create-admin.mjs
 */

import pg from "pg";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// Cargar .env.development.local si existe
function loadEnv() {
  const envFiles = [".env.development.local", ".env.local", ".env"];
  for (const file of envFiles) {
    const path = resolve(projectRoot, file);
    if (existsSync(path)) {
      console.log(`📄 Cargando variables de: ${file}`);
      const content = readFileSync(path, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const [key, ...rest] = trimmed.split("=");
        if (key && rest.length > 0) {
          process.env[key.trim()] = rest.join("=").trim();
        }
      }
      return true;
    }
  }
  return false;
}

loadEnv();

// ============================================
// CONFIGURACIÓN DEL USUARIO A CREAR
// ============================================
const ADMIN_EMAIL = "admin@parroquiaicm.com";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_NAME = "Administrador";
const ADMIN_ROLE = "admin";
// ============================================

async function main() {
  console.log("\n🔧 Creando usuario administrador...\n");

  // Determinar configuración de conexión
  const poolConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "parroquia_dev",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
      };

  console.log("📡 Conectando a la base de datos...");
  console.log(`   Host: ${poolConfig.host || "(DATABASE_URL)"}`);
  console.log(`   Database: ${poolConfig.database || "(DATABASE_URL)"}`);
  console.log(`   User: ${poolConfig.user || "(DATABASE_URL)"}`);

  const pool = new pg.Pool(poolConfig);

  try {
    // Verificar conexión
    await pool.query("SELECT NOW()");
    console.log("✅ Conexión exitosa\n");

    // Verificar si la tabla existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'admin_users'
      )
    `);

    if (!tableCheck.rows[0].exists) {
      console.log("❌ La tabla admin_users no existe.");
      console.log(
        "   Ejecuta primero el schema: database/schema-definitivo.sql",
      );
      process.exit(1);
    }

    // Verificar si el usuario ya existe
    const existing = await pool.query(
      "SELECT id, email, name FROM admin_users WHERE email = $1",
      [ADMIN_EMAIL],
    );

    if (existing.rows.length > 0) {
      console.log(
        `⚠️  El usuario "${ADMIN_EMAIL}" ya existe (ID: ${existing.rows[0].id})`,
      );
      console.log("   Actualizando contraseña...");

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await pool.query(
        "UPDATE admin_users SET password_hash = $1, is_active = true, updated_at = CURRENT_TIMESTAMP WHERE email = $2",
        [hash, ADMIN_EMAIL],
      );

      console.log("✅ Contraseña actualizada exitosamente\n");
    } else {
      // Crear usuario nuevo
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(ADMIN_PASSWORD, salt);

      const result = await pool.query(
        `INSERT INTO admin_users (email, password_hash, name, role, is_active)
         VALUES ($1, $2, $3, $4, true)
         RETURNING id`,
        [ADMIN_EMAIL, hash, ADMIN_NAME, ADMIN_ROLE],
      );

      console.log(
        `✅ Usuario creado exitosamente (ID: ${result.rows[0].id})\n`,
      );
    }

    console.log("╔══════════════════════════════════════════╗");
    console.log("║   CREDENCIALES DE ACCESO                 ║");
    console.log("╠══════════════════════════════════════════╣");
    console.log(`║   Email:      ${ADMIN_EMAIL.padEnd(26)}║`);
    console.log(`║   Contraseña: ${ADMIN_PASSWORD.padEnd(26)}║`);
    console.log("╠══════════════════════════════════════════╣");
    console.log("║   URL: http://localhost:3000/admin/login  ║");
    console.log("╚══════════════════════════════════════════╝");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Asegúrate de que PostgreSQL esté corriendo");
      console.log("   y que los datos de conexión sean correctos.");
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
