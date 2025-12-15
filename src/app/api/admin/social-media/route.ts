import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { SocialMedia } from '@/lib/db/types';

/**
 * GET /api/admin/social-media
 * Lista todas las redes sociales (incluyendo inactivas)
 */
export async function GET() {
  try {
    const result = await query<SocialMedia>(
      `SELECT * FROM social_media ORDER BY display_order ASC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
    });

  } catch (error) {
    console.error('Error al obtener redes sociales:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/social-media
 * Crear una nueva red social
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { platform, platform_name, url, icon_name, display_order, is_active, show_in_header, show_in_footer } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { success: false, error: 'Plataforma y URL son obligatorios' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO social_media 
        (platform, platform_name, url, icon_name, display_order, is_active, show_in_header, show_in_footer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        platform,
        platform_name || platform,
        url,
        icon_name || platform,
        display_order || 0,
        is_active !== false,
        show_in_header !== false,
        show_in_footer !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Red social creada exitosamente',
      data: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear red social:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/social-media
 * Actualizar múltiples redes sociales a la vez (reordenar)
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { socialMedia } = body;

    if (!Array.isArray(socialMedia)) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un array "socialMedia"' },
        { status: 400 }
      );
    }

    const updated = [];

    for (const sm of socialMedia) {
      if (!sm.id) continue;

      const result = await query(
        `UPDATE social_media SET
          platform = COALESCE($1, platform),
          platform_name = COALESCE($2, platform_name),
          url = COALESCE($3, url),
          icon_name = COALESCE($4, icon_name),
          display_order = COALESCE($5, display_order),
          is_active = COALESCE($6, is_active),
          show_in_header = COALESCE($7, show_in_header),
          show_in_footer = COALESCE($8, show_in_footer)
         WHERE id = $9
         RETURNING *`,
        [
          sm.platform,
          sm.platform_name,
          sm.url,
          sm.icon_name,
          sm.display_order,
          sm.is_active,
          sm.show_in_header,
          sm.show_in_footer,
          sm.id,
        ]
      );

      if (result.rowCount && result.rowCount > 0) {
        updated.push(result.rows[0]);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updated.length} redes sociales actualizadas`,
      data: updated,
    });

  } catch (error) {
    console.error('Error al actualizar redes sociales:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
