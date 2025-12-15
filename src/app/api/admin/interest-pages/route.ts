import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

/**
 * GET /api/admin/interest-pages
 * Lista todas las páginas de interés (incluyendo inactivas)
 */
export async function GET() {
  try {
    const result = await query(
      `SELECT 
        id,
        title,
        description,
        image_url,
        link_url,
        display_order,
        is_active,
        created_at
      FROM interest_pages
      ORDER BY display_order ASC, created_at DESC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
    });

  } catch (error) {
    console.error('Error al obtener páginas de interés:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/interest-pages
 * Crear una nueva página de interés
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, image_url, link_url, display_order, is_active } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'El título es obligatorio' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO interest_pages 
        (title, description, image_url, link_url, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        description || null,
        image_url || null,
        link_url || '#',
        display_order || 0,
        is_active !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Página de interés creada exitosamente',
      data: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear página de interés:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
