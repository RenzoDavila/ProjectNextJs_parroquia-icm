import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { MassReservation } from '@/lib/db/types';

/**
 * GET /api/admin/reservations
 * Lista todas las reservas con filtros
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let sql = `
      SELECT 
        mr.*,
        mt.nombre as tipo_misa_nombre
      FROM mass_reservations mr
      LEFT JOIN mass_types mt ON mr.tipo_misa = mt.tipo_misa
      WHERE 1=1
    `;
    
    const params: (string | number)[] = [];
    let paramIndex = 1;
    
    if (status) {
      sql += ` AND mr.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (date) {
      sql += ` AND mr.reservation_date = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }
    
    if (search) {
      sql += ` AND (
        mr.nombre ILIKE $${paramIndex} OR 
        mr.apellidos ILIKE $${paramIndex} OR 
        mr.email ILIKE $${paramIndex} OR 
        mr.dni ILIKE $${paramIndex} OR
        mr.confirmation_code ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    sql += ` ORDER BY mr.created_at DESC`;
    
    if (limit) {
      sql += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
      paramIndex++;
    }
    
    if (offset) {
      sql += ` OFFSET $${paramIndex}`;
      params.push(parseInt(offset));
    }

    const result = await query<MassReservation & { tipo_misa_nombre: string }>(sql, params);

    // Obtener conteo total
    const countResult = await query(
      `SELECT COUNT(*) as total FROM mass_reservations`
    );

    // Obtener estadísticas por estado
    const statsResult = await query<{ status: string; count: string }>(
      `SELECT status, COUNT(*) as count FROM mass_reservations GROUP BY status`
    );

    const stats = statsResult.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      stats: stats,
    });

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
