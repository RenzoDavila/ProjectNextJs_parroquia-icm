import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { HomeBanner } from '@/lib/db/types';

/**
 * GET /api/admin/banners
 * Lista todos los banners (incluyendo inactivos)
 */
export async function GET() {
  try {
    const result = await query<HomeBanner>(
      `SELECT 
        id,
        title,
        subtitle,
        description,
        image_url,
        link_url,
        link_text,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM banners
      ORDER BY display_order ASC, created_at DESC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
    });

  } catch (error) {
    console.error('Error al obtener banners:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/banners
 * Crear un nuevo banner
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { title, subtitle, description, image_url, link_url, link_text, display_order, is_active } = body;

    if (!image_url) {
      return NextResponse.json(
        { success: false, error: 'La imagen es obligatoria' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO banners 
        (title, subtitle, description, image_url, link_url, link_text, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title || null,
        subtitle || null,
        description || null,
        image_url,
        link_url || null,
        link_text || null,
        display_order || 0,
        is_active !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Banner creado exitosamente',
      data: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear banner:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
