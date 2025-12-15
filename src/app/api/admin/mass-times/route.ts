import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/postgres';

// GET - Obtener todos los horarios
export async function GET() {
  try {
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
      ORDER BY 
        CASE day_type
          WHEN 'weekdays' THEN 1
          WHEN 'saturdays' THEN 2
          WHEN 'sundays' THEN 3
        END,
        display_order ASC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
      meta: {
        total: result.rows.length,
      },
    });
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener horarios de misas' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo horario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { day_type, time, location, max_reservations, display_order } = body;

    // Validaciones
    if (!day_type || !time) {
      return NextResponse.json(
        { success: false, error: 'day_type y time son obligatorios' },
        { status: 400 }
      );
    }

    if (!['weekdays', 'saturdays', 'sundays'].includes(day_type)) {
      return NextResponse.json(
        { success: false, error: 'day_type debe ser weekdays, saturdays o sundays' },
        { status: 400 }
      );
    }

    const result = await query<{ id: number }>(`
      INSERT INTO mass_available_times (
        day_type,
        time,
        location,
        max_reservations,
        display_order,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id
    `, [
      day_type,
      time,
      location || 'Parroquia',
      max_reservations || 1,
      display_order || 0,
    ]);

    return NextResponse.json({
      success: true,
      data: { id: result.rows[0].id },
      message: 'Horario creado exitosamente',
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear horario:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear horario' },
      { status: 500 }
    );
  }
}
