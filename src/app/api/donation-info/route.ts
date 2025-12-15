import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM donation_info 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    return NextResponse.json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error('Error fetching donation info:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener información de donaciones' },
      { status: 500 }
    );
  }
}
