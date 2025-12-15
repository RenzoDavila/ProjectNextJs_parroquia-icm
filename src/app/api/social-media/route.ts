import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { SocialMedia } from '@/lib/db/types';

/**
 * GET /api/social-media
 * Obtiene las redes sociales activas
 */
export async function GET() {
  try {
    const result = await query<SocialMedia>(
      `SELECT 
        id,
        platform,
        platform_name,
        url,
        icon_name,
        display_order,
        is_active,
        show_in_header,
        show_in_footer
      FROM social_media
      WHERE is_active = true
      ORDER BY display_order ASC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error('Error al obtener redes sociales:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener las redes sociales',
      },
      { status: 500 }
    );
  }
}
