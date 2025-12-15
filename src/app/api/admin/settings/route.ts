import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { SiteConfig } from '@/lib/db/types';

/**
 * GET /api/admin/settings
 * Obtiene toda la configuración del sitio
 */
export async function GET() {
  try {
    const result = await query<SiteConfig>(
      `SELECT * FROM site_config ORDER BY config_key ASC`
    );

    // Transformar a objeto key-value
    const settings: Record<string, string> = {};
    result.rows.forEach(row => {
      settings[row.config_key] = row.config_value || '';
    });

    return NextResponse.json({
      success: true,
      data: result.rows,
      settings: settings,
    });

  } catch (error) {
    console.error('Error al obtener configuración:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 * Actualiza múltiples configuraciones a la vez
 * Body: { settings: { key: value, ... } }
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Se requiere un objeto "settings"' },
        { status: 400 }
      );
    }

    const updated: string[] = [];
    const created: string[] = [];

    for (const [key, value] of Object.entries(settings)) {
      // Intentar actualizar
      const updateResult = await query(
        `UPDATE site_config 
         SET config_value = $1, updated_at = CURRENT_TIMESTAMP
         WHERE config_key = $2
         RETURNING config_key`,
        [value as string, key]
      );

      if (updateResult.rowCount && updateResult.rowCount > 0) {
        updated.push(key);
      } else {
        // Si no existe, crear
        await query(
          `INSERT INTO site_config (config_key, config_value, config_type)
           VALUES ($1, $2, 'text')`,
          [key, value as string]
        );
        created.push(key);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      updated: updated,
      created: created,
    });

  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings
 * Crear una nueva configuración
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { config_key, config_value, config_type, description } = body;

    if (!config_key) {
      return NextResponse.json(
        { success: false, error: 'La clave de configuración es obligatoria' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO site_config (config_key, config_value, config_type, description)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (config_key) DO UPDATE SET
         config_value = EXCLUDED.config_value,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [config_key, config_value || '', config_type || 'text', description || null]
    );

    return NextResponse.json({
      success: true,
      message: 'Configuración guardada exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al guardar configuración:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
