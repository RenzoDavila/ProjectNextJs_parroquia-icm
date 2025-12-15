import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/reservations/:id
 * Obtener una reserva específica con detalles completos
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT 
        mr.*,
        mt.nombre as tipo_misa_nombre,
        mt.descripcion as tipo_misa_descripcion,
        pm.name as metodo_pago_nombre
       FROM mass_reservations mr
       LEFT JOIN mass_types mt ON mr.tipo_misa = mt.tipo_misa
       LEFT JOIN payment_methods pm ON mr.metodo_pago = pm.code
       WHERE mr.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al obtener reserva:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/reservations/:id
 * Actualizar estado de una reserva (confirmar, cancelar, verificar pago)
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { status, pago_verificado, admin_notes, confirmed_by } = body;

    // Construir query dinámicamente
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
      
      // Si se confirma, agregar fecha de confirmación
      if (status === 'confirmed') {
        updates.push(`confirmed_at = CURRENT_TIMESTAMP`);
      }
    }

    if (pago_verificado !== undefined) {
      updates.push(`pago_verificado = $${paramIndex}`);
      values.push(pago_verificado);
      paramIndex++;
    }

    if (admin_notes !== undefined) {
      updates.push(`admin_notes = $${paramIndex}`);
      values.push(admin_notes);
      paramIndex++;
    }

    if (confirmed_by !== undefined) {
      updates.push(`confirmed_by = $${paramIndex}`);
      values.push(confirmed_by);
      paramIndex++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length === 1) { // Solo updated_at
      return NextResponse.json(
        { success: false, error: 'No se proporcionaron campos para actualizar' },
        { status: 400 }
      );
    }

    values.push(id);

    const result = await query(
      `UPDATE mass_reservations SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reserva actualizada exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reservations/:id
 * Eliminar una reserva (uso con precaución)
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await query(
      `DELETE FROM mass_reservations WHERE id = $1 RETURNING id, confirmation_code`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reserva eliminada exitosamente',
      deletedCode: result.rows[0].confirmation_code,
    });

  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
