import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { SiteConfig } from '@/lib/db/types';

/**
 * GET /api/settings
 * Obtiene la configuración general del sitio
 */
export async function GET() {
  try {
    const result = await query<SiteConfig>(
      `SELECT 
        id,
        config_key,
        config_value,
        config_type,
        description,
        updated_at
      FROM site_config
      ORDER BY config_key ASC`
    );

    // Transformar a objeto key-value para fácil acceso
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
      {
        success: false,
        error: errorResult.error || 'Error al obtener la configuración',
      },
      { status: 500 }
    );
  }
}
