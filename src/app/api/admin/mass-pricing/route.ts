import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/postgres';

// GET - Obtener todos los tipos de misa con precios
export async function GET() {
  try {
    const result = await query(
      `SELECT 
        id,
        tipo_misa,
        nombre,
        descripcion,
        precio,
        is_active as activo,
        display_order
      FROM mass_types
      ORDER BY display_order ASC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener precios de misas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los precios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo tipo de misa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo_misa, descripcion, precio, activo = true } = body;

    // Validaciones
    if (!tipo_misa || tipo_misa.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'El tipo de misa es requerido' },
        { status: 400 }
      );
    }

    if (precio === undefined || precio < 0) {
      return NextResponse.json(
        { success: false, message: 'El precio debe ser un número válido mayor o igual a 0' },
        { status: 400 }
      );
    }

    // Obtener el máximo display_order
    const maxOrderResult = await query(
      'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM mass_types'
    );
    const nextOrder = maxOrderResult.rows[0].next_order;

    // Insertar en la base de datos
    const result = await query(
      `INSERT INTO mass_types (tipo_misa, nombre, descripcion, precio, is_active, display_order, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [tipo_misa.trim(), tipo_misa.trim(), descripcion?.trim() || '', precio, activo, nextOrder]
    );

    return NextResponse.json({
      success: true,
      message: 'Tipo de misa creado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear tipo de misa:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear el tipo de misa' },
      { status: 500 }
    );
  }
}
