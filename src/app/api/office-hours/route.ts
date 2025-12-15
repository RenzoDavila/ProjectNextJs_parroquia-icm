import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { OfficeHours } from '@/lib/db/types';

/**
 * GET /api/office-hours
 * Obtiene los horarios de oficina/secretaría
 */
export async function GET() {
  try {
    const result = await query<OfficeHours>(
      `SELECT 
        id,
        day_type,
        period,
        start_time,
        end_time,
        display_order,
        is_active
      FROM office_hours
      WHERE is_active = true
      ORDER BY display_order ASC`
    );

    // Agrupar por tipo de día
    const groupedByDay = result.rows.reduce((acc, hours) => {
      const day = hours.day_type;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push({
        period: hours.period,
        start: hours.start_time,
        end: hours.end_time,
      });
      return acc;
    }, {} as Record<string, { period: string | null; start: string; end: string }[]>);

    // Formato amigable para mostrar
    const formatted = {
      weekdays: groupedByDay['weekdays'] || [],
      saturdays: groupedByDay['saturdays'] || [],
      sundays: groupedByDay['sundays'] || [],
    };

    return NextResponse.json({
      success: true,
      data: result.rows,
      hours: formatted,
    });

  } catch (error) {
    console.error('Error al obtener horarios de oficina:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los horarios de oficina',
      },
      { status: 500 }
    );
  }
}
