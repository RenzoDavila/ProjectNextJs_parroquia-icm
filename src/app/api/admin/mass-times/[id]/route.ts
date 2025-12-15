import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/postgres';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET - Obtener un horario específico
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const result = await query<{
      id: number;
      day_type: string;
      time: string;
      location: string;
      max_reservations: number;
      is_active: boolean;
      display_order: number;
    }>(`
      SELECT 
        id,
        day_type,
        time,
        location,
        max_reservations,
        is_active,
        display_order
      FROM mass_available_times
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Horario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener horario:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener horario' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un horario
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { day_type, time, location, max_reservations, is_active, display_order } = body;

    // Validaciones
    if (day_type && !['weekdays', 'saturdays', 'sundays'].includes(day_type)) {
      return NextResponse.json(
        { success: false, error: 'day_type debe ser weekdays, saturdays o sundays' },
        { status: 400 }
      );
    }

    await query(`
      UPDATE mass_available_times
      SET 
        day_type = COALESCE($1, day_type),
        time = COALESCE($2, time),
        location = COALESCE($3, location),
        max_reservations = COALESCE($4, max_reservations),
        is_active = COALESCE($5, is_active),
        display_order = COALESCE($6, display_order)
      WHERE id = $7
    `, [
      day_type,
      time,
      location,
      max_reservations,
      is_active,
      display_order,
      id,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Horario actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar horario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un horario
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Verificar si hay reservas asociadas a este horario
    const reservationsCheck = await query<{ count: number }>(`
      SELECT COUNT(*) as count
      FROM mass_reservations
      WHERE reservation_time = (
        SELECT time FROM mass_available_times WHERE id = $1
      )
      AND status NOT IN ('cancelled')
    `, [id]);

    if (Number(reservationsCheck.rows[0].count) > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se puede eliminar este horario porque tiene reservas activas. Desactívalo en su lugar.' 
        },
        { status: 400 }
      );
    }

    await query(`
      DELETE FROM mass_available_times
      WHERE id = $1
    `, [id]);

    return NextResponse.json({
      success: true,
      message: 'Horario eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar horario' },
      { status: 500 }
    );
  }
}
