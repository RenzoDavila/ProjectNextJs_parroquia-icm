import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Una sola query en vez de 3 separadas
    const result = await query(`
      SELECT section, content, image_url 
      FROM page_sections 
      WHERE page = 'home' AND is_active = true
        AND section IN ('welcome', 'pastoral_juvenil', 'msc')
    `);

    const sections: Record<string, any> = {};
    for (const row of result.rows) {
      sections[row.section === 'pastoral_juvenil' ? 'pastoralJuvenil' : row.section] = row;
    }

    return NextResponse.json({
      success: true,
      data: {
        welcome: sections.welcome || null,
        pastoralJuvenil: sections.pastoralJuvenil || null,
        msc: sections.msc || null,
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching home content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al cargar el contenido' },
      { status: 500 }
    );
  }
}
