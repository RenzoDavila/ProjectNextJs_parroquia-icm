import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/messages/:id
 * Obtener un mensaje específico y marcarlo como leído
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Marcar como leído automáticamente al obtener
    const result = await query(
      `UPDATE contact_messages 
       SET status = CASE WHEN status = 'unread' THEN 'read' ELSE status END,
           read_at = CASE WHEN read_at IS NULL THEN CURRENT_TIMESTAMP ELSE read_at END
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Mensaje no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al obtener mensaje:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/messages/:id
 * Actualizar estado de un mensaje
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { status } = body;

    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Estado inválido. Use: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    let sql = `UPDATE contact_messages SET status = $1`;
    const params_query: (string | number)[] = [status];

    // Actualizar timestamps según el estado
    if (status === 'read') {
      sql += `, read_at = COALESCE(read_at, CURRENT_TIMESTAMP)`;
    } else if (status === 'replied') {
      sql += `, replied_at = CURRENT_TIMESTAMP`;
    }

    sql += ` WHERE id = $2 RETURNING *`;
    params_query.push(id);

    const result = await query(sql, params_query);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Mensaje no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje actualizado exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar mensaje:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/messages/:id
 * Eliminar un mensaje
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await query(
      `DELETE FROM contact_messages WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Mensaje no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
