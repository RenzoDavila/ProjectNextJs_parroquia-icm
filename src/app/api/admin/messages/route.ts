import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { ContactMessage } from '@/lib/db/types';

/**
 * GET /api/admin/messages
 * Lista todos los mensajes de contacto
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let sql = `SELECT * FROM contact_messages WHERE 1=1`;
    
    const params: (string | number)[] = [];
    let paramIndex = 1;
    
    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (search) {
      sql += ` AND (
        name ILIKE $${paramIndex} OR 
        email ILIKE $${paramIndex} OR 
        subject ILIKE $${paramIndex} OR
        message ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    sql += ` ORDER BY created_at DESC`;
    
    if (limit) {
      sql += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
      paramIndex++;
    }
    
    if (offset) {
      sql += ` OFFSET $${paramIndex}`;
      params.push(parseInt(offset));
    }

    const result = await query<ContactMessage>(sql, params);

    // Obtener conteo por estado
    const statsResult = await query<{ status: string; count: string }>(
      `SELECT status, COUNT(*) as count FROM contact_messages GROUP BY status`
    );

    const stats = statsResult.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {} as Record<string, number>);

    // Conteo de no leídos
    const unreadCount = stats['unread'] || 0;

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
      unreadCount: unreadCount,
      stats: stats,
    });

  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
