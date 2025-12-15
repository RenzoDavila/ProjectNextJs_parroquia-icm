import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

/**
 * GET /api/admin/home-services
 * Lista todos los servicios del home (incluyendo inactivos)
 */
export async function GET() {
  try {
    const result = await query(
      `SELECT 
        id,
        title,
        description,
        icon,
        link_url,
        display_order,
        is_active,
        created_at
      FROM home_services
      ORDER BY display_order ASC, created_at DESC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
    });

  } catch (error) {
    console.error('Error al obtener servicios:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/home-services
 * Crear un nuevo servicio
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, icon, link_url, display_order, is_active } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'El título es obligatorio' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO home_services 
        (title, description, icon, link_url, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        description || null,
        icon || 'info',
        link_url || null,
        display_order || 0,
        is_active !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Servicio creado exitosamente',
      data: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear servicio:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
