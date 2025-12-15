import { NextRequest, NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { AvailableTime, AvailableTimeResponse, DayType } from '@/lib/db/types';

/**
 * GET /api/reservations/available-times?date=YYYY-MM-DD
 * Obtiene los horarios disponibles para una fecha específica
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'El parámetro "date" es obligatorio (formato: YYYY-MM-DD)',
        },
        { status: 400 }
      );
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateParam)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Formato de fecha inválido. Use YYYY-MM-DD',
        },
        { status: 400 }
      );
    }

    // Determinar el tipo de día (weekdays, saturdays, sundays)
    const requestedDate = new Date(dateParam + 'T00:00:00');
    const dayOfWeek = requestedDate.getDay(); // 0 = Domingo, 6 = Sábado
    
    let dayType: DayType;
    if (dayOfWeek === 0) {
      dayType = 'sundays';
    } else if (dayOfWeek === 6) {
      dayType = 'saturdays';
    } else {
      dayType = 'weekdays';
    }

    // Obtener horarios configurados para este tipo de día
    const availableTimesResult = await query<AvailableTime>(
      `SELECT 
        id,
        day_type,
        time,
        location,
        max_reservations,
        is_active,
        display_order
      FROM mass_available_times
      WHERE day_type = $1 AND is_active = true
      ORDER BY display_order ASC`,
      [dayType]
    );

    // Obtener las reservas ya existentes para esta fecha
    const reservationsResult = await query<{ reservation_time: string; count: string }>(
      `SELECT 
        reservation_time,
        COUNT(*) as count
      FROM mass_reservations
      WHERE reservation_date = $1
        AND status NOT IN ('cancelled')
      GROUP BY reservation_time`,
      [dateParam]
    );

    // Crear un mapa de reservas por horario
    const reservationsByTime = new Map<string, number>();
    reservationsResult.rows.forEach((row: { reservation_time: string; count: string }) => {
      reservationsByTime.set(row.reservation_time, parseInt(row.count));
    });

    // Combinar la información
    const times: AvailableTimeResponse[] = availableTimesResult.rows.map((timeSlot: AvailableTime) => {
      const reservationsCount = reservationsByTime.get(timeSlot.time) || 0;
      const isAvailable = reservationsCount < timeSlot.max_reservations;

      return {
        time: timeSlot.time,
        isAvailable,
        reservationsCount,
      };
    });

    return NextResponse.json({
      success: true,
      data: times,
      meta: {
        date: dateParam,
        dayType,
        totalTimes: times.length,
        availableTimes: times.filter(t => t.isAvailable).length,
      },
    });

  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los horarios disponibles',
      },
      { status: 500 }
    );
  }
}
