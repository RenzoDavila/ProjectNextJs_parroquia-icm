import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/postgres';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    const body = await request.json();
    const { tipo_misa, descripcion, precio, activo } = body;

    // Validar datos
    if (precio === undefined || precio < 0) {
      return NextResponse.json(
        { success: false, message: 'El precio debe ser un número válido mayor o igual a 0' },
        { status: 400 }
      );
    }

    // Actualizar en la base de datos
    const result = await query(
      `UPDATE mass_types 
       SET tipo_misa = COALESCE($1, tipo_misa),
           nombre = COALESCE($1, nombre),
           descripcion = COALESCE($2, descripcion),
           precio = $3,
           is_active = COALESCE($4, is_active),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [tipo_misa?.trim(), descripcion?.trim(), precio, activo, numericId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tipo de misa no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Precio actualizado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar precio:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar el precio' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);

    const result = await query(
      'DELETE FROM mass_types WHERE id = $1 RETURNING id',
      [numericId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tipo de misa no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tipo de misa eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar tipo de misa:', error);
    return NextResponse.json(
      { success: false, message: 'Error al eliminar el tipo de misa' },
      { status: 500 }
    );
  }
}
