import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

/**
 * GET /api/admin/stats
 * Obtiene estadísticas generales para el dashboard
 */
export async function GET() {
  try {
    // Estadísticas de reservas
    const reservationsStats = await query<{ 
      total: string; 
      pending: string; 
      confirmed: string;
      cancelled: string;
      total_revenue: string;
    }>(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COALESCE(SUM(precio) FILTER (WHERE status = 'confirmed'), 0) as total_revenue
      FROM mass_reservations
    `);

    // Reservas de hoy
    const todayReservations = await query<{ count: string }>(`
      SELECT COUNT(*) as count 
      FROM mass_reservations 
      WHERE reservation_date = CURRENT_DATE
    `);

    // Reservas de esta semana
    const weekReservations = await query<{ count: string }>(`
      SELECT COUNT(*) as count 
      FROM mass_reservations 
      WHERE reservation_date >= CURRENT_DATE - INTERVAL '7 days'
    `);

    // Mensajes no leídos
    const unreadMessages = await query<{ count: string }>(`
      SELECT COUNT(*) as count 
      FROM contact_messages 
      WHERE status = 'unread'
    `);

    // Total mensajes
    const totalMessages = await query<{ count: string }>(`
      SELECT COUNT(*) as count FROM contact_messages
    `);

    // Álbumes e imágenes
    const albumsCount = await query<{ count: string }>(`
      SELECT COUNT(*) as count FROM gallery_albums
    `);

    const imagesCount = await query<{ count: string }>(`
      SELECT COUNT(*) as count FROM gallery_images
    `);

    // Equipo pastoral
    const teamCount = await query<{ count: string }>(`
      SELECT COUNT(*) as count FROM team_members
    `);

    // Grupos parroquiales
    const groupsCount = await query<{ count: string }>(`
      SELECT COUNT(*) as count FROM parish_groups
    `);

    // Banners
    const bannersCount = await query<{ count: string }>(`
      SELECT COUNT(*) as count FROM banners
    `);

    // Últimas 5 reservas
    const recentReservations = await query(`
      SELECT 
        mr.id, mr.nombre, mr.apellidos, mr.reservation_date, 
        mr.reservation_time, mr.tipo_misa, mr.status, mr.precio,
        mt.nombre as tipo_misa_nombre
      FROM mass_reservations mr
      LEFT JOIN mass_types mt ON mr.tipo_misa = mt.tipo_misa
      ORDER BY mr.created_at DESC
      LIMIT 5
    `);

    // Reservas por tipo de misa (para gráfico)
    const byMassType = await query<{ tipo_misa: string; nombre: string; count: string }>(`
      SELECT 
        mr.tipo_misa, 
        mt.nombre,
        COUNT(*) as count
      FROM mass_reservations mr
      LEFT JOIN mass_types mt ON mr.tipo_misa = mt.tipo_misa
      GROUP BY mr.tipo_misa, mt.nombre
      ORDER BY count DESC
    `);

    // Reservas por mes (últimos 6 meses)
    const byMonth = await query<{ month: string; count: string }>(`
      SELECT 
        TO_CHAR(reservation_date, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM mass_reservations
      WHERE reservation_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(reservation_date, 'YYYY-MM')
      ORDER BY month ASC
    `);

    const stats = reservationsStats.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        reservations: {
          total: parseInt(stats.total),
          pending: parseInt(stats.pending),
          confirmed: parseInt(stats.confirmed),
          cancelled: parseInt(stats.cancelled),
          completed: 0,
          totalRevenue: parseFloat(stats.total_revenue),
          today: parseInt(todayReservations.rows[0].count),
          thisWeek: parseInt(weekReservations.rows[0].count),
        },
        messages: {
          total: parseInt(totalMessages.rows[0].count),
          unread: parseInt(unreadMessages.rows[0].count),
        },
        gallery: {
          albums: parseInt(albumsCount.rows[0].count),
          images: parseInt(imagesCount.rows[0].count),
        },
        team: parseInt(teamCount.rows[0].count),
        groups: parseInt(groupsCount.rows[0].count),
        banners: parseInt(bannersCount.rows[0].count),
        recentReservations: recentReservations.rows,
        charts: {
          byMassType: byMassType.rows.map(r => ({
            type: r.tipo_misa,
            name: r.nombre,
            count: parseInt(r.count),
          })),
          byMonth: byMonth.rows.map(r => ({
            month: r.month,
            count: parseInt(r.count),
          })),
        },
      },
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
