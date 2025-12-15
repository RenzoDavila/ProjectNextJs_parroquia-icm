import { NextRequest, NextResponse } from 'next/server';
import { query, transaction, handleDbError } from '@/lib/db/postgres';
import type { 
  CreateReservationRequest, 
  CreateReservationResponse,
  MassType 
} from '@/lib/db/types';

/**
 * Genera un código de confirmación único
 */
function generateConfirmationCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ICM-${timestamp}-${random}`;
}

/**
 * Obtiene la IP del cliente desde los headers
 */
function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIp || null;
}

/**
 * POST /api/reservations
 * Crea una nueva reserva de misa
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateReservationRequest = await request.json();

    // Validar campos obligatorios
    const requiredFields = [
      'date',
      'time',
      'nombre',
      'apellidos',
      'dni',
      'telefono',
      'email',
      'tipoMisa',
      'intencion',
      'metodoPago',
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof CreateReservationRequest]) {
        return NextResponse.json(
          {
            success: false,
            error: `El campo "${field}" es obligatorio`,
          },
          { status: 400 }
        );
      }
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.date)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Formato de fecha inválido',
        },
        { status: 400 }
      );
    }

    // Validar que la fecha no sea en el pasado
    const reservationDate = new Date(body.date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      return NextResponse.json(
        {
          success: false,
          error: 'No se pueden hacer reservas para fechas pasadas',
        },
        { status: 400 }
      );
    }

    // Validar DNI (8 dígitos)
    if (!/^\d{8}$/.test(body.dni)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El DNI debe tener exactamente 8 dígitos',
        },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El formato del correo electrónico no es válido',
        },
        { status: 400 }
      );
    }

    // Obtener información del cliente
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent');

    // Ejecutar la inserción dentro de una transacción
    const result = await transaction(async (client) => {
      // Verificar que el horario siga disponible
      const availabilityCheck = await client.query(
        `SELECT 
          mat.max_reservations,
          COUNT(mr.id) as current_reservations
        FROM mass_available_times mat
        LEFT JOIN mass_reservations mr ON 
          mr.reservation_time = mat.time AND 
          mr.reservation_date = $1 AND
          mr.status NOT IN ('cancelled')
        WHERE mat.time = $2 AND mat.is_active = true
        GROUP BY mat.max_reservations`,
        [body.date, body.time]
      );

      if (availabilityCheck.rows.length === 0) {
        throw new Error('El horario seleccionado no está disponible');
      }

      const { max_reservations, current_reservations } = availabilityCheck.rows[0];
      if (parseInt(current_reservations) >= max_reservations) {
        throw new Error('El horario seleccionado ya no está disponible');
      }

      // Obtener el precio del tipo de misa
      const priceResult = await client.query<MassType>(
        `SELECT precio FROM mass_types WHERE tipo_misa = $1 AND is_active = true`,
        [body.tipoMisa]
      );

      if (priceResult.rows.length === 0) {
        throw new Error('Tipo de misa no válido');
      }

      const precio = parseFloat(priceResult.rows[0].precio.toString());

      // Generar código de confirmación
      const confirmationCode = generateConfirmationCode();

      // Determinar estado inicial según método de pago
      const status = body.metodoPago === 'transferencia' ? 'payment_pending' : 'pending';

      // Insertar la reserva
      const insertResult = await client.query(
        `INSERT INTO mass_reservations (
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
          ip_address,
          user_agent
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        ) RETURNING id, confirmation_code`,
        [
          body.date,
          body.time,
          'Parroquia', // Por defecto, puede ser parametrizable
          body.nombre,
          body.apellidos,
          body.dni,
          body.telefono,
          body.email.toLowerCase(),
          body.tipoMisa,
          body.intencion,
          body.difuntos || null,
          body.observaciones || null,
          precio,
          body.metodoPago,
          body.comprobanteUrl || null,
          false, // pago_verificado
          status,
          confirmationCode,
          clientIp,
          userAgent,
        ]
      );

      return {
        reservationId: insertResult.rows[0].id,
        confirmationCode: insertResult.rows[0].confirmation_code,
      };
    });

    // TODO: Enviar correo de confirmación
    // await sendConfirmationEmail(body.email, result.confirmationCode);

    const response: CreateReservationResponse = {
      success: true,
      message: body.metodoPago === 'transferencia'
        ? 'Reserva creada exitosamente. Te contactaremos para validar tu transferencia.'
        : 'Reserva creada exitosamente. Recuerda acercarte a la secretaría para realizar el pago.',
      reservationId: result.reservationId,
      confirmationCode: result.confirmationCode,
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al crear la reserva',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reservations
 * Obtiene todas las reservas (para el admin)
 * TODO: Agregar autenticación y paginación
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = `
      SELECT 
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
        precio,
        metodo_pago,
        pago_verificado,
        status,
        confirmation_code,
        created_at
      FROM mass_reservations
      WHERE 1=1
    `;

    const params: string[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (date) {
      paramCount++;
      queryText += ` AND reservation_date = $${paramCount}`;
      params.push(date);
    }

    queryText += ` ORDER BY reservation_date DESC, reservation_time ASC`;
    
    paramCount++;
    queryText += ` LIMIT $${paramCount}`;
    params.push(limit.toString());
    
    paramCount++;
    queryText += ` OFFSET $${paramCount}`;
    params.push(offset.toString());

    const result = await query(queryText, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      meta: {
        total: result.rowCount,
        limit,
        offset,
      },
    });

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener las reservas',
      },
      { status: 500 }
    );
  }
}
