import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { MassType, MassTypeResponse } from '@/lib/db/types';

/**
 * GET /api/mass-types
 * Obtiene todos los tipos de misa disponibles con sus precios
 */
export async function GET() {
  try {
    const result = await query<MassType>(
      `SELECT 
        id,
        tipo_misa,
        nombre,
        descripcion,
        precio,
        is_active,
        display_order,
        created_at,
        updated_at
      FROM mass_types
      WHERE is_active = true
      ORDER BY display_order ASC, nombre ASC`
    );

    // Devolver tanto el formato original como el transformado
    const massTypes: MassTypeResponse[] = result.rows.map(row => ({
      value: row.tipo_misa,
      label: row.nombre,
      price: parseFloat(row.precio.toString()),
      description: row.descripcion || '',
    }));

    return NextResponse.json({
      success: true,
      data: result.rows, // Datos originales para el admin
      massTypes: massTypes, // Datos transformados para el formulario de reservas
    });

  } catch (error) {
    console.error('Error al obtener tipos de misa:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los tipos de misa',
      },
      { status: 500 }
    );
  }
}
