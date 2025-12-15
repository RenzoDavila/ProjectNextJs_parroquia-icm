import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

type PaymentMethodRow = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
};

type PaymentMethodResponse = {
  type: string;
  name: string;
  description: string;
  instructions?: string;
};

/**
 * GET /api/payment-methods
 * Obtiene todos los métodos de pago disponibles
 */
export async function GET() {
  try {
    const result = await query<PaymentMethodRow>(
      `SELECT 
        id,
        code,
        name,
        description,
        is_active,
        display_order
      FROM payment_methods
      WHERE is_active = true
      ORDER BY display_order ASC`
    );

    // Transformar los datos al formato esperado por el frontend
    const paymentMethods: PaymentMethodResponse[] = result.rows.map((row) => ({
      type: row.code,
      name: row.name,
      description: row.description || '',
      instructions: row.description || '',
    }));

    return NextResponse.json({
      success: true,
      data: paymentMethods,
    });

  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los métodos de pago',
      },
      { status: 500 }
    );
  }
}
