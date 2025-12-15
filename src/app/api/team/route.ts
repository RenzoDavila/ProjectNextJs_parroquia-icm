import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { TeamMember } from '@/lib/db/types';

/**
 * GET /api/team
 * Obtiene los miembros del equipo pastoral
 */
export async function GET() {
  try {
    const result = await query<TeamMember>(
      `SELECT 
        id,
        name,
        role,
        bio,
        image_url,
        email,
        phone,
        display_order,
        is_active
      FROM team_members
      WHERE is_active = true
      ORDER BY display_order ASC`
    );

    // Transformar para compatibilidad con componentes
    const team = result.rows.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image: member.image_url || '/images/placeholder-person.jpg',
      email: member.email,
      phone: member.phone,
    }));

    return NextResponse.json({
      success: true,
      data: result.rows,
      team: team,
    });

  } catch (error) {
    console.error('Error al obtener equipo:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener el equipo',
      },
      { status: 500 }
    );
  }
}
