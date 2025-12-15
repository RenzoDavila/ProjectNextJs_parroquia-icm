import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { MassSchedule } from '@/lib/db/types';

/**
 * GET /api/mass-schedules
 * Obtiene los horarios de misa informativos
 * 
 * Query params:
 * - location: Filtrar por ubicación
 * - day_type: Filtrar por tipo de día (weekdays, saturdays, sundays)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const dayType = searchParams.get('day_type');

    let sql = `
      SELECT 
        id,
        location_name,
        location_address,
        day_type,
        time,
        mass_type,
        display_order,
        is_active
      FROM mass_schedules
      WHERE is_active = true
    `;
    
    const params: string[] = [];
    let paramIndex = 1;
    
    if (location) {
      sql += ` AND location_name = $${paramIndex}`;
      params.push(location);
      paramIndex++;
    }
    
    if (dayType) {
      sql += ` AND day_type = $${paramIndex}`;
      params.push(dayType);
    }
    
    sql += ` ORDER BY location_name ASC, day_type ASC, display_order ASC`;

    const result = await query<MassSchedule>(sql, params);

    // Agrupar por ubicación y tipo de día
    const groupedByLocation = result.rows.reduce((acc, schedule) => {
      const loc = schedule.location_name;
      if (!acc[loc]) {
        acc[loc] = {
          name: schedule.location_name,
          address: schedule.location_address,
          weekdays: [],
          saturdays: [],
          sundays: [],
        };
      }
      if (schedule.day_type === 'weekdays') {
        acc[loc].weekdays.push(schedule.time);
      } else if (schedule.day_type === 'saturdays') {
        acc[loc].saturdays.push(schedule.time);
      } else if (schedule.day_type === 'sundays') {
        acc[loc].sundays.push(schedule.time);
      }
      return acc;
    }, {} as Record<string, {
      name: string;
      address: string | null;
      weekdays: string[];
      saturdays: string[];
      sundays: string[];
    }>);

    return NextResponse.json({
      success: true,
      data: result.rows,
      byLocation: Object.values(groupedByLocation),
    });

  } catch (error) {
    console.error('Error al obtener horarios de misa:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los horarios de misa',
      },
      { status: 500 }
    );
  }
}
