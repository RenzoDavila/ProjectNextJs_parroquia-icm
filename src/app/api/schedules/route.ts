import { NextResponse } from 'next/server';
import { query } from '@/lib/db/postgres';

export async function GET() {
  try {
    // Obtener horarios de misas agrupados por tipo de día
    const result = await query(
      `SELECT 
        id,
        day_type,
        time,
        location,
        is_active,
        display_order
       FROM mass_available_times
       WHERE is_active = true
       ORDER BY 
         CASE 
           WHEN day_type = 'weekdays' THEN 1
           WHEN day_type = 'saturdays' THEN 2
           WHEN day_type = 'sundays' THEN 3
         END,
         display_order, time`,
      []
    );

    // Agrupar por tipo de día
    const schedules = {
      weekdays: result.rows.filter(r => r.day_type === 'weekdays'),
      saturdays: result.rows.filter(r => r.day_type === 'saturdays'),
      sundays: result.rows.filter(r => r.day_type === 'sundays'),
    };

    return NextResponse.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los horarios' },
      { status: 500 }
    );
  }
}
