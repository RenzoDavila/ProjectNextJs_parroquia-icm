import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { PastoralSchedule } from '@/lib/db/types';

/**
 * GET /api/pastoral-schedules
 * Obtiene los horarios de atención pastoral
 */
export async function GET() {
  try {
    const result = await query<PastoralSchedule>(
      `SELECT 
        id,
        priest_role,
        priest_name,
        day,
        time,
        display_order,
        is_active
      FROM pastoral_schedules
      WHERE is_active = true
      ORDER BY display_order ASC`
    );

    // Agrupar por rol del sacerdote
    const groupedByRole = result.rows.reduce((acc, schedule) => {
      const role = schedule.priest_role;
      if (!acc[role]) {
        acc[role] = {
          role: role,
          name: schedule.priest_name,
          schedules: [],
        };
      }
      acc[role].schedules.push({
        day: schedule.day,
        time: schedule.time,
      });
      return acc;
    }, {} as Record<string, {
      role: string;
      name: string | null;
      schedules: { day: string; time: string }[];
    }>);

    return NextResponse.json({
      success: true,
      data: result.rows,
      byRole: Object.values(groupedByRole),
    });

  } catch (error) {
    console.error('Error al obtener horarios pastorales:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los horarios pastorales',
      },
      { status: 500 }
    );
  }
}
