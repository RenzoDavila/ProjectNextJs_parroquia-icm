import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import { headers } from 'next/headers';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * POST /api/contact
 * Envía un mensaje de contacto
 */
export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validaciones básicas
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan campos obligatorios: nombre, email, asunto y mensaje',
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El formato del email no es válido',
        },
        { status: 400 }
      );
    }

    // Obtener información del request
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Insertar mensaje en la base de datos
    const result = await query(
      `INSERT INTO contact_messages 
        (name, email, phone, subject, message, ip_address, user_agent, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'unread')
       RETURNING id, created_at`,
      [
        body.name.trim(),
        body.email.trim().toLowerCase(),
        body.phone?.trim() || null,
        body.subject.trim(),
        body.message.trim(),
        ipAddress,
        userAgent,
      ]
    );

    const newMessage = result.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
      data: {
        id: newMessage.id,
        createdAt: newMessage.created_at,
      },
    });

  } catch (error) {
    console.error('Error al enviar mensaje de contacto:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al enviar el mensaje',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Obtiene información de contacto de la parroquia
 */
export async function GET() {
  try {
    // Obtener configuración de contacto desde site_config
    const result = await query(
      `SELECT config_key, config_value 
       FROM site_config 
       WHERE config_key IN ('site_email', 'site_phone', 'site_whatsapp', 'site_address', 'site_city')
       ORDER BY config_key`
    );

    const contactInfo: Record<string, string> = {};
    result.rows.forEach(row => {
      const key = row.config_key.replace('site_', '');
      contactInfo[key] = row.config_value || '';
    });

    // Obtener redes sociales para contacto
    const socialResult = await query(
      `SELECT platform, platform_name, url, icon_name
       FROM social_media
       WHERE is_active = true
       ORDER BY display_order ASC`
    );

    return NextResponse.json({
      success: true,
      contact: {
        email: contactInfo.email || '',
        phone: contactInfo.phone || '',
        whatsapp: contactInfo.whatsapp || '',
        address: contactInfo.address || '',
        city: contactInfo.city || '',
      },
      socialMedia: socialResult.rows,
    });

  } catch (error) {
    console.error('Error al obtener información de contacto:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener información de contacto',
      },
      { status: 500 }
    );
  }
}
