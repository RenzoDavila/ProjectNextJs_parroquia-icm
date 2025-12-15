import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM donation_info ORDER BY id ASC');
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Error al cargar datos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await query(
      `INSERT INTO donation_info (
        title, subtitle, bank_name, account_type, 
        account_number, cci, account_holder, 
        purpose_title, purpose_description, 
        purpose_image_url, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        body.title, body.subtitle, body.bank_name,
        body.account_type, body.account_number, body.cci, body.account_holder,
        body.purpose_title, body.purpose_description, body.purpose_image_url,
        body.is_active
      ]
    );
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Error al crear' }, { status: 500 });
  }
}
