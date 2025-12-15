import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { ParishGroup } from '@/lib/db/types';

/**
 * GET /api/parish-groups
 * Obtiene los grupos parroquiales activos
 * 
 * Query params:
 * - category: Filtrar por categoría (parroquiales, eclesiales, congregacionales)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let sql = `
      SELECT 
        id,
        name,
        description,
        meeting_day,
        meeting_time,
        category,
        contact_person,
        contact_email,
        contact_phone,
        display_order,
        is_active
      FROM parish_groups
      WHERE is_active = true
    `;
    
    const params: string[] = [];
    
    if (category) {
      sql += ` AND category = $1`;
      params.push(category);
    }
    
    sql += ` ORDER BY display_order ASC, name ASC`;

    const result = await query<ParishGroup>(sql, params);

    // Transformar para compatibilidad con componentes
    const groups = result.rows.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description || '',
      meetingDay: group.meeting_day || '',
      meetingTime: group.meeting_time || '',
      category: group.category,
      contact: {
        person: group.contact_person,
        email: group.contact_email,
        phone: group.contact_phone,
      },
    }));

    // Agrupar por categoría para facilitar el renderizado
    const groupedByCategory = result.rows.reduce((acc, group) => {
      const cat = group.category || 'otros';
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(group);
      return acc;
    }, {} as Record<string, ParishGroup[]>);

    return NextResponse.json({
      success: true,
      data: result.rows,
      groups: groups,
      byCategory: groupedByCategory,
    });

  } catch (error) {
    console.error('Error al obtener grupos parroquiales:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los grupos parroquiales',
      },
      { status: 500 }
    );
  }
}
