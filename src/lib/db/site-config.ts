import { query } from '@/lib/db/postgres';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

export type SiteConfigData = {
  name: string;
  shortName: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  postalBox: string;
};

export type SocialLinksData = {
  facebook: string;
  youtube: string;
  instagram: string;
  facebookLive: string;
};

/**
 * Fetch site configuration from the database with fallback to constants.
 * Uses the site_config table entries and social_media table.
 */
export async function getSiteConfig(): Promise<{
  siteConfig: SiteConfigData;
  socialLinks: SocialLinksData;
}> {
  try {
    const [configRes, socialRes] = await Promise.all([
      query(`SELECT config_key, config_value FROM site_config`),
      query(`SELECT platform, url FROM social_media WHERE is_active = true ORDER BY display_order ASC`),
    ]);

    // Build config map from DB
    const dbConfig: Record<string, string> = {};
    for (const row of configRes.rows) {
      const r = row as { config_key: string; config_value: string };
      dbConfig[r.config_key] = r.config_value || '';
    }

    // Build social links map from DB
    const dbSocial: Record<string, string> = {};
    for (const row of socialRes.rows) {
      const r = row as { platform: string; url: string };
      dbSocial[r.platform] = r.url || '';
    }

    const siteConfig: SiteConfigData = {
      name: dbConfig.site_name || SITE_CONFIG.name,
      shortName: SITE_CONFIG.shortName,
      description: dbConfig.site_tagline
        ? `Administrada por los Misioneros Claretianos. ${dbConfig.site_tagline}`
        : SITE_CONFIG.description,
      phone: dbConfig.site_phone || SITE_CONFIG.phone,
      whatsapp: dbConfig.site_whatsapp || SITE_CONFIG.whatsapp,
      email: dbConfig.site_email || SITE_CONFIG.email,
      address: dbConfig.site_address || SITE_CONFIG.address,
      city: dbConfig.site_city || 'Miraflores, Arequipa - Perú',
      postalBox: SITE_CONFIG.postalBox,
    };

    const socialLinks: SocialLinksData = {
      facebook: dbSocial.facebook || SOCIAL_LINKS.facebook,
      youtube: dbSocial.youtube || SOCIAL_LINKS.youtube,
      instagram: dbSocial.instagram || SOCIAL_LINKS.instagram,
      facebookLive: SOCIAL_LINKS.facebookLive,
    };

    return { siteConfig, socialLinks };
  } catch (error) {
    console.error('Error fetching site config:', error);
    // Fallback to constants
    return {
      siteConfig: { ...SITE_CONFIG, city: 'Miraflores, Arequipa - Perú' },
      socialLinks: { ...SOCIAL_LINKS },
    };
  }
}
