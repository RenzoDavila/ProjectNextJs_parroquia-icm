-- ============================================
-- SCRIPT DE DATOS INICIALES PARA LA PARROQUIA
-- Fecha: 13 de diciembre de 2025
-- ============================================

-- ============================================
-- 1. TIPOS DE MISAS Y PRECIOS
-- ============================================

-- Insertar tipos de misas con precios actuales
INSERT INTO mass_types (tipo_misa, nombre, descripcion, precio, is_active, display_order, created_at, updated_at)
VALUES 
  (
    'simple',
    'Misa Simple',
    'Intención de misa para un día específico. Incluye celebración eucarística y mención del nombre del difunto o intención.',
    30.00,
    true,
    1,
    NOW(),
    NOW()
  ),
  (
    'novenario',
    'Novenario (9 días)',
    'Novena de misas durante 9 días consecutivos. Incluye celebración diaria y acompañamiento espiritual a la familia.',
    250.00,
    true,
    2,
    NOW(),
    NOW()
  ),
  (
    'cabo_ano',
    'Cabo de Año',
    'Misa de aniversario al cumplirse un año del fallecimiento. Incluye ceremonia especial y recordatorio del ser querido.',
    50.00,
    true,
    3,
    NOW(),
    NOW()
  )
ON CONFLICT (tipo_misa) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  precio = EXCLUDED.precio,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- ============================================
-- 2. HORARIOS DE MISAS
-- ============================================

-- Limpiar horarios existentes (opcional)
-- DELETE FROM mass_available_times;

-- Insertar horarios de misas para días de semana (lunes a viernes)
INSERT INTO mass_available_times (day_type, time, location, is_active, display_order, created_at, updated_at)
VALUES 
  -- Lunes a Viernes
  ('weekdays', '07:00', 'Iglesia Principal', true, 1, NOW(), NOW()),
  ('weekdays', '18:30', 'Iglesia Principal', true, 2, NOW(), NOW()),
  
  -- Sábados
  ('saturdays', '07:00', 'Iglesia Principal', true, 1, NOW(), NOW()),
  ('saturdays', '18:30', 'Iglesia Principal', true, 2, NOW(), NOW()),
  ('saturdays', '19:00', 'Capilla del Santísimo', true, 3, NOW(), NOW()),
  
  -- Domingos y Feriados
  ('sundays', '07:00', 'Iglesia Principal', true, 1, NOW(), NOW()),
  ('sundays', '09:00', 'Iglesia Principal', true, 2, NOW(), NOW()),
  ('sundays', '11:00', 'Iglesia Principal', true, 3, NOW(), NOW()),
  ('sundays', '18:30', 'Iglesia Principal', true, 4, NOW(), NOW()),
  ('sundays', '19:00', 'Capilla del Santísimo', true, 5, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. MÉTODOS DE PAGO
-- ============================================

INSERT INTO payment_methods (code, name, description, is_active, display_order, created_at, updated_at)
VALUES 
  (
    'cash',
    'Efectivo',
    'Pago en efectivo en la secretaría parroquial. Horario de atención: Lunes a Viernes de 9:00 AM a 11:00 AM y de 4:00 PM a 5:30 PM.',
    true,
    1,
    NOW(),
    NOW()
  ),
  (
    'yape',
    'Yape',
    'Transferencia mediante Yape al número: 959 123 456 (Parroquia ICM). Enviar captura de pantalla por WhatsApp.',
    true,
    2,
    NOW(),
    NOW()
  ),
  (
    'plin',
    'Plin',
    'Transferencia mediante Plin al número: 959 123 456 (Parroquia ICM). Enviar captura de pantalla por WhatsApp.',
    true,
    3,
    NOW(),
    NOW()
  ),
  (
    'transfer',
    'Transferencia Bancaria',
    'Banco: BCP | Cuenta Corriente: 194-1234567-0-89 | CCI: 002-194-001234567089-12 | Titular: Parroquia Inmaculado Corazón de María',
    true,
    4,
    NOW(),
    NOW()
  )
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- ============================================
-- 4. EQUIPO PASTORAL (EJEMPLOS)
-- ============================================

-- Verificar si la tabla existe, si no, crearla
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  description TEXT,
  photo_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar miembros del equipo pastoral
INSERT INTO team_members (name, role, description, photo_url, is_active, display_order, created_at, updated_at)
VALUES 
  (
    'P. Juan Carlos Mendoza MSC',
    'Párroco',
    'Párroco de la Parroquia Inmaculado Corazón de María. Misionero del Sagrado Corazón de Jesús.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    true,
    1,
    NOW(),
    NOW()
  ),
  (
    'P. Miguel Ángel Torres MSC',
    'Vicario Parroquial',
    'Vicario Parroquial. Responsable de la pastoral juvenil y formación de catequistas.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    true,
    2,
    NOW(),
    NOW()
  ),
  (
    'Hna. María Elena Ramos',
    'Coordinadora de Cáritas',
    'Coordinadora de Cáritas Parroquial. Atención a personas en situación de vulnerabilidad.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    true,
    3,
    NOW(),
    NOW()
  ),
  (
    'Sr. Roberto Gutiérrez',
    'Coordinador de Catequesis',
    'Coordinador del equipo de catequistas. Responsable de la formación de niños y jóvenes.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    true,
    4,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. CONFIGURACIÓN GENERAL
-- ============================================

-- Tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar configuración del sitio
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, created_at, updated_at)
VALUES 
  ('site_name', 'Parroquia Inmaculado Corazón de María', 'text', 'Nombre oficial de la parroquia', NOW(), NOW()),
  ('site_short_name', 'Parroquia ICM', 'text', 'Nombre corto de la parroquia', NOW(), NOW()),
  ('site_address', 'Calle Dean Valdivia 405, Cercado, Arequipa', 'text', 'Dirección de la parroquia', NOW(), NOW()),
  ('site_phone', '(054) 253-280', 'text', 'Teléfono principal', NOW(), NOW()),
  ('site_email', 'icmpamiraflores@gmail.com', 'text', 'Email de contacto', NOW(), NOW()),
  ('site_whatsapp', '959123456', 'text', 'Número de WhatsApp', NOW(), NOW()),
  
  -- Horarios de secretaría
  ('secretary_hours_weekday', 'Lunes a Viernes: 9:00 AM - 11:00 AM y 4:00 PM - 5:30 PM', 'text', 'Horario de secretaría entre semana', NOW(), NOW()),
  ('secretary_hours_weekend', 'Sábados y Domingos: Cerrado', 'text', 'Horario de secretaría fines de semana', NOW(), NOW()),
  
  -- Redes sociales
  ('social_facebook', 'https://www.facebook.com/ParroquiaICM', 'text', 'URL de Facebook', NOW(), NOW()),
  ('social_youtube', 'https://www.youtube.com/@ParroquiaICM', 'text', 'URL de YouTube', NOW(), NOW()),
  ('social_instagram_pastoral', 'https://www.instagram.com/pastoralicm', 'text', 'Instagram Pastoral Juvenil', NOW(), NOW()),
  
  -- Enlaces externos
  ('link_peru_bolivia', 'https://www.mscperubolivia.org', 'text', 'Sitio web Provincia Perú-Bolivia MSC', NOW(), NOW()),
  
  -- Configuración de reservas
  ('min_days_advance_booking', '3', 'number', 'Días mínimos de anticipación para reservar misa', NOW(), NOW()),
  ('max_days_advance_booking', '90', 'number', 'Días máximos de anticipación para reservar misa', NOW(), NOW()),
  ('booking_confirmation_email', 'true', 'boolean', 'Enviar email de confirmación de reserva', NOW(), NOW())
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- ============================================
-- 6. BANNERS/SLIDERS (EJEMPLOS)
-- ============================================

CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  link_text VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar banners para el slider principal
INSERT INTO banners (title, subtitle, description, image_url, link_url, link_text, is_active, display_order, created_at, updated_at)
VALUES 
  (
    'Bienvenidos',
    'Parroquia Inmaculado Corazón de María',
    'Una comunidad de fe, esperanza y amor en el corazón de Arequipa',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=2000',
    '/nosotros',
    'Conócenos',
    true,
    1,
    NOW(),
    NOW()
  ),
  (
    'Reserva tu Misa',
    'Intenciones de Misa',
    'Solicita una intención de misa para tus seres queridos de manera fácil y rápida',
    'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=2000',
    '/reservar',
    'Reservar Ahora',
    true,
    2,
    NOW(),
    NOW()
  ),
  (
    'Pastoral Juvenil',
    'Jóvenes por Cristo',
    'Únete a nuestra comunidad de jóvenes comprometidos con la fe y el servicio',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000',
    'https://www.instagram.com/pastoralicm',
    'Síguenos',
    true,
    3,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. GALERÍA DE FOTOS (CATEGORÍAS Y EJEMPLOS)
-- ============================================

CREATE TABLE IF NOT EXISTS gallery_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category_id INT REFERENCES gallery_categories(id) ON DELETE SET NULL,
  event_date DATE,
  is_featured BOOLEAN DEFAULT false,
  uploaded_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar categorías de galería
INSERT INTO gallery_categories (name, slug, description, created_at, updated_at)
VALUES 
  ('Misas y Celebraciones', 'misas-celebraciones', 'Celebraciones eucarísticas y litúrgicas', NOW(), NOW()),
  ('Pastoral Juvenil', 'pastoral-juvenil', 'Actividades de la pastoral juvenil', NOW(), NOW()),
  ('Sacramentos', 'sacramentos', 'Bautizos, primeras comuniones, confirmaciones', NOW(), NOW()),
  ('Eventos Especiales', 'eventos-especiales', 'Eventos y celebraciones especiales', NOW(), NOW()),
  ('Caridad y Servicio', 'caridad-servicio', 'Actividades de Cáritas y servicio social', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VERIFICACIÓN Y CONSULTAS
-- ============================================

-- Verificar tipos de misas insertados
SELECT * FROM mass_types ORDER BY display_order;

-- Verificar horarios de misas insertados
SELECT day_type, time, location, is_active 
FROM mass_available_times 
ORDER BY day_type, display_order;

-- Verificar métodos de pago
SELECT code, name, is_active FROM payment_methods ORDER BY display_order;

-- Verificar equipo pastoral
SELECT name, role FROM team_members WHERE is_active = true ORDER BY display_order;

-- Verificar configuración del sitio
SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
1. ACTUALIZAR LOS SIGUIENTES DATOS CON INFORMACIÓN REAL:
   - Números de teléfono de Yape/Plin
   - Datos bancarios para transferencias
   - URLs reales de redes sociales
   - Fotos reales del equipo pastoral
   - Horarios reales de misas

2. PERMISOS Y SEGURIDAD:
   - Asegurarse de que el usuario de la base de datos tenga permisos de INSERT/UPDATE
   - Revisar que las tablas existan antes de ejecutar el script

3. IMÁGENES:
   - Las URLs de Unsplash son temporales
   - Reemplazar con imágenes reales de la parroquia
   - Subir imágenes a un servidor propio o servicio de almacenamiento

4. PRÓXIMOS PASOS:
   - Implementar APIs para consumir esta data en el frontend
   - Crear interfaces de administración para cada sección
   - Configurar emails de notificación
   - Implementar backup automático de la base de datos
*/

-- Fin del script
