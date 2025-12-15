import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await query(
      `UPDATE donation_info SET
        title = $1, subtitle = $2, bank_name = $3,
        account_type = $4, account_number = $5, cci = $6, account_holder = $7,
        purpose_title = $8, purpose_description = $9, purpose_image_url = $10, 
        is_active = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12 RETURNING *`,
      [
        body.title, body.subtitle, body.bank_name,
        body.account_type, body.account_number, body.cci, body.account_holder,
        body.purpose_title, body.purpose_description, body.purpose_image_url,
        body.is_active, id
      ]
    );
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await query('DELETE FROM donation_info WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Error al eliminar' }, { status: 500 });
  }
}
