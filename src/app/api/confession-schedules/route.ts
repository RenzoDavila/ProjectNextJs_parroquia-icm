import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { ConfessionSchedule } from '@/lib/db/types';

/**
 * GET /api/confession-schedules
 * Obtiene los horarios de confesión
 */
export async function GET() {
  try {
    const result = await query<ConfessionSchedule>(
      `SELECT 
        id,
        day,
        time,
        location,
        display_order,
        is_active
      FROM confession_schedules
      WHERE is_active = true
      ORDER BY display_order ASC`
    );

    // Transformar para facilitar el renderizado
    const schedules = result.rows.map(schedule => ({
      id: schedule.id,
      day: schedule.day,
      time: schedule.time,
      location: schedule.location,
    }));

    return NextResponse.json({
      success: true,
      data: result.rows,
      schedules: schedules,
    });

  } catch (error) {
    console.error('Error al obtener horarios de confesión:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los horarios de confesión',
      },
      { status: 500 }
    );
  }
}
