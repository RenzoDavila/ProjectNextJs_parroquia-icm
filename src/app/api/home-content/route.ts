import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Obtener sección de bienvenida
    const welcomeResult = await query(`
      SELECT content, image_url 
      FROM page_sections 
      WHERE page = 'home' AND section = 'welcome' AND is_active = true
      LIMIT 1
    `);

    // Obtener sección pastoral juvenil
    const pastoralResult = await query(`
      SELECT content, image_url 
      FROM page_sections 
      WHERE page = 'home' AND section = 'pastoral_juvenil' AND is_active = true
      LIMIT 1
    `);

    // Obtener sección MSC
    const mscResult = await query(`
      SELECT content, image_url 
      FROM page_sections 
      WHERE page = 'home' AND section = 'msc' AND is_active = true
      LIMIT 1
    `);

    return NextResponse.json({
      success: true,
      data: {
        welcome: welcomeResult.rows[0] || null,
        pastoralJuvenil: pastoralResult.rows[0] || null,
        msc: mscResult.rows[0] || null,
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
