import { NextRequest, NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

/**
 * GET /api/reservations/verify?code=XXX&dni=XXX
 * Verifica el estado de una reserva usando el código de confirmación y DNI
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const confirmationCode = searchParams.get('code');
    const dni = searchParams.get('dni');

    // Validar parámetros obligatorios
    if (!confirmationCode || !dni) {
      return NextResponse.json(
        {
          success: false,
          error: 'Se requiere el código de confirmación y DNI',
        },
        { status: 400 }
      );
    }

    // Validar formato del DNI
    if (!/^\d{8}$/.test(dni)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El DNI debe tener 8 dígitos',
        },
        { status: 400 }
      );
    }

    // Buscar la reserva
    const result = await query(
      `SELECT 
        id,
        reservation_date,
        reservation_time,
        location,
        nombre,
        apellidos,
        dni,
        telefono,
        email,
        tipo_misa,
        intencion,
        difuntos,
        observaciones,
        precio,
        metodo_pago,
        comprobante_url,
        pago_verificado,
        status,
        confirmation_code,
        created_at,
        updated_at
      FROM mass_reservations
      WHERE confirmation_code = $1 AND dni = $2`,
      [confirmationCode.toUpperCase(), dni]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No se encontró ninguna reserva con estos datos',
        },
        { status: 404 }
      );
    }

    const reservation = result.rows[0];

    // Determinar el mensaje de estado
    let statusMessage = '';
    let statusType: 'success' | 'warning' | 'error' | 'info' = 'info';

    switch (reservation.status) {
      case 'pending':
        statusMessage = 'Tu reserva está pendiente. Recuerda acercarte a la secretaría para realizar el pago.';
        statusType = 'warning';
        break;
      case 'payment_pending':
        statusMessage = 'Estamos validando tu comprobante de pago. Te contactaremos pronto.';
        statusType = 'info';
        break;
      case 'confirmed':
        statusMessage = '¡Tu reserva está confirmada!';
        statusType = 'success';
        break;
      case 'cancelled':
        statusMessage = 'Esta reserva ha sido cancelada.';
        statusType = 'error';
        break;
      case 'completed':
        statusMessage = 'La misa ya se ha celebrado. Gracias por tu participación.';
        statusType = 'info';
        break;
      default:
        statusMessage = 'Estado desconocido';
        statusType = 'info';
    }

    return NextResponse.json({
      success: true,
      data: {
        ...reservation,
        statusMessage,
        statusType,
      },
    });

  } catch (error) {
    console.error('Error al verificar reserva:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al verificar la reserva',
      },
      { status: 500 }
    );
  }
}
