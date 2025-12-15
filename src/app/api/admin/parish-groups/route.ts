import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { ParishGroup } from '@/lib/db/types';

/**
 * GET /api/admin/parish-groups
 * Lista todos los grupos parroquiales (incluyendo inactivos)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let sql = `
      SELECT 
        id,
        name,
        description,
        meeting_day,
        meeting_time,
        category,
        contact_person,
        contact_email,
        contact_phone,
        display_order,
        is_active,
        created_at
      FROM parish_groups
    `;
    
    const params: string[] = [];
    
    if (category) {
      sql += ` WHERE category = $1`;
      params.push(category);
    }
    
    sql += ` ORDER BY display_order ASC, name ASC`;

    const result = await query<ParishGroup>(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
    });

  } catch (error) {
    console.error('Error al obtener grupos:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/parish-groups
 * Crear un nuevo grupo parroquial
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      name, description, meeting_day, meeting_time, category,
      contact_person, contact_email, contact_phone, display_order, is_active 
    } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'El nombre es obligatorio' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO parish_groups 
        (name, description, meeting_day, meeting_time, category, 
         contact_person, contact_email, contact_phone, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name,
        description || null,
        meeting_day || null,
        meeting_time || null,
        category || 'parroquiales',
        contact_person || null,
        contact_email || null,
        contact_phone || null,
        display_order || 0,
        is_active !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Grupo creado exitosamente',
      data: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear grupo:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
