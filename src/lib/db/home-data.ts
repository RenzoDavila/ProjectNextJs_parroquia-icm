import { query } from '@/lib/db/postgres';

/**
 * Safe query wrapper: returns empty rows if the table doesn't exist.
 */
async function safeQuery(sql: string) {
  try {
    return await query(sql);
  } catch {
    // Table may not exist yet – return empty result
    return { rows: [] };
  }
}

/**
 * Fetch all homepage data server-side in parallel.
 * Each query is fault-tolerant: if a table is missing the rest still loads.
 */
export async function getHomePageData() {
  try {
    const [bannersRes, servicesRes, pagesRes, contentRes, donationRes] = await Promise.all([
      safeQuery(`SELECT id, title, subtitle, description, image_url, link_url, link_text, display_order
                 FROM banners WHERE is_active = true ORDER BY display_order ASC`),
      safeQuery(`SELECT id, title, description, icon, link_url, display_order
                 FROM home_services WHERE is_active = true ORDER BY display_order ASC`),
      safeQuery(`SELECT id, title, description, image_url, link_url, display_order
                 FROM interest_pages WHERE is_active = true ORDER BY display_order ASC`),
      safeQuery(`SELECT section, content, image_url FROM page_sections
                 WHERE page = 'home' AND is_active = true
                 AND section IN ('welcome', 'pastoral_juvenil', 'msc')`),
      safeQuery(`SELECT * FROM donation_info WHERE is_active = true ORDER BY created_at DESC LIMIT 1`),
    ]);

    // Transform banners
    const banners = bannersRes.rows.map((b: any) => ({
      id: b.id, title: b.title || '', subtitle: b.subtitle || '',
      description: b.description || '', image: b.image_url,
      link: b.link_url || '#', linkText: b.link_text || 'Más información',
    }));

    // Transform services
    const services = servicesRes.rows.map((s: any) => ({
      id: s.id, title: s.title, description: s.description || '',
      icon: s.icon || 'info', link_url: s.link_url || '#',
    }));

    // Transform interest pages
    const interestPages = pagesRes.rows.map((p: any) => ({
      id: p.id, title: p.title, image_url: p.image_url || '',
      link_url: p.link_url || '#',
    }));

    // Transform content sections
    const sections: Record<string, any> = {};
    for (const row of contentRes.rows) {
      const key = (row as any).section === 'pastoral_juvenil' ? 'pastoralJuvenil' : (row as any).section;
      sections[key] = row;
    }

    return {
      banners,
      services,
      interestPages,
      pageContent: {
        welcome: sections.welcome || null,
        pastoralJuvenil: sections.pastoralJuvenil || null,
        msc: sections.msc || null,
      },
      donationInfo: (donationRes.rows[0] as any) || null,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return null;
  }
}
