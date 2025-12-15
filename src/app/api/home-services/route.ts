import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { HomeService } from '@/lib/db/types';

/**
 * GET /api/home-services
 * Obtiene los servicios para la página principal
 */
export async function GET() {
  try {
    const result = await query<HomeService>(
      `SELECT 
        id,
        title,
        description,
        icon,
        link_url,
        display_order,
        is_active
      FROM home_services
      WHERE is_active = true
      ORDER BY display_order ASC`
    );

    // Transformar para compatibilidad con componentes
    const services = result.rows.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description || '',
      icon: service.icon || 'info',
      link: service.link_url || '#',
    }));

    return NextResponse.json({
      success: true,
      data: result.rows,
      services: services,
    });

  } catch (error) {
    console.error('Error al obtener servicios:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los servicios',
      },
      { status: 500 }
    );
  }
}
